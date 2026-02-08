
import { createClient } from '@/utils/supabase/server';
import { CartItem } from '@/types';
import { getTier, TIERS } from '@/utils/tiers';

const SHIPPING_COST = 15;
const FREE_SHIPPING_THRESHOLD = 1500;

export async function processOrder(items: CartItem[], userId: string) {
    const supabase = await createClient();

    // 1. Verify Prices & Stock
    const productIds = items.map(item => item.id);
    const { data: dbProducts, error: productsError } = await supabase
        .from('products')
        .select('id, price, product_variants(id, price_override, stock_quantity)')
        .in('id', productIds);

    if (productsError || !dbProducts) {
        return { error: 'Failed to verify product prices.', success: false };
    }

    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
        const product = productMap.get(item.id);

        if (!product) {
            return { error: `Product ${item.title} no longer exists.`, success: false };
        }

        let price = Number(product.price);
        let variantId = item.variant_id;

        if (variantId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const variants = (product as any).product_variants || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const variant = variants.find((v: any) => v.id === variantId);

            if (!variant) {
                return { error: `Selected variant for ${item.title} is invalid.`, success: false };
            }

            if (variant.price_override) {
                price = Number(variant.price_override);
            }
        }

        // Use quantity from cart item, default to 1 if missing (legacy safety)
        const quantity = item.quantity || 1;
        calculatedTotal += price * quantity;

        verifiedItems.push({
            product_id: item.id,
            variant_id: variantId,
            price: price,
            quantity: quantity,
            title: item.title
        });
    }

    // 2. Calculate Shipping
    const { data: profile } = await supabase
        .from('profiles')
        .select('clout_score, email')
        .eq('id', userId)
        .single();

    const clout = profile?.clout_score || 0;
    const tier = getTier(clout);

    let shippingCost = SHIPPING_COST;
    const isMember = tier.minClout >= TIERS.MEMBER.minClout;

    if (calculatedTotal >= FREE_SHIPPING_THRESHOLD || isMember) {
        shippingCost = 0;
    }

    const finalTotal = calculatedTotal + shippingCost;

    // 3. Inventory Check & Lock
    const decrementedItems: { id: string, variant_id?: string, qty: number }[] = [];

    for (const item of verifiedItems) {
        let success = false;
        let error = null;

        if (item.variant_id) {
            const { data, error: rpcError } = await supabase.rpc('decrement_variant_stock', { p_variant_id: item.variant_id, p_quantity: item.quantity });
            success = !!data;
            error = rpcError;
        } else {
            const { data, error: rpcError } = await supabase.rpc('decrement_stock', { p_id: item.product_id, quantity: item.quantity });
            success = !!data;
            error = rpcError;
        }

        if (!success || error) {
            console.error(`Stock failure for ${item.product_id}`, error);
            // Rollback
            for (const prev of decrementedItems) {
                if (prev.variant_id) {
                    await supabase.rpc('increment_variant_stock', { p_variant_id: prev.variant_id, p_quantity: prev.qty });
                } else {
                    await supabase.rpc('increment_stock', { p_id: prev.id, quantity: prev.qty });
                }
            }
            return { error: `Item ${item.title} is out of stock.`, success: false };
        }

        decrementedItems.push({ id: item.product_id, variant_id: item.variant_id, qty: item.quantity });
    }

    // 4. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: userId,
            status: 'pending',
            payment_status: 'pending',
            total: finalTotal,
        })
        .select()
        .single();

    if (orderError) {
        console.error('Order creation failed:', orderError);
        // Rollback Inventory
        for (const prev of decrementedItems) {
            if (prev.variant_id) {
                await supabase.rpc('increment_variant_stock', { p_variant_id: prev.variant_id, p_quantity: prev.qty });
            } else {
                await supabase.rpc('increment_stock', { p_id: prev.id, quantity: prev.qty });
            }
        }
        return { error: 'Failed to create order.', success: false };
    }

    // 5. Create Order Items
    const orderItems = verifiedItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('Order items creation failed:', itemsError);
        return { error: 'Failed to save items.', success: false };
    }

    return { success: true, orderId: order.id, total: finalTotal, email: profile?.email };
}

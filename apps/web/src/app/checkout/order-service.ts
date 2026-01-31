
import { createClient } from '@/utils/supabase/server';
import { CartItem } from '@/types';
import { getTier, TIERS } from '@/utils/tiers';
import { sendOrderConfirmation } from '@/utils/email';

const SHIPPING_COST = 15;
const FREE_SHIPPING_THRESHOLD = 150;

export async function processOrder(items: CartItem[], userId: string) {
    const supabase = await createClient(); // Await the proper server client

    // 1. Verify Prices
    const productIds = items.map(item => item.id);
    const { data: dbProducts, error: productsError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds);

    if (productsError || !dbProducts) {
        return { error: 'Failed to verify product prices.' };
    }

    const priceMap = new Map(dbProducts.map(p => [p.id, Number(p.price)]));

    // Calculate Total & Verify Items
    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
        const price = priceMap.get(item.id);
        if (price !== undefined) {
            calculatedTotal += price;
            verifiedItems.push({
                product_id: item.id,
                price: price, // Use server price
                quantity: 1
            });
        }
    }

    // 2. Calculate Shipping
    const { data: profile } = await supabase
        .from('profiles')
        .select('clout_score, email') // Get email here if possible or just clout
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
    const decrementedItems: { id: string, qty: number }[] = [];

    for (const item of verifiedItems) {
        const { data: success, error } = await supabase.rpc('decrement_stock', { p_id: item.product_id, quantity: item.quantity });

        if (!success || error) {
            console.error(`Stock failure for ${item.product_id}`, error);
            // Rollback
            for (const prev of decrementedItems) {
                await supabase.rpc('increment_stock', { p_id: prev.id, quantity: prev.qty });
            }
            return { error: `One or more items are out of stock. Please update your cart.` };
        }
        decrementedItems.push({ id: item.product_id, qty: item.quantity });
    }

    // 4. Create Order (Pending)
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: userId,
            status: 'pending',
            total: finalTotal,
        })
        .select()
        .single();

    if (orderError) {
        console.error('Order creation failed:', orderError);
        // Rollback Inventory
        for (const prev of decrementedItems) {
            await supabase.rpc('increment_stock', { p_id: prev.id, quantity: prev.qty });
        }
        return { error: 'Failed to create order. Please try again.' };
    }

    // 5. Create Order Items
    const orderItems = verifiedItems.map(item => ({
        order_id: order.id,
        ...item
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('Order items creation failed:', itemsError);
        return { error: 'Failed to save items. Please contact support.' };
    }

    // Retrun success with order details
    return { success: true, orderId: order.id, total: finalTotal, email: profile?.email };
}

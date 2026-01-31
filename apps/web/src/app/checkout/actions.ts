'use server'

import { createClient } from '@/utils/supabase/server'
import { CartItem } from '@/types'
import { sendOrderConfirmation } from '@/utils/email'
import { getTier, TIERS } from '@/utils/tiers'

const SHIPPING_COST = 15;
const FREE_SHIPPING_THRESHOLD = 150;

// Define the shape of the data needed to create an order
// We pass cart items as a JSON string or simplified array because handling complex objects in FormData can be tricky
// Alternatively, we can assume the cart is passed as a hidden field or we might fetch it from a server-side store if it existed (but it's client-side Zustand)
// So we will expect the client to stringify the items into a hidden field.

export async function createOrder(formData: FormData) {
    const supabase = await createClient()

    // 1. Authenticate User
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to checkout.' }
    }

    // 2. Extract Data
    const itemsJson = formData.get('items') as string

    // Validate
    if (!itemsJson) {
        return { error: 'Invalid order data.' }
    }

    let cartItems: CartItem[] = []
    try {
        cartItems = JSON.parse(itemsJson)
    } catch {
        return { error: 'Corrupt cart data.' }
    }

    if (cartItems.length === 0) {
        return { error: 'Cart is empty.' }
    }

    // 3. Verify Prices with Server Data
    const productIds = cartItems.map(item => item.id)
    const { data: dbProducts, error: productsError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds)

    if (productsError || !dbProducts) {
        return { error: 'Failed to verify product prices.' }
    }

    // Create a map for fast lookup
    const priceMap = new Map(dbProducts.map(p => [p.id, Number(p.price)]))

    // Calculate Total
    let calculatedTotal = 0
    const verifiedItems = []

    for (const item of cartItems) {
        const price = priceMap.get(item.id)
        if (price !== undefined) {
            calculatedTotal += price
            verifiedItems.push({
                product_id: item.id,
                price: price, // Use server price
                quantity: 1
            })
        }
    }

    // 4. Calculate Shipping
    const { data: profile } = await supabase
        .from('profiles')
        .select('clout_score')
        .eq('id', user.id)
        .single();

    const clout = profile?.clout_score || 0;
    const tier = getTier(clout);

    let shippingCost = SHIPPING_COST;
    const isMember = tier.minClout >= TIERS.MEMBER.minClout;

    if (calculatedTotal >= FREE_SHIPPING_THRESHOLD || isMember) {
        shippingCost = 0;
    }

    const finalTotal = calculatedTotal + shippingCost;

    // --- INVENTORY CHECK & LOCK ---
    const decrementedItems: { id: string, qty: number }[] = [];
    
    // We process items sequentially to ensure consistency
    for (const item of verifiedItems) {
        const { data: success, error } = await supabase.rpc('decrement_stock', { p_id: item.product_id, quantity: item.quantity });
        
        if (!success || error) {
            console.error(`Stock failure for ${item.product_id}`, error);
            
            // ROLLBACK: Re-increment previously successful items
            for (const prev of decrementedItems) {
                await supabase.rpc('increment_stock', { p_id: prev.id, quantity: prev.qty });
            }
            
            return { error: `One or more items are out of stock. Please update your cart.` };
        }
        
        decrementedItems.push({ id: item.product_id, qty: item.quantity });
    }
    // ------------------------------

    // 5. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            status: 'pending',
            total: finalTotal,
        })
        .select()
        .single()

    if (orderError) {
        console.error('Order creation failed:', orderError)
        // ROLLBACK INVENTORY
        for (const prev of decrementedItems) {
            await supabase.rpc('increment_stock', { p_id: prev.id, quantity: prev.qty });
        }
        return { error: 'Failed to create order. Please try again.' }
    }

    // 6. Create Order Items
    const orderItems = verifiedItems.map(item => ({
        order_id: order.id,
        ...item
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        console.error('Order items creation failed:', itemsError)
        // Note: Use a more robust transaction in real production (Supabase creates implicit transactions for single RPCs but not across JS calls)
        // We might want to mark order as failed or refund inventory here too?
        // For now, we return error. Inventory is technically "lost" or "reserved" for a failed order.
        return { error: 'Failed to save items. Please contact support.' }
    }

    // 7. Send Email (Fire and Forget)
    if (user.email) {
        // We don't await this to speed up response
        sendOrderConfirmation(user.email, order.id, finalTotal).catch(console.error);
    }

    return { success: true, orderId: order.id }
}

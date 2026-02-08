'use server'

import { createClient } from '@/utils/supabase/server'
import { CartItem } from '@/types'
import { sendOrderConfirmation } from '@/utils/email'
import { processOrder } from './order-service'

export async function createOrder(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to checkout.' }
    }

    const itemsJson = formData.get('items') as string
    if (!itemsJson) return { error: 'Invalid order data.' }

    let cartItems: CartItem[] = []
    try {
        cartItems = JSON.parse(itemsJson)
    } catch {
        return { error: 'Corrupt cart data.' }
    }

    if (cartItems.length === 0) {
        return { error: 'Cart is empty.' }
    }

    // Call shared logic
    const result = await processOrder(cartItems, user.id);

    if (result.error || !result.success) {
        return { error: result.error };
    }

    // Send Email (Fire and Forget)
    if (result.email && result.orderId && result.total) { // Check required props
        sendOrderConfirmation(result.email, result.orderId, result.total).catch(console.error);
    } else if (user.email && result.orderId && result.total) {
        // Fallback to user auth email
        sendOrderConfirmation(user.email, result.orderId, result.total).catch(console.error);
    }

    return { success: true, orderId: result.orderId };
}

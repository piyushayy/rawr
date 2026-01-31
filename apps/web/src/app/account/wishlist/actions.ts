'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Please login to save items.' }
    }

    // Check if exists
    const { data: existing } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    if (existing) {
        // Remove
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('id', existing.id)

        if (error) return { error: error.message }
        revalidatePath('/account/wishlist')
        return { action: 'removed', message: 'Removed from Stash' }
    } else {
        // Add
        const { error } = await supabase
            .from('wishlists')
            .insert({ user_id: user.id, product_id: productId })

        if (error) return { error: error.message }
        revalidatePath('/account/wishlist')
        return { action: 'added', message: 'Added to Stash' }
    }
}

export async function checkWishlistStatus(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    return !!data
}

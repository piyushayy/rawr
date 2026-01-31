'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAddress(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const address = {
        user_id: user.id,
        full_name: formData.get('fullName'),
        phone: formData.get('phone'),
        address_line1: formData.get('addressLine1'),
        address_line2: formData.get('addressLine2'),
        city: formData.get('city'),
        state: formData.get('state'),
        postal_code: formData.get('postalCode'),
        country: 'USA', // Default for now
        is_default: formData.get('isDefault') === 'on'
    }

    const { error } = await supabase.from('addresses').insert(address)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/account/addresses')
    return { success: true }
}

export async function deleteAddress(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('addresses').delete().eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/account/addresses')
    return { success: true }
}

export async function setDefaultAddress(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // logic is handled by DB trigger, we just set this one to true
    const { error } = await supabase.from('addresses')
        .update({ is_default: true })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/account/addresses')
    return { success: true }
}

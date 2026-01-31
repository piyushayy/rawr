'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/utils/admin'

export async function updateOrderStatus(id: string, status: string, formData: FormData) {
    await checkAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from('orders').update({ status }).eq('id', id);

    if (error) {
        console.error("Failed to update order status:", error);
        return;
    }

    revalidatePath('/admin/orders');
}

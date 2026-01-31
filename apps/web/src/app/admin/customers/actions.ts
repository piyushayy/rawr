'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/utils/admin'

export async function updateCustomerNotes(userId: string, prevState: any, formData: FormData) {
    const notes = formData.get('notes') as string;
    await checkAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from('profiles').update({ admin_notes: notes }).eq('id', userId);

    if (error) {
        return { error: 'Failed to update notes.' };
    }

    revalidatePath(`/admin/customers/${userId}`);
    return { success: true };
}

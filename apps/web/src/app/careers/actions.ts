'use server'

import { createClient } from '@/utils/supabase/server'


export async function submitApplication(formData: FormData) {

    const supabase = await createClient();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const position = formData.get('position') as string; // subject
    const coverLetter = formData.get('coverLetter') as string; // message

    // Validation
    if (!name || !email || !position || !coverLetter) {
        return { error: 'All fields are required.' };
    }

    const { error } = await supabase.from('inbox').insert({
        type: 'career',
        name,
        email,
        subject: position,
        message: coverLetter,
        status: 'unread'
    });

    if (error) {
        console.error('Career submit error:', error);
        return { error: 'Failed to submit application. Please try again.' };
    }

    return { success: true, message: 'Application received. We will be in touch.' };
}

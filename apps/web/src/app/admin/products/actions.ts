'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { checkAdmin } from '@/utils/admin'

export async function createProduct(formData: FormData) {
    await checkAdmin();
    const supabase = await createClient();

    const product = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        size: formData.get('size') as string,
        condition: formData.get('condition') as string,
        category: formData.get('category') as string,
        images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(s => s), // Simple CSV for now
        details: (formData.get('details') as string).split('\n').filter(s => s), // Newline separated
        measurements: {
            chest: formData.get('measure_chest'),
            length: formData.get('measure_length'),
            sleeve: formData.get('measure_sleeve'),
            waist: formData.get('measure_waist'),
            inseam: formData.get('measure_inseam'),
        },
        video_url: formData.get('video_url') as string || null,
        stock_quantity: Number(formData.get('stock_quantity') || 0),
        sold_out: false,
        release_date: formData.get('release_date') ? new Date(formData.get('release_date') as string).toISOString() : null,
    }

    const { error } = await supabase.from('products').insert(product);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    await checkAdmin();
    const supabase = await createClient();

    const product = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        size: formData.get('size') as string,
        condition: formData.get('condition') as string,
        category: formData.get('category') as string,
        images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(s => s),
        details: (formData.get('details') as string).split('\n').filter(s => s),
        measurements: {
            chest: formData.get('measure_chest'),
            length: formData.get('measure_length'),
            sleeve: formData.get('measure_sleeve'),
            waist: formData.get('measure_waist'),
            inseam: formData.get('measure_inseam'),
        },
        video_url: formData.get('video_url') as string || null,
        stock_quantity: Number(formData.get('stock_quantity') || 0),
        sold_out: formData.get('sold_out') === 'on',
        release_date: formData.get('release_date') ? new Date(formData.get('release_date') as string).toISOString() : null,
    }

    const { error } = await supabase.from('products').update(product).eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath(`/product/${id}`);
    redirect('/admin/products');
}

export async function deleteProduct(id: string, formData: FormData) {
    await checkAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        console.error("Failed to delete product:", error);
        return;
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
}

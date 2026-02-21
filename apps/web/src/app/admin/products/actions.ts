'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { checkAdmin } from '@/utils/admin'

export async function createProduct(formData: FormData) {
    await checkAdmin();
    const supabase = await createClient();

    let variants: any[] = [];
    try {
        const variantsJson = formData.get('variants_json') as string;
        if (variantsJson) variants = JSON.parse(variantsJson);
    } catch (e) { console.error("Failed to parse variants", e); }

    const aggregateStock = variants.reduce((sum, v) => sum + (parseInt(v.stock_quantity) || 0), 0);
    const legacySize = variants.length > 0 ? variants.map(v => v.size).join(', ') : 'OS';

    const product = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        size: legacySize,
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
        stock_quantity: aggregateStock,
        sold_out: false,
        release_date: formData.get('release_date') ? new Date(formData.get('release_date') as string).toISOString() : null,
        seo_title: formData.get('seo_title') as string || null,
        seo_description: formData.get('seo_description') as string || null,
    }

    const { data: newProduct, error } = await supabase.from('products').insert(product).select('id').single();

    if (error) {
        return { error: error.message };
    }

    // Insert variants
    if (variants.length > 0 && newProduct) {
        const variantPayload = variants.map(v => ({
            product_id: newProduct.id,
            sku: v.sku || `${newProduct.id.slice(0, 8)}-${v.size}`,
            size: v.size,
            stock_quantity: v.stock_quantity
        }));
        await supabase.from('product_variants').insert(variantPayload);
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    await checkAdmin();
    const supabase = await createClient();

    let variants: any[] = [];
    try {
        const variantsJson = formData.get('variants_json') as string;
        if (variantsJson) variants = JSON.parse(variantsJson);
    } catch (e) { console.error("Failed to parse variants", e); }

    const aggregateStock = variants.reduce((sum, v) => sum + (parseInt(v.stock_quantity) || 0), 0);
    const legacySize = variants.length > 0 ? variants.map(v => v.size).join(', ') : 'OS';

    const product = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        size: legacySize,
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
        stock_quantity: aggregateStock,
        sold_out: formData.get('sold_out') === 'on',
        release_date: formData.get('release_date') ? new Date(formData.get('release_date') as string).toISOString() : null,
        seo_title: formData.get('seo_title') as string || null,
        seo_description: formData.get('seo_description') as string || null,
    }

    const { error } = await supabase.from('products').update(product).eq('id', id);

    if (error) {
        return { error: error.message };
    }

    if (variants.length > 0) {
        const variantPayload = variants.map(v => {
            const payload: any = {
                product_id: id,
                sku: v.sku || `${id.slice(0, 8)}-${v.size}`,
                size: v.size,
                stock_quantity: v.stock_quantity
            };
            if (v.id) payload.id = v.id;
            return payload;
        });

        const { error: variantError } = await supabase.from('product_variants').upsert(variantPayload, { onConflict: 'id' });
        if (variantError) console.error("Variant Upsert error:", variantError.message);

        // Delete removed variants
        const variantIds = variants.map(v => v.id).filter(Boolean);
        if (variantIds.length > 0) {
            await supabase.from('product_variants').delete().eq('product_id', id).not('id', 'in', `(${variantIds.join(',')})`);
        }
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

export async function notifyWaitlist(productId: string) {
    await checkAdmin();
    const supabase = await createClient();

    const { data: product } = await supabase.from('products').select('*').eq('id', productId).single();
    if (!product) return { error: "Product not found" };

    const { data: requests } = await supabase.from('stock_requests').select('*').eq('product_id', productId).eq('notified', false);

    if (!requests || requests.length === 0) {
        return { message: "No unnotified emails on waitlist." };
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

    if (!process.env.RESEND_API_KEY) {
        return { error: "No RESEND_API_KEY standard. Emails were not sent." };
    }

    const bccEmails = requests.map(r => r.user_email);

    try {
        await resend.emails.send({
            from: 'RAWR STORE <updates@rawr.store>', // Verification required in actual prod
            to: ['orders@rawr.store'], // self
            bcc: bccEmails,
            subject: `BACK IN STOCK: ${product.title}`,
            html: `
                <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; text-align: center;">
                    <h1 style="font-size: 32px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px;">
                        RESTOCKED. YOU'RE UP.
                    </h1>
                    <p style="font-size: 16px; margin-bottom: 30px; color: #ccc;">
                        You asked us to hunt down <strong>${product.title}</strong>.<br/>
                        It's secured. But it won't last.
                    </p>
                    <a href="https://rawr.store/product/${product.id}" style="background: #FF0000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase;">
                        SNATCH IT
                    </a>
                </div>
            `,
        });

        // Mark as notified so we don't spam
        await supabase.from('stock_requests').update({ notified: true }).eq('product_id', productId);

        return { message: `Notified ${bccEmails.length} users successfully.` };
    } catch (e: any) {
        return { error: e.message };
    }
}

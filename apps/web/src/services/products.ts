import { Product } from "@/types";
import { createClient } from "@/utils/supabase/server";

// Helper to map DB result to Product type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDatabaseToProduct = (row: any): Product => ({
    id: row.id,
    title: row.title,
    price: Number(row.price),
    description: row.description || "",
    size: row.size || "",
    condition: row.condition || "",
    images: row.images || [],
    details: row.details || [],
    measurements: row.measurements || {},
    soldOut: row.sold_out,
    category: row.category,
    video_url: row.video_url,
    stock_quantity: row.stock_quantity ?? 1,
    // Map variants if they exist (joined via relation)
    variants: row.product_variants ? row.product_variants.map((v: any) => ({
        id: v.id,
        product_id: v.product_id,
        sku: v.sku,
        size: v.size,
        stock_quantity: v.stock_quantity,
        price_override: v.price_override
    })) : []
});

export const getProducts = async (): Promise<Product[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    return (data || []).map(mapDatabaseToProduct);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("id", id)
        .single();

    if (error) {
        console.error(`Error fetching product ${id}:`, error);
        return undefined;
    }

    return mapDatabaseToProduct(data);
};

export const getLatestDrop = async (): Promise<Product[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .order("created_at", { ascending: false })
        .limit(4);

    if (error) {
        console.error("Error fetching latest drops:", error);
        return [];
    }

    return (data || []).map(mapDatabaseToProduct);
};


export interface SearchParams {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    sort?: 'price_asc' | 'price_desc' | 'newest';
}

export const searchProducts = async (params: SearchParams): Promise<Product[]> => {
    const supabase = await createClient();
    let query = supabase.from("products").select("*, product_variants(*)");

    if (params.query) {
        query = query.ilike("title", `%${params.query}%`);
    }

    if (params.category && params.category !== 'all') {
        query = query.eq("category", params.category);
    }

    if (params.size && params.size !== 'all') {
        query = query.eq("size", params.size);
    }

    if (params.minPrice) {
        query = query.gte("price", params.minPrice);
    }

    if (params.maxPrice) {
        query = query.lte("price", params.maxPrice);
    }

    if (params.sort === 'price_asc') {
        query = query.order('price', { ascending: true });
    } else if (params.sort === 'price_desc') {
        query = query.order('price', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error searching products:", error);
        return [];
    }

    return (data || []).map(mapDatabaseToProduct);
};

export const getRelatedProducts = async (currentProductId: string, category: string): Promise<Product[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("category", category)
        .neq("id", currentProductId)
        .limit(4);

    if (error) {
        console.error("Error fetching related products:", error);
        return [];
    }

    return (data || []).map(mapDatabaseToProduct);
};

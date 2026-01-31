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
    release_date: row.release_date,
});

export const getProducts = async (): Promise<Product[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
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
        .select("*")
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
    // Assuming "Latest Drops" are products dropped recently or in the future
    // For now, just return the most recent 4 items
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("release_date", { ascending: false })
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
    let query = supabase.from("products").select("*");

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
        .select("*")
        .eq("category", category)
        .neq("id", currentProductId)
        .limit(4);

    if (error) {
        console.error("Error fetching related products:", error);
        return [];
    }

    return (data || []).map(mapDatabaseToProduct);
};

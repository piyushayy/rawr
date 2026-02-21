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

export const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
    if (!ids || ids.length === 0) return [];

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("products")
            .select("*, product_variants(*)")
            .in("id", ids);

        if (error) {
            console.error("Error fetching products by ids:", error);
            return [];
        }

        // Sort to match the order of IDs (usually most recent first)
        return (data || [])
            .map(mapDatabaseToProduct)
            .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    } catch (e) {
        console.error("Caught exception fetching products by ids:", e);
        return [];
    }
};

export const getLatestDrop = async (): Promise<Product[]> => {
    try {
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
    } catch (err) {
        console.error("Caught exception fetching latest drops (Supabase may be down):", err);
        return [];
    }
};


export interface SearchParams {
    query?: string;
    category?: string | string[];
    minPrice?: number;
    maxPrice?: number;
    size?: string | string[];
    sort?: 'price_asc' | 'price_desc' | 'newest';
}

export const searchProducts = async (params: SearchParams): Promise<Product[]> => {
    try {
        const supabase = await createClient();
        let query = supabase.from("products").select("*, product_variants(*)");

        if (params.query) {
            query = query.ilike("title", `%${params.query}%`);
        }

        if (params.category && params.category !== 'all') {
            const cats = Array.isArray(params.category) ? params.category : [params.category];
            query = query.in("category", cats);
        }

        if (params.size && params.size !== 'all') {
            const sizes = Array.isArray(params.size) ? params.size : [params.size];
            query = query.in("size", sizes);
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
    } catch (e) {
        console.error("Caught exception searching products:", e);
        return [];
    }
};

export const getRelatedProducts = async (currentProductId: string, category: string): Promise<Product[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("category", category)
        .eq("sold_out", false)
        .neq("id", currentProductId)
        .limit(10);

    if (error) {
        console.error("Error fetching related products:", error);
        return [];
    }

    if (!data || data.length === 0) return [];

    // JS-side random sort to simulate variety in "Stylistic Similarities"
    const shuffled = data.sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 4).map(mapDatabaseToProduct);
};

export const getRecommendations = async (category: string, currentProductId?: string): Promise<Product[]> => {
    const supabase = await createClient();

    // Complete the Look: suggest complementary categories based on the current product
    let targetCategories: string[] = [];
    if (category === 'tops' || category === 'outerwear') targetCategories = ['bottoms', 'shoes', 'accessories'];
    else if (category === 'bottoms') targetCategories = ['tops', 'outerwear', 'shoes'];
    else if (category === 'shoes') targetCategories = ['bottoms', 'tops', 'accessories'];
    else targetCategories = ['tops', 'bottoms', 'outerwear'];

    let query = supabase
        .from("products")
        .select("*, product_variants(*)")
        .in("category", targetCategories)
        .eq("sold_out", false)
        .limit(10);

    if (currentProductId) {
        query = query.neq("id", currentProductId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching recommendations:", error);
        return [];
    }

    if (!data || data.length === 0) return [];

    // Sort randomly in JS for "Complete the Look" variety
    const shuffled = data.sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 3).map(mapDatabaseToProduct);
};

export const getArchivedProducts = async (): Promise<Product[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("sold_out", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching archived products:", error);
        return [];
    }

    return (data || []).map(mapDatabaseToProduct);
};

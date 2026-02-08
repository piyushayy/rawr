export interface ProductVariant {
    id: string;
    product_id: string;
    sku: string;
    size: string;
    stock_quantity: number;
    price_override?: number;
}

export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    size: string; // Deprecated but kept for display
    condition: string;
    images: string[];
    details: string[];
    measurements: {
        chest: string;
        length: string;
        sleeve?: string;
        waist?: string;
        inseam?: string;
    };
    soldOut: boolean;
    category: 'dresses' | 'tops' | 'bottoms' | 'lingerie' | 'outerwear' | 'shoes' | 'accessories' | 'clothing' | 'plus';
    stock_quantity: number; // Aggregate stock
    release_date?: string | null;
    video_url?: string;
    variants?: ProductVariant[]; // New field
}

export interface CartItem {
    id: string; // Product ID
    variant_id?: string; // New field
    title: string;
    price: number;
    image: string;
    size: string;
    quantity: number; // Added quantity tracking
}

export interface Address {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
    created_at: string;
}

export interface Coupon {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    value: number;
    min_order_value: number;
}

export interface SupportTicket {
    id: string;
    user_id: string;
    subject: string;
    message: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at: string;
}

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

// --- CRM Phase 1 Types ---

export interface Discount {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    usage_limit: number | null;
    used_count: number;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Return {
    id: string;
    order_id: string;
    user_id: string;
    status: 'pending' | 'approved' | 'rejected' | 'refunded';
    reason: string;
    refund_amount: number | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface InventoryLog {
    id: string;
    product_id: string;
    admin_id: string | null;
    change_amount: number;
    reason: string;
    created_at: string;
}

export interface AbandonedCart {
    id: string;
    user_id: string | null;
    email: string | null;
    cart_state: any; // Using any or specific interface for cart state JSONB
    total_value: number;
    recovered: boolean;
    recovery_email_sent: boolean;
    created_at: string;
    updated_at: string;
}

// --- SaaS CRM Types ---

export interface CrmCustomer {
    id: string; // references auth.users(id)
    email: string;
    phone?: string;
    lifetime_value: number;
    total_orders: number;
    loyalty_tier?: string;
    status: 'active' | 'inactive' | 'banned';
    tags: string[]; // JSONB array of strings
    created_at: string;
    last_active_at: string;
}

export interface CustomerEvent {
    id: string;
    customer_id?: string;
    event_type: string;
    event_data: any; // Context JSONB
    source?: string;
    url?: string;
    session_id?: string;
    created_at: string;
}

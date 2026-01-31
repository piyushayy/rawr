export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    size: string;
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
    category: 'tops' | 'bottoms' | 'outerwear' | 'accessories';
    release_date: string | null;
}

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    size: string;
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

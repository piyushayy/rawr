import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CartItem } from '@/types';

interface Product extends CartItem { }

interface CartState {
    items: Product[];
    isOpen: boolean;
    addItem: (item: Product) => void;
    removeItem: (id: string) => void;
    toggleCart: () => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,
            addItem: (item) => set((state) => ({ items: [...state.items, item], isOpen: true })),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'rawr-cart-storage',
        }
    )
);

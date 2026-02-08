import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CartItem } from '@/types';

interface Product extends CartItem { }

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: string, variant_id?: string) => void;
    updateQuantity: (id: string, variant_id: string | undefined, delta: number) => void;
    toggleCart: () => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,
            addItem: (newItem) => set((state) => {
                const existingItemIndex = state.items.findIndex(
                    (i) => i.id === newItem.id && i.variant_id === newItem.variant_id
                );

                if (existingItemIndex > -1) {
                    const newItems = [...state.items];
                    newItems[existingItemIndex].quantity += (newItem.quantity || 1);
                    return { items: newItems, isOpen: true };
                }

                return { items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }], isOpen: true };
            }),
            removeItem: (id, variant_id) => set((state) => ({
                items: state.items.filter((i) => !(i.id === id && i.variant_id === variant_id))
            })),
            updateQuantity: (id, variant_id, delta) => set((state) => {
                const newItems = state.items.map(item => {
                    if (item.id === id && item.variant_id === variant_id) {
                        return { ...item, quantity: Math.max(1, item.quantity + delta) };
                    }
                    return item;
                });
                return { items: newItems };
            }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'rawr-cart-storage-v2', // Bump version
        }
    )
);

/**
 * ============================================================
 * Zustand Cart Store
 * ============================================================
 *
 * Global state for the shopping cart.
 * Persisted to localStorage so the cart survives page refreshes.
 *
 * Usage:
 *   import { useCartStore } from "@/stores/cart-store";
 *
 *   // Inside a component:
 *   const { items, addItem, removeItem, totalItems, totalPrice } = useCartStore();
 * ============================================================
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

// ---------------------------------------------------------------------------
// Store Interface
// ---------------------------------------------------------------------------

interface CartState {
    /** All items currently in the cart */
    items: CartItem[];

    // ---- Actions ----

    /** Add a product to the cart (or increment quantity if already present) */
    addItem: (product: Product) => void;

    /** Remove a single unit of a product from the cart */
    removeItem: (productId: string) => void;

    /** Remove a product entirely from the cart (regardless of quantity) */
    deleteItem: (productId: string) => void;

    /** Empty the entire cart */
    clearCart: () => void;

    // ---- Derived values (computed helpers) ----

    /** Total number of individual items in the cart */
    totalItems: () => number;

    /** Total price of all items in the cart (in ₹) */
    totalPrice: () => number;
}

// ---------------------------------------------------------------------------
// Store Implementation
// ---------------------------------------------------------------------------

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) =>
                set((state) => {
                    // Check if this product is already in the cart
                    const existing = state.items.find(
                        (item) => item.product.id === product.id,
                    );

                    if (existing) {
                        // Increment quantity of existing item
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item,
                            ),
                        };
                    }

                    // Add new item with quantity 1
                    return { items: [...state.items, { product, quantity: 1 }] };
                }),

            removeItem: (productId) =>
                set((state) => {
                    const existing = state.items.find(
                        (item) => item.product.id === productId,
                    );

                    if (!existing) return state;

                    if (existing.quantity <= 1) {
                        // Remove the item entirely if quantity would reach 0
                        return {
                            items: state.items.filter(
                                (item) => item.product.id !== productId,
                            ),
                        };
                    }

                    // Decrement quantity
                    return {
                        items: state.items.map((item) =>
                            item.product.id === productId
                                ? { ...item, quantity: item.quantity - 1 }
                                : item,
                        ),
                    };
                }),

            deleteItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                })),

            clearCart: () => set({ items: [] }),

            totalItems: () =>
                get().items.reduce((sum, item) => sum + item.quantity, 0),

            totalPrice: () =>
                get().items.reduce(
                    (sum, item) =>
                        sum + (item.product.salePrice ?? item.product.price) * item.quantity,
                    0,
                ),
        }),
        {
            // Persist cart to localStorage under this key
            name: "jewelry-lounge-cart",
        },
    ),
);

/**
 * ============================================================
 * Zustand Cart Store
 * ============================================================
 *
 * Global state for the shopping cart.
 * Persisted to localStorage so the cart survives page refreshes.
 * Also synchronizes with Supabase `cart` table when a user is logged in.
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
import { supabase } from "@/lib/supabase/client";
import type { CartItemWithProduct, Product } from "@/types";

// ---------------------------------------------------------------------------
// Store Interface
// ---------------------------------------------------------------------------

interface CartState {
    /** All items currently in the cart */
    items: CartItemWithProduct[];
    loading: boolean;

    // ---- Actions ----

    /** Fetch cart items from Supabase for logged-in user */
    fetchCart: (userId: string) => Promise<void>;

    /** Add a product to the cart (or increment quantity if already present) */
    addItem: (product: Product, userId?: string) => Promise<void>;

    /** Remove a single unit of a product from the cart */
    removeItem: (productId: string, userId?: string) => Promise<void>;

    /** Remove a product entirely from the cart (regardless of quantity) */
    deleteItem: (productId: string, userId?: string) => Promise<void>;

    /** Empty the entire cart */
    clearCart: (userId?: string) => Promise<void>;

    /** Set loading state */
    setLoading: (loading: boolean) => void;

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
            loading: false,

            setLoading: (loading) => set({ loading }),

            fetchCart: async (userId: string) => {
                set({ loading: true });
                const { data } = await supabase
                    .from("cart")
                    .select("*, product:products(*)")
                    .eq("user_id", userId)
                    .is("save_type", null)
                    .order("id", { ascending: false });

                if (data) {
                    const validItems = data.filter((row: any) => row.product != null);
                    set({
                        items: validItems.map((row: any) => ({
                            product: row.product as Product,
                            quantity: row.quantity,
                        })),
                    });
                }
                set({ loading: false });
            },

            addItem: async (product, userId) => {
                const { items } = get();
                const existing = items.find((item) => item.product.id === product.id);

                // Optimistic Update
                if (existing) {
                    set({
                        items: items.map((item) =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item,
                        ),
                    });
                } else {
                    set({ items: [...items, { product, quantity: 1 }] });
                }

                // DB Sync
                if (userId) {
                    if (existing) {
                        // Find the cart row id to update if needed. But easier to select and update via product_id
                        const { data } = await supabase
                            .from("cart")
                            .select("id, quantity")
                            .eq("user_id", userId)
                            .eq("product_id", product.id)
                            .is("save_type", null)
                            .single();

                        if (data) {
                            await supabase
                                .from("cart")
                                .update({ quantity: data.quantity + 1 })
                                .eq("id", data.id);
                        }
                    } else {
                        await supabase.from("cart").insert({
                            user_id: userId,
                            product_id: product.id,
                            quantity: 1,
                            save_type: null,
                        });
                    }
                }
            },

            removeItem: async (productId, userId) => {
                const { items } = get();
                const existing = items.find((item) => item.product.id === productId);

                if (!existing) return;

                // Optimistic Update
                if (existing.quantity <= 1) {
                    set({
                        items: items.filter((item) => item.product.id !== productId),
                    });
                } else {
                    set({
                        items: items.map((item) =>
                            item.product.id === productId
                                ? { ...item, quantity: item.quantity - 1 }
                                : item,
                        ),
                    });
                }

                // DB Sync
                if (userId) {
                    const { data } = await supabase
                        .from("cart")
                        .select("id, quantity")
                        .eq("user_id", userId)
                        .eq("product_id", productId)
                        .is("save_type", null)
                        .single();

                    if (data) {
                        if (data.quantity <= 1) {
                            await supabase.from("cart").delete().eq("id", data.id);
                        } else {
                            await supabase
                                .from("cart")
                                .update({ quantity: data.quantity - 1 })
                                .eq("id", data.id);
                        }
                    }
                }
            },

            deleteItem: async (productId, userId) => {
                // Optimistic Update
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }));

                // DB Sync
                if (userId) {
                    await supabase
                        .from("cart")
                        .delete()
                        .eq("user_id", userId)
                        .eq("product_id", productId)
                        .is("save_type", null);
                }
            },

            clearCart: async (userId) => {
                set({ items: [] });
                // DB Sync
                if (userId) {
                    await supabase
                        .from("cart")
                        .delete()
                        .eq("user_id", userId)
                        .is("save_type", null);
                }
            },

            totalItems: () =>
                get().items.reduce((sum, item) => sum + item.quantity, 0),

            totalPrice: () =>
                get().items.reduce(
                    (sum, item) =>
                        sum + (item.product.discount_price ?? item.product.selling_price) * item.quantity,
                    0,
                ),
        }),
        {
            // Persist cart to localStorage under this key (acts as guest cart)
            name: "jewelry-lounge-cart",
        },
    ),
);

/**
 * ============================================================
 * Zustand Likes Store — Wishlist & Liked Items
 * ============================================================
 *
 * Syncs liked product IDs with Supabase `cart` table
 * (save_type = "liked"). Provides a simple `isLiked(id)` check
 * and `toggleLike(productId)` for all heart buttons.
 *
 * Usage:
 *   import { useLikesStore } from "@/stores/likes-store";
 *   const { likedIds, toggleLike, isLiked } = useLikesStore();
 * ============================================================
 */

import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

interface LikesState {
    /** Set of product IDs the current user has liked */
    likedIds: Set<string>;

    /** Set of product IDs the current user has wishlisted */
    wishlistIds: Set<string>;

    /** Whether initial fetch is in progress */
    loading: boolean;

    /** Fetch all liked product IDs for the current user */
    fetchLikes: (userId: string) => Promise<void>;

    /** Fetch all wishlisted product IDs for the current user */
    fetchWishlist: (userId: string) => Promise<void>;

    /** Check if a product is liked */
    isLiked: (productId: string) => boolean;

    /** Check if a product is wishlisted */
    isWishlisted: (productId: string) => boolean;

    /** Toggle like status — adds or removes from Supabase */
    toggleLike: (userId: string, productId: string) => Promise<void>;

    /** Toggle wishlist status — adds or removes from Supabase */
    toggleWishlist: (userId: string, productId: string) => Promise<void>;

    /** Clear likes and wishlists (on sign out) */
    clearLikes: () => void;
}

export const useLikesStore = create<LikesState>()((set, get) => ({
    likedIds: new Set(),
    wishlistIds: new Set(),
    loading: false,

    fetchLikes: async (userId: string) => {
        set({ loading: true });

        const { data } = await supabase
            .from("cart")
            .select("product_id")
            .eq("user_id", userId)
            .eq("save_type", "liked");

        const ids = new Set((data ?? []).map((row: any) => row.product_id));
        set({ likedIds: ids, loading: false });
    },

    fetchWishlist: async (userId: string) => {
        set({ loading: true });

        const { data } = await supabase
            .from("cart")
            .select("product_id")
            .eq("user_id", userId)
            .eq("save_type", "wishlist");

        const ids = new Set((data ?? []).map((row: any) => row.product_id));
        set({ wishlistIds: ids, loading: false });
    },

    isLiked: (productId: string) => {
        return get().likedIds.has(productId);
    },

    isWishlisted: (productId: string) => {
        return get().wishlistIds.has(productId);
    },

    toggleLike: async (userId: string, productId: string) => {
        const { likedIds } = get();
        const alreadyLiked = likedIds.has(productId);

        if (alreadyLiked) {
            // Remove like — optimistic update
            const next = new Set(likedIds);
            next.delete(productId);
            set({ likedIds: next });

            await supabase
                .from("cart")
                .delete()
                .eq("user_id", userId)
                .eq("product_id", productId)
                .eq("save_type", "liked");
        } else {
            // Add like — optimistic update
            const next = new Set(likedIds);
            next.add(productId);
            set({ likedIds: next });

            await supabase
                .from("cart")
                .insert({
                    user_id: userId,
                    product_id: productId,
                    quantity: 1,
                    save_type: "liked",
                });
        }
    },

    toggleWishlist: async (userId: string, productId: string) => {
        const { wishlistIds } = get();
        const alreadyWishlisted = wishlistIds.has(productId);

        if (alreadyWishlisted) {
            // Remove wishlist — optimistic update
            const next = new Set(wishlistIds);
            next.delete(productId);
            set({ wishlistIds: next });

            await supabase
                .from("cart")
                .delete()
                .eq("user_id", userId)
                .eq("product_id", productId)
                .eq("save_type", "wishlist");
        } else {
            // Add wishlist — optimistic update
            const next = new Set(wishlistIds);
            next.add(productId);
            set({ wishlistIds: next });

            await supabase
                .from("cart")
                .insert({
                    user_id: userId,
                    product_id: productId,
                    quantity: 1,
                    save_type: "wishlist",
                });
        }
    },

    clearLikes: () => set({ likedIds: new Set(), wishlistIds: new Set() }),
}));

/**
 * ============================================================
 * Auth Provider — Initializes Auth & Likes
 * ============================================================
 *
 * Wraps the app to start listening for auth state changes on mount.
 * Also loads liked product IDs when user signs in and clears
 * them on sign out.
 * ============================================================
 */

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useLikesStore } from "@/stores/likes-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initialize = useAuthStore((s) => s.initialize);
    const user = useAuthStore((s) => s.user);
    const fetchLikes = useLikesStore((s) => s.fetchLikes);
    const clearLikes = useLikesStore((s) => s.clearLikes);

    const fetchWishlist = useLikesStore((s) => s.fetchWishlist);

    useEffect(() => {
        const cleanup = initialize();
        return cleanup;
    }, [initialize]);

    // Load likes and wishlist when user signs in, clear on sign out
    useEffect(() => {
        if (user) {
            fetchLikes(user.id);
            fetchWishlist(user.id);
        } else {
            clearLikes();
        }
    }, [user, fetchLikes, fetchWishlist, clearLikes]);

    return <>{children}</>;
}

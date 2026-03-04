/**
 * ============================================================
 * Auth Provider — Initializes Auth Listener
 * ============================================================
 *
 * Wrap the app with this to start listening for auth state
 * changes on mount. Must be a client component.
 * ============================================================
 */

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initialize = useAuthStore((s) => s.initialize);

    useEffect(() => {
        const cleanup = initialize();
        return cleanup;
    }, [initialize]);

    return <>{children}</>;
}

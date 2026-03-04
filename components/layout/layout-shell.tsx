/**
 * ============================================================
 * Layout Shell — Conditional Layout Wrapper
 * ============================================================
 *
 * Client component that switches between:
 *   - Shop layout: mobile-first max-w-md with Header + BottomNav
 *   - Admin layout: full-width, no Header/BottomNav (admin has its own)
 * ============================================================
 */

"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    // Admin routes — full-width, no shop header/nav
    if (isAdmin) {
        return (
            <div className="min-h-screen w-full bg-white dark:bg-slate-900">
                {children}
            </div>
        );
    }

    // Shop routes — mobile-first centered container
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-slate-900 shadow-2xl">
            {/* Header — auto-hides on scroll */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 pb-20">{children}</main>

            {/* Bottom Navigation — fixed at bottom */}
            <BottomNav />
        </div>
    );
}

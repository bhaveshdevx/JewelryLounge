/**
 * ============================================================
 * BottomNav — Fixed Mobile Bottom Navigation Bar
 * ============================================================
 *
 * 4 tabs: Home, Feed, Cart, Profile
 * Highlights the active tab based on current pathname.
 * Cart tab shows a badge with item count from Zustand.
 *
 * Uses Material Symbols Outlined icons.
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";

const NAV_TABS = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Feed", href: "/feed", icon: "feed" },
    { label: "Cart", href: "/cart", icon: "shopping_cart" },
    { label: "Profile", href: "/profile", icon: "person" },
] as const;

export function BottomNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    // Always call hooks at the top level
    const totalItems = useCartStore((s) => s.totalItems());

    // Fix Hydration Mismatch: Only show dynamic data after mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex w-full max-w-md mx-auto items-center justify-around border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-2 pb-5 pt-3 h-16 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
            {NAV_TABS.map((tab) => {
                const isActive =
                    tab.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(tab.href);

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`flex flex-col items-center justify-center gap-0.5 w-14 transition-colors ${isActive ? "text-primary" : "text-slate-400 hover:text-primary"
                            }`}
                    >
                        <span className="relative">
                            <span
                                className="material-symbols-outlined !text-[22px]"
                                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                                {tab.icon}
                            </span>

                            {/* Cart badge - Only render if mounted to avoid hydration errors */}
                            {mounted && tab.label === "Cart" && totalItems > 0 && (
                                <span className="absolute -top-1 -right-2 bg-primary text-white text-[8px] font-bold h-3.5 min-w-[14px] flex items-center justify-center rounded-full border border-white px-0.5 animate-in zoom-in duration-300">
                                    {totalItems > 9 ? "9+" : totalItems}
                                </span>
                            )}
                        </span>
                        <span className="text-[9px] font-medium">{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
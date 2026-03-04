/**
 * ============================================================
 * Admin Layout — Responsive Sidebar + Tab Navigation
 * ============================================================
 *
 * Wraps all /admin/* pages. Redirects non-admin users to home.
 * Desktop: Fixed sidebar with nav links on the left.
 * Mobile: Horizontal tab bar at the top.
 * ============================================================
 */

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

const ADMIN_TABS = [
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    { label: "Products", href: "/admin/products", icon: "inventory_2" },
    { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAdmin, isLoading } = useAuthStore();

    // Guard — redirect if not admin
    useEffect(() => {
        if (!isLoading && (!user || !isAdmin)) {
            router.replace("/");
        }
    }, [user, isAdmin, isLoading, router]);

    // Show spinner while checking auth
    if (isLoading || !isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
            {/* ──────── Desktop Sidebar (hidden on mobile) ──────── */}
            <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white shrink-0 fixed inset-y-0 left-0 z-30">
                {/* Brand */}
                <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
                    <span className="material-symbols-outlined text-primary text-[28px]">
                        admin_panel_settings
                    </span>
                    <div>
                        <h1 className="text-base font-bold leading-tight">Jewelry Lounge</h1>
                        <p className="text-[10px] text-slate-400 font-medium">Admin Panel</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {ADMIN_TABS.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to Shop link */}
                <div className="px-3 py-4 border-t border-slate-800">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            arrow_back
                        </span>
                        Back to Shop
                    </Link>
                </div>
            </aside>

            {/* ──────── Main Content Area ──────── */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Mobile Header (hidden on desktop) */}
                <div className="lg:hidden sticky top-0 z-20 bg-slate-900 text-white px-4 py-3">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                            admin_panel_settings
                        </span>
                        <h1 className="text-base font-bold">Admin Dashboard</h1>
                        <Link
                            href="/"
                            className="ml-auto text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[14px]">
                                arrow_back
                            </span>
                            Back to Shop
                        </Link>
                    </div>

                    {/* Mobile Tab Navigation */}
                    <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                        {ADMIN_TABS.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${isActive
                                        ? "bg-primary text-white shadow-sm"
                                        : "text-slate-400 hover:text-white"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop Top Bar */}
                <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                        {ADMIN_TABS.find((t) => t.href === pathname)?.label || "Admin"}
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Welcome, Admin
                        </span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-4 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}

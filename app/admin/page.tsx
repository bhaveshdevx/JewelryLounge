/**
 * ============================================================
 * Admin Dashboard — Overview Page
 * ============================================================
 *
 * Shows key stats: total products, orders, revenue, pending orders.
 * Quick-action cards for common admin tasks.
 * Responsive: 2-col on mobile, 4-col on desktop.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/supabase/admin-queries";
import { CURRENCY } from "@/lib/constants";

interface Stats {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats().then((data) => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    const statCards = stats
        ? [
            {
                label: "Total Products",
                value: stats.totalProducts.toString(),
                icon: "inventory_2",
                color: "bg-blue-500",
                lightBg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
                label: "Total Orders",
                value: stats.totalOrders.toString(),
                icon: "receipt_long",
                color: "bg-green-500",
                lightBg: "bg-green-50 dark:bg-green-500/10",
            },
            {
                label: "Pending Orders",
                value: stats.pendingOrders.toString(),
                icon: "pending_actions",
                color: "bg-amber-500",
                lightBg: "bg-amber-50 dark:bg-amber-500/10",
            },
            {
                label: "Total Revenue",
                value: `${CURRENCY}${stats.totalRevenue.toLocaleString("en-IN")}`,
                icon: "payments",
                color: "bg-primary",
                lightBg: "bg-primary/10",
            },
        ]
        : [];

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Mobile title (desktop title is in the top bar) */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white lg:hidden">
                Overview
            </h2>

            {/* Stats Grid — 2 cols mobile, 4 cols desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-900 rounded-xl p-4 lg:p-6 shadow-sm animate-pulse"
                        >
                            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-slate-200 dark:bg-slate-800 mb-3" />
                            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2" />
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                        </div>
                    ))
                    : statCards.map((card) => (
                        <div
                            key={card.label}
                            className="bg-white dark:bg-slate-900 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div
                                className={`h-10 w-10 lg:h-12 lg:w-12 rounded-full ${card.color} text-white flex items-center justify-center mb-3`}
                            >
                                <span className="material-symbols-outlined text-[20px] lg:text-[24px]">
                                    {card.icon}
                                </span>
                            </div>
                            <p className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">
                                {card.value}
                            </p>
                            <p className="text-xs lg:text-sm text-slate-500 mt-1">{card.label}</p>
                        </div>
                    ))}
            </div>

            {/* Quick Actions — stack on mobile, grid on desktop */}
            <div>
                <h3 className="text-sm lg:text-base font-bold text-slate-700 dark:text-slate-300 mb-3">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">
                                add_circle
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm lg:text-base font-bold text-slate-900 dark:text-white">
                                Manage Products
                            </p>
                            <p className="text-xs lg:text-sm text-slate-500">
                                Add, edit, or toggle product visibility
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 text-[20px]">
                            chevron_right
                        </span>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">
                                local_shipping
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm lg:text-base font-bold text-slate-900 dark:text-white">
                                Manage Orders
                            </p>
                            <p className="text-xs lg:text-sm text-slate-500">
                                Update order and payment statuses
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 text-[20px]">
                            chevron_right
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

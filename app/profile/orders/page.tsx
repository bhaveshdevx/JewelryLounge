"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { getOrders } from "@/lib/supabase/queries";
import { CURRENCY } from "@/lib/constants";
import type { Order } from "@/types";

export default function UserOrdersPage() {
    const { user, isLoading: authLoading } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setLoading(false);
            return;
        }

        getOrders(user.id).then(({ data }) => {
            setOrders((data as Order[]) ?? []);
            setLoading(false);
        });
    }, [user, authLoading]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "processing": return "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
            case "shipped": return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
            case "delivered": return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
            case "cancelled": return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
            default: return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-7rem)]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] px-6 text-center gap-4">
                <span className="material-symbols-outlined text-4xl text-slate-400">lock</span>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign in required</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please sign in to view your order history.</p>
                </div>
                <Link href="/profile" className="mt-2 text-sm font-bold text-primary hover:underline">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-7rem)] bg-slate-50 dark:bg-slate-900/50">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white dark:bg-slate-900 sticky top-12 z-20 shadow-sm">
                <Link
                    href="/profile"
                    className="text-slate-900 dark:text-white flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-transform p-2"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </Link>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
                    Order History
                </h2>
            </div>

            {/* List */}
            <div className="flex-1 p-4 w-full max-w-2xl mx-auto space-y-4">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm animate-pulse border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between mb-4">
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/5" />
                            </div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2" />
                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-24" />
                        </div>
                    ))
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                        <span className="material-symbols-outlined text-5xl opacity-50">shopping_bag</span>
                        <p className="text-sm font-medium">No orders yet</p>
                        <Link href="/discover" className="mt-2 text-sm font-bold text-primary hover:underline">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-3 group hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 font-mono tracking-wider">ORDER #{order.id.slice(0, 8).toUpperCase()}</p>
                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${getStatusColor(order.order_status)}`}>
                                    {order.order_status}
                                </span>
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-slate-800/50 w-full" />

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Amount</p>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">
                                        {CURRENCY}{order.total_amount.toLocaleString("en-IN")}
                                    </p>
                                </div>

                                <button className="flex items-center justify-center h-8 px-4 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-colors">
                                    Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

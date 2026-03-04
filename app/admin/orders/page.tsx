/**
 * ============================================================
 * Admin Orders Page — Order Management
 * ============================================================
 *
 * List of all orders with status filters.
 * Update order_status and payment_status inline.
 * Responsive: card list on mobile, table on desktop.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import {
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
} from "@/lib/supabase/admin-queries";
import { CURRENCY } from "@/lib/constants";

type OrderStatusFilter = "all" | "processing" | "shipped" | "delivered";

const ORDER_STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUS_OPTIONS = ["pending", "paid", "failed", "refunded"];

interface OrderRow {
    id: string;
    user_id: string;
    total_amount: number;
    payment_status: string;
    order_status: string;
    shipping_details: Record<string, any>;
    created_at: string;
    profile?: { full_name: string; phone_number: string | null } | null;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<OrderStatusFilter>("all");

    useEffect(() => {
        setLoading(true);
        getAllOrders().then(({ data }) => {
            setOrders((data as OrderRow[]) ?? []);
            setLoading(false);
        });
    }, []);

    const handleOrderStatus = async (orderId: string, status: string) => {
        await updateOrderStatus(orderId, status);
        setOrders((prev) =>
            prev.map((o) =>
                o.id === orderId ? { ...o, order_status: status } : o,
            ),
        );
    };

    const handlePaymentStatus = async (orderId: string, status: string) => {
        await updatePaymentStatus(orderId, status);
        setOrders((prev) =>
            prev.map((o) =>
                o.id === orderId ? { ...o, payment_status: status } : o,
            ),
        );
    };

    const filteredOrders =
        filter === "all"
            ? orders
            : orders.filter((o) => o.order_status === filter);

    const statusFilters: { id: OrderStatusFilter; label: string }[] = [
        { id: "all", label: `All (${orders.length})` },
        { id: "processing", label: "Processing" },
        { id: "shipped", label: "Shipped" },
        { id: "delivered", label: "Delivered" },
    ];

    const getOrderStatusColor = (status: string) => {
        switch (status) {
            case "processing": return "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
            case "shipped": return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
            case "delivered": return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
            case "cancelled": return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
            default: return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "paid": return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
            case "pending": return "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
            case "failed": return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
            case "refunded": return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
            default: return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white lg:hidden">
                Orders
            </h2>

            {/* Status Filter Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {statusFilters.map((sf) => (
                    <button
                        key={sf.id}
                        onClick={() => setFilter(sf.id)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === sf.id
                            ? "bg-primary text-white shadow-sm"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            }`}
                    >
                        {sf.label}
                    </button>
                ))}
            </div>

            {/* Orders */}
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm animate-pulse"
                        >
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2" />
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-slate-400 gap-2">
                    <span className="material-symbols-outlined text-4xl">
                        receipt_long
                    </span>
                    <p className="text-sm">No orders found</p>
                </div>
            ) : (
                <>
                    {/* ── Desktop Table (hidden on mobile) ── */}
                    <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Order</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Customer</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Amount</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Order Status</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Payment</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="font-mono text-xs text-slate-500">#{order.id.slice(0, 8)}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-slate-900 dark:text-white">{order.profile?.full_name || "Unknown"}</p>
                                            {order.profile?.phone_number && (
                                                <p className="text-xs text-slate-400">{order.profile.phone_number}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-bold text-primary">{CURRENCY}{order.total_amount.toLocaleString("en-IN")}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.order_status}
                                                onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                                                className={`text-xs font-medium rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary border-0 ${getOrderStatusColor(order.order_status)}`}
                                            >
                                                {ORDER_STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.payment_status}
                                                onChange={(e) => handlePaymentStatus(order.id, e.target.value)}
                                                className={`text-xs font-medium rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary border-0 ${getPaymentStatusColor(order.payment_status)}`}
                                            >
                                                {PAYMENT_STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile Card List (hidden on desktop) ── */}
                    <div className="lg:hidden space-y-3">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-3"
                            >
                                {/* Order Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {order.profile?.full_name || "Unknown User"}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                            #{order.id.slice(0, 8)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">
                                            {CURRENCY}
                                            {order.total_amount.toLocaleString("en-IN")}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Selectors */}
                                <div className="flex gap-2">
                                    {/* Order Status */}
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                            Order Status
                                        </label>
                                        <select
                                            value={order.order_status}
                                            onChange={(e) =>
                                                handleOrderStatus(order.id, e.target.value)
                                            }
                                            className="w-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            {ORDER_STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Payment Status */}
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                            Payment
                                        </label>
                                        <select
                                            value={order.payment_status}
                                            onChange={(e) =>
                                                handlePaymentStatus(order.id, e.target.value)
                                            }
                                            className="w-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            {PAYMENT_STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                {order.profile?.phone_number && (
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">
                                            phone
                                        </span>
                                        {order.profile.phone_number}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

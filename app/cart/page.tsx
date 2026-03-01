/**
 * ============================================================
 * Cart Page — Transaction Hub (Cart / Wishlist / Orders)
 * ============================================================
 *
 * 3-tab layout with swipeable tabs.
 * Cart: item list with quantity controls, swipe-to-delete.
 * Sticky checkout summary at bottom.
 * "You might also like" horizontal scroll.
 * ============================================================
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { CURRENCY } from "@/lib/constants";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { Product } from "@/types";

type Tab = "cart" | "wishlist" | "orders";

export default function CartPage() {
    const [activeTab, setActiveTab] = useState<Tab>("cart");
    const { items, addItem, removeItem, deleteItem, totalPrice } =
        useCartStore();

    const tabs: { id: Tab; label: string }[] = [
        { id: "cart", label: `Cart (${items.length})` },
        { id: "wishlist", label: "Wishlist" },
        { id: "orders", label: "Orders" },
    ];

    /* "You might also like" — show products not in cart */
    const cartProductIds = new Set(items.map((i) => i.product.id));
    const suggestions = MOCK_PRODUCTS.filter(
        (p) => !cartProductIds.has(p.id),
    ).slice(0, 5);

    return (
        <div className="flex flex-col min-h-[calc(100vh-7rem)]">
            {/* Tab Bar */}
            <div className="sticky top-12 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4">
                <div className="flex justify-between w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center border-b-[3px] pb-2 pt-2 flex-1 transition-all text-sm font-bold tracking-[0.015em] ${activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-slate-400 hover:text-slate-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pb-52">
                <AnimatePresence mode="wait">
                    {activeTab === "cart" && (
                        <motion.div
                            key="cart"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <span className="material-symbols-outlined text-5xl">
                                        shopping_cart
                                    </span>
                                    <p className="text-sm font-medium">Your cart is empty</p>
                                    <p className="text-xs">
                                        Add some sparkle to your collection!
                                    </p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <CartItemRow
                                        key={item.product.id}
                                        product={item.product}
                                        quantity={item.quantity}
                                        onIncrement={() => addItem(item.product)}
                                        onDecrement={() => removeItem(item.product.id)}
                                        onDelete={() => deleteItem(item.product.id)}
                                    />
                                ))
                            )}

                            {/* You might also like */}
                            {suggestions.length > 0 && (
                                <div className="px-4 py-6">
                                    <h3 className="font-bold text-sm mb-3 text-slate-900 dark:text-white">
                                        You might also like
                                    </h3>
                                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                        {suggestions.map((p) => (
                                            <div key={p.id} className="shrink-0 w-28">
                                                <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100 relative">
                                                    <Image
                                                        src={p.images[0]}
                                                        alt={p.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="112px"
                                                    />
                                                </div>
                                                <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                                                    {p.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {CURRENCY}
                                                    {(p.salePrice ?? p.price).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "wishlist" && (
                        <motion.div
                            key="wishlist"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3"
                        >
                            <span className="material-symbols-outlined text-5xl">
                                favorite
                            </span>
                            <p className="text-sm font-medium">Your wishlist is empty</p>
                            <p className="text-xs">Tap the heart on products to save them</p>
                        </motion.div>
                    )}

                    {activeTab === "orders" && (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3"
                        >
                            <span className="material-symbols-outlined text-5xl">
                                receipt_long
                            </span>
                            <p className="text-sm font-medium">No orders yet</p>
                            <p className="text-xs">Your order history will appear here</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sticky Checkout Summary (only on cart tab with items) */}
            {activeTab === "cart" && items.length > 0 && (
                <div className="fixed bottom-16 left-0 right-0 z-40 max-w-md mx-auto bg-white dark:bg-slate-900 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-100 dark:border-slate-800 p-4 space-y-3">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs font-medium">
                                Subtotal
                            </span>
                            <span className="text-slate-900 dark:text-white text-sm font-bold">
                                {CURRENCY}
                                {totalPrice().toLocaleString("en-IN")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs font-medium">
                                Shipping
                            </span>
                            <span className="text-primary text-xs font-bold uppercase tracking-wider">
                                Free
                            </span>
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 w-full" />
                        <div className="flex justify-between items-end">
                            <span className="text-slate-900 dark:text-white text-base font-bold">
                                Total
                            </span>
                            <span className="text-primary text-lg font-bold">
                                {CURRENCY}
                                {totalPrice().toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>
                    <button className="w-full bg-primary text-white font-bold text-base py-3 rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        Proceed to Checkout
                        <span className="material-symbols-outlined text-lg">
                            arrow_forward
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Cart Item Row
// ---------------------------------------------------------------------------

interface CartItemRowProps {
    product: Product;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onDelete: () => void;
}

function CartItemRow({
    product,
    quantity,
    onIncrement,
    onDecrement,
    onDelete,
}: CartItemRowProps) {
    const [swiped, setSwiped] = useState(false);

    return (
        <div className="relative overflow-hidden group">
            {/* Delete background (revealed on swipe) */}
            <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center z-0">
                <button
                    onClick={onDelete}
                    className="text-white flex flex-col items-center gap-1"
                >
                    <span className="material-symbols-outlined text-xl">delete</span>
                </button>
            </div>

            {/* Main row (draggable) */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -80, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                    setSwiped(info.offset.x < -40);
                }}
                animate={{ x: swiped ? -80 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative z-10 flex gap-4 bg-white dark:bg-slate-900 px-4 py-5 border-b border-slate-100 dark:border-slate-800 cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-start gap-4 flex-1">
                    {/* Product Thumbnail */}
                    <div className="rounded-xl w-16 h-16 shadow-sm shrink-0 overflow-hidden relative bg-slate-100">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between h-16">
                        <div>
                            <p className="text-sm font-bold leading-tight line-clamp-1 text-slate-900 dark:text-white">
                                {product.name}
                            </p>
                            <p className="text-xs font-medium mt-0.5 text-slate-500">
                                {product.inStock ? "In Stock" : "Low Stock"}
                            </p>
                        </div>
                        <p className="text-primary text-sm font-bold">
                            {CURRENCY}
                            {(product.salePrice ?? product.price).toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>

                {/* Quantity Stepper */}
                <div className="shrink-0 flex items-center h-16">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 h-8">
                        <button
                            onClick={onDecrement}
                            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all text-lg font-medium text-slate-900 dark:text-white"
                        >
                            -
                        </button>
                        <span className="text-xs font-semibold w-6 text-center text-slate-900 dark:text-white">
                            {quantity}
                        </span>
                        <button
                            onClick={onIncrement}
                            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all text-lg font-medium text-slate-900 dark:text-white"
                        >
                            +
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

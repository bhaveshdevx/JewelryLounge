/**
 * ============================================================
 * Cart Page — Transaction Hub (Cart / Wishlist / Orders)
 * ============================================================
 *
 * 3-tab layout with swipeable tabs.
 * Cart: item list with quantity controls, swipe-to-delete.
 * Sticky checkout summary at bottom.
 * "You might also like" fetched from Supabase.
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CURRENCY } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { getProducts, createOrder, getOrders } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";
import { useLikesStore } from "@/stores/likes-store";
import { useAuthStore } from "@/stores/auth-store";
import type { Product } from "@/types";

type Tab = "cart" | "wishlist" | "orders";

export default function CartPage() {
    const [activeTab, setActiveTab] = useState<Tab>("cart");
    const { items, addItem, removeItem, deleteItem, totalPrice, fetchCart } =
        useCartStore();
    const { wishlistIds, toggleWishlist } = useLikesStore();
    const user = useAuthStore((s) => s.user);

    // Fetch user cart on load
    useEffect(() => {
        if (user) fetchCart(user.id);
    }, [user, fetchCart]);

    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const fetchUserOrders = async () => {
        if (!user) return;
        const { data } = await getOrders(user.id);
        if (data) setOrders(data);
    };

    // Fetch orders when tab changes
    useEffect(() => {
        if (activeTab === "orders") {
            fetchUserOrders();
        }
    }, [activeTab, user]);

    const handleCheckout = async () => {
        if (!user || items.length === 0) return;
        setIsCheckingOut(true);

        const orderItems = items.map(item => ({
            product_id: item.product.id,
            price_at_purchase: item.product.discount_price ?? item.product.selling_price,
            quantity: item.quantity
        }));

        const shippingDetails = {
            address: "123 Elegance Blvd",
            city: "Mumbai",
            state: "MH",
            pincode: "400050"
        };

        const { data, error } = await createOrder(user.id, orderItems, shippingDetails);

        setIsCheckingOut(false);
        if (!error && data) {
            // Cart cleared automatically inside createOrder, just need to update Zustand
            useCartStore.getState().clearCart();
            setActiveTab("orders");
            fetchUserOrders();
        } else {
            alert("Failed to create order. Please try again.");
        }
    };

    const tabs: { id: Tab; label: string }[] = [
        { id: "cart", label: `Cart (${items.length})` },
        { id: "wishlist", label: "Wishlist" },
        { id: "orders", label: "Orders" },
    ];

    // Fetch "You might also like" suggestions from DB
    useEffect(() => {
        getProducts({ limit: 8, activeOnly: true }).then(({ data }) => {
            const cartProductIds = new Set(items.map((i) => i.product.id));
            const filtered = ((data as Product[]) ?? [])
                .filter((p) => !cartProductIds.has(p.id))
                .slice(0, 5);
            setSuggestions(filtered);
        });
    }, [items]);

    // Fetch wishlist products
    useEffect(() => {
        if (wishlistIds.size === 0) {
            setWishlistProducts([]);
            return;
        }

        const fetchDetails = async () => {
            const idsArray = Array.from(wishlistIds);
            const { data } = await supabase
                .from("products")
                .select("*")
                .in("id", idsArray);

            if (data) setWishlistProducts(data as Product[]);
        };

        fetchDetails();
    }, [wishlistIds]);

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
                                        onIncrement={() => addItem(item.product, user?.id)}
                                        onDecrement={() => removeItem(item.product.id, user?.id)}
                                        onDelete={() => deleteItem(item.product.id, user?.id)}
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
                                                    {p.media_urls?.[0] && (
                                                        <Image
                                                            src={p.media_urls[0]}
                                                            alt={p.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="112px"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                                                    {p.title}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {CURRENCY}
                                                    {(p.discount_price ?? p.selling_price).toLocaleString("en-IN")}
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
                        >
                            {wishlistProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <span className="material-symbols-outlined text-5xl">
                                        bookmark
                                    </span>
                                    <p className="text-sm font-medium">Your wishlist is empty</p>
                                    <p className="text-xs">Tap the bookmark on products to save them</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 px-4 py-4">
                                    {wishlistProducts.map((p) => (
                                        <div key={p.id} className="relative group flex flex-col gap-2">
                                            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-100 relative cursor-pointer">
                                                {p.media_urls?.[0] && (
                                                    <Image
                                                        src={p.media_urls[0]}
                                                        alt={p.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        sizes="(max-width: 448px) 50vw, 200px"
                                                    />
                                                )}
                                                <button
                                                    onClick={() => user && toggleWishlist(user.id, p.id)}
                                                    className="absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm shadow-sm transition-colors bg-white/80 text-primary"
                                                >
                                                    <span
                                                        className="material-symbols-outlined text-lg"
                                                        style={{ fontVariationSettings: `'FILL' 1` }}
                                                    >
                                                        bookmark
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                                    {p.title}
                                                </h4>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {CURRENCY}
                                                    {(p.discount_price ?? p.selling_price).toLocaleString("en-IN")}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        addItem(p, user?.id);
                                                        if (user) toggleWishlist(user.id, p.id); // Or leave it in wishlist, it's typically removed when added to cart
                                                    }}
                                                    className="mt-1 w-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                                >
                                                    Move to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "orders" && (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-3 px-4 py-4"
                        >
                            {orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <span className="material-symbols-outlined text-5xl">
                                        receipt_long
                                    </span>
                                    <p className="text-sm font-medium">No orders yet</p>
                                    <p className="text-xs">Your order history will appear here</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div key={order.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex flex-col gap-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500 uppercase">
                                                Order #{order.id.slice(0, 8)}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.order_status === "processing" ? "bg-amber-100 text-amber-700" :
                                                    order.order_status === "shipped" ? "bg-blue-100 text-blue-700" :
                                                        order.order_status === "delivered" ? "bg-green-100 text-green-700" :
                                                            "bg-slate-200 text-slate-700"
                                                }`}>
                                                {order.order_status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-500">
                                                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                                                    {CURRENCY}{order.total_amount.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                            <button className="text-primary text-xs font-bold hover:underline">
                                                View details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
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
                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut || !user}
                        className="w-full bg-primary text-white font-bold text-base py-3 rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                    >
                        {isCheckingOut ? (
                            <span className="material-symbols-outlined text-lg animate-spin">
                                progress_activity
                            </span>
                        ) : !user ? (
                            "Login to Checkout"
                        ) : (
                            <>
                                Proceed to Checkout
                                <span className="material-symbols-outlined text-lg">
                                    arrow_forward
                                </span>
                            </>
                        )}
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
                        {product.media_urls?.[0] && (
                            <Image
                                src={product.media_urls[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between h-16">
                        <div>
                            <p className="text-sm font-bold leading-tight line-clamp-1 text-slate-900 dark:text-white">
                                {product.title}
                            </p>
                            <p className="text-xs font-medium mt-0.5 text-slate-500">
                                {product.stock_count > 0 ? "In Stock" : "Low Stock"}
                            </p>
                        </div>
                        <p className="text-primary text-sm font-bold">
                            {CURRENCY}
                            {(product.discount_price ?? product.selling_price).toLocaleString("en-IN")}
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

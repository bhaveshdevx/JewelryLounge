/**
 * ============================================================
 * Feed Page — Product Showcase Feed
 * ============================================================
 *
 * Full-screen snap-scrolling feed showing real products from
 * Supabase. Each card: product image, info, side actions
 * (like, share), glassmorphism buy card.
 *
 * Double-tap for heart animation.
 * ============================================================
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/supabase/queries";
import { CURRENCY } from "@/lib/constants";
import { ProductDrawer } from "@/components/product/product-drawer";
import { useAuthStore } from "@/stores/auth-store";
import { useLikesStore } from "@/stores/likes-store";
import type { Product } from "@/types";

export default function FeedPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);

    useEffect(() => {
        getProducts({ limit: 20, activeOnly: true }).then(({ data }) => {
            setProducts((data as Product[]) ?? []);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-7rem)]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-7rem)] gap-3 text-slate-400">
                <span className="material-symbols-outlined text-5xl">movie</span>
                <p className="text-sm font-medium">No items in feed yet</p>
            </div>
        );
    }

    return (
        <>
            {/* Snap-scrolling container */}
            <div className="h-[calc(100vh-7rem)] overflow-y-auto snap-y snap-mandatory no-scrollbar -mt-12">
                {products.map((product) => (
                    <FeedCard
                        key={product.id}
                        product={product}
                        onBuyTap={() => setDrawerProduct(product)}
                    />
                ))}
            </div>

            {/* Product Drawer */}
            <ProductDrawer
                product={drawerProduct}
                onClose={() => setDrawerProduct(null)}
            />
        </>
    );
}

// ---------------------------------------------------------------------------
// Feed Card Component
// ---------------------------------------------------------------------------

interface FeedCardProps {
    product: Product;
    onBuyTap: () => void;
}

function FeedCard({ product, onBuyTap }: FeedCardProps) {
    const [showHeart, setShowHeart] = useState(false);
    const lastTapRef = useRef(0);
    const user = useAuthStore((s) => s.user);
    const isLiked = useLikesStore((s) => s.isLiked(product.id));
    const toggleLike = useLikesStore((s) => s.toggleLike);

    /* Double-tap detection */
    const handleDoubleTap = useCallback(() => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            if (user && !isLiked) {
                toggleLike(user.id, product.id);
            }
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 1000);
        }
        lastTapRef.current = now;
    }, [user, isLiked, toggleLike, product.id]);

    const handleLike = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!user) return;
            toggleLike(user.id, product.id);
        },
        [user, toggleLike, product.id],
    );

    const discount =
        product.discount_price && product.discount_price < product.selling_price
            ? Math.round(
                ((product.selling_price - product.discount_price) /
                    product.selling_price) *
                100,
            )
            : null;

    const heroImage = product.media_urls?.[0];

    return (
        <div
            className="snap-start relative h-[calc(100vh-7rem)] w-full bg-slate-200 overflow-hidden"
            onClick={handleDoubleTap}
        >
            {/* Background Image */}
            {heroImage && (
                <Image
                    src={heroImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 448px) 100vw, 448px"
                    priority
                />
            )}

            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

            {/* Double-tap Heart Animation */}
            <AnimatePresence>
                {showHeart && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    >
                        <span
                            className="material-symbols-outlined text-white text-8xl drop-shadow-lg"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            favorite
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                    <span className="material-symbols-outlined text-[20px]">
                        diamond
                    </span>
                </div>
                <div className="flex items-center gap-4 text-white/70 font-medium text-sm">
                    <span className="cursor-pointer hover:text-white transition-colors">
                        Following
                    </span>
                    <div className="h-4 w-[1px] bg-white/40" />
                    <span className="text-white font-bold cursor-pointer border-b-2 border-primary pb-0.5">
                        For You
                    </span>
                </div>
                <Link
                    href="/discover"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                >
                    <span className="material-symbols-outlined text-[24px]">
                        search
                    </span>
                </Link>
            </div>

            {/* Right Sidebar Actions */}
            <div className="absolute right-4 bottom-48 z-20 flex flex-col items-center gap-5">
                {/* Like */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={handleLike}
                        className="group flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform"
                    >
                        <span
                            className="material-symbols-outlined text-white text-[28px] drop-shadow-md"
                            style={{
                                fontVariationSettings: `'FILL' ${isLiked ? 1 : 0}`,
                                color: isLiked ? "#ee2b8c" : "white",
                            }}
                        >
                            favorite
                        </span>
                    </button>
                    <span className="text-white text-xs font-semibold drop-shadow-md">
                        {isLiked ? "Liked" : "Like"}
                    </span>
                </div>

                {/* Bookmark / Save */}
                <div className="flex flex-col items-center gap-1">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-white text-[28px] drop-shadow-md">
                            bookmark
                        </span>
                    </button>
                    <span className="text-white text-xs font-semibold drop-shadow-md">
                        Save
                    </span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                                navigator.share({
                                    title: product.title,
                                    text: `Check out ${product.title} on Jewelry Lounge!`,
                                    url: window.location.href,
                                });
                            }
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform"
                    >
                        <span className="material-symbols-outlined text-white text-[28px] drop-shadow-md">
                            share
                        </span>
                    </button>
                    <span className="text-white text-xs font-semibold drop-shadow-md">
                        Share
                    </span>
                </div>
            </div>

            {/* Bottom Content: Product Info + Buy Card */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col justify-end px-4 pointer-events-none">
                {/* Product Title & Description */}
                <div className="mb-4 pr-16 pointer-events-auto">
                    <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">
                        {product.title}
                    </h3>
                    {product.description && (
                        <p className="text-white/90 text-[15px] leading-snug drop-shadow-md font-medium line-clamp-2">
                            {product.description}
                        </p>
                    )}
                    {(product.attributes?.tags ?? []).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {(product.attributes?.tags ?? []).slice(0, 3).map((tag: string) => (
                                <span key={tag} className="text-primary font-bold text-sm">
                                    #{tag}{" "}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Glassmorphism Buy Card */}
                <div
                    className="glass-panel rounded-xl p-3 flex items-center gap-3 w-full max-w-sm pointer-events-auto shadow-lg cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onBuyTap();
                    }}
                >
                    {/* Product Thumbnail */}
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/50">
                        {heroImage && (
                            <Image
                                src={heroImage}
                                alt={product.title}
                                width={56}
                                height={56}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-center">
                        <h4 className="text-slate-900 font-bold text-sm leading-tight line-clamp-1">
                            {product.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-primary font-bold text-sm">
                                {CURRENCY}
                                {(product.discount_price ?? product.selling_price).toLocaleString(
                                    "en-IN",
                                )}
                            </span>
                            {product.discount_price &&
                                product.discount_price < product.selling_price && (
                                    <span className="text-slate-500 text-xs line-through">
                                        {CURRENCY}
                                        {product.selling_price.toLocaleString("en-IN")}
                                    </span>
                                )}
                            {discount && (
                                <span className="text-[10px] text-green-700 font-bold bg-green-100 px-1 rounded ml-1">
                                    {discount}% OFF
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Buy Button */}
                    <button className="shrink-0 bg-primary hover:bg-pink-600 text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-md active:scale-95 transition-all">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

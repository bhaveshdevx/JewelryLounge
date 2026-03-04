/**
 * ============================================================
 * Feed Page — TikTok-Style Vertical Video Feed
 * ============================================================
 *
 * Full-screen snap-scrolling feed cards.
 * Each card: background image, user info + caption, side actions
 * (like, comment, save, share), glassmorphism buy card.
 *
 * Double-tap for heart animation.
 * ============================================================
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MOCK_FEED_ITEMS } from "@/lib/mock-data";
import { CURRENCY } from "@/lib/constants";
import { ProductDrawer } from "@/components/product/product-drawer";
import type { Product } from "@/types";

export default function FeedPage() {
    const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);

    return (
        <>
            {/* Snap-scrolling container */}
            <div className="h-[calc(100vh-7rem)] overflow-y-auto snap-y snap-mandatory no-scrollbar -mt-12">
                {MOCK_FEED_ITEMS.map((item) => (
                    <FeedCard
                        key={item.id}
                        item={item}
                        onBuyTap={() => setDrawerProduct(item.product)}
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
    item: (typeof MOCK_FEED_ITEMS)[0];
    onBuyTap: () => void;
}

function FeedCard({ item, onBuyTap }: FeedCardProps) {
    const [showHeart, setShowHeart] = useState(false);
    const [liked, setLiked] = useState(false);
    const lastTapRef = useRef(0);

    /* Double-tap detection */
    const handleDoubleTap = useCallback(() => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            setLiked(true);
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 1000);
        }
        lastTapRef.current = now;
    }, []);

    const discount =
        item.product.discount_price && item.product.discount_price < item.product.selling_price
            ? Math.round(
                ((item.product.selling_price - item.product.discount_price) /
                    item.product.selling_price) *
                100,
            )
            : null;

    return (
        <div
            className="snap-start relative h-[calc(100vh-7rem)] w-full bg-slate-200 overflow-hidden"
            onClick={handleDoubleTap}
        >
            {/* Background Image */}
            <Image
                src={item.backgroundImage}
                alt={item.caption}
                fill
                className="object-cover"
                sizes="(max-width: 448px) 100vw, 448px"
                priority
            />

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
                {/* Logo */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                    <span className="material-symbols-outlined text-[20px]">
                        diamond
                    </span>
                </div>

                {/* Following / For You toggle */}
                <div className="flex items-center gap-4 text-white/70 font-medium text-sm">
                    <span className="cursor-pointer hover:text-white transition-colors">
                        Following
                    </span>
                    <div className="h-4 w-[1px] bg-white/40" />
                    <span className="text-white font-bold cursor-pointer border-b-2 border-primary pb-0.5">
                        For You
                    </span>
                </div>

                {/* Search */}
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
                {/* Profile + Follow */}
                <div className="relative mb-2">
                    <div className="h-12 w-12 rounded-full border-2 border-white p-0.5 overflow-hidden bg-white">
                        <Image
                            src={item.userAvatar}
                            alt={item.username}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                        <span className="material-symbols-outlined text-[14px] font-bold">
                            add
                        </span>
                    </div>
                </div>

                {/* Like */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setLiked(!liked);
                        }}
                        className="group flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform"
                    >
                        <span
                            className="material-symbols-outlined text-white text-[28px] drop-shadow-md"
                            style={{
                                fontVariationSettings: `'FILL' ${liked ? 1 : 0}`,
                                color: liked ? "#ee2b8c" : "white",
                            }}
                        >
                            favorite
                        </span>
                    </button>
                    <span className="text-white text-xs font-semibold drop-shadow-md">
                        {item.likes}
                    </span>
                </div>

                {/* Comments */}
                <div className="flex flex-col items-center gap-1">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-white text-[28px] drop-shadow-md">
                            chat_bubble
                        </span>
                    </button>
                    <span className="text-white text-xs font-semibold drop-shadow-md">
                        {item.comments}
                    </span>
                </div>

                {/* Bookmark */}
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
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-white text-[28px] drop-shadow-md">
                            share
                        </span>
                    </button>
                    <span className="text-white text-xs font-semibold drop-shadow-md">
                        Share
                    </span>
                </div>
            </div>

            {/* Bottom Content: Username, Caption, Audio, Buy Card */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col justify-end px-4 pointer-events-none">
                {/* User Info & Caption */}
                <div className="mb-4 pr-16 pointer-events-auto">
                    <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">
                        {item.username}
                    </h3>
                    <p className="text-white/90 text-[15px] leading-snug drop-shadow-md font-medium">
                        {item.caption}{" "}
                        {item.hashtags.map((tag) => (
                            <span key={tag} className="text-primary font-bold">
                                {tag}{" "}
                            </span>
                        ))}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-white/80 text-xs font-medium">
                        <span className="material-symbols-outlined text-[14px] animate-pulse">
                            music_note
                        </span>
                        <span>{item.audioLabel}</span>
                    </div>
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
                        <Image
                            src={item.product.media_urls[0]}
                            alt={item.product.title}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-center">
                        <h4 className="text-slate-900 font-bold text-sm leading-tight line-clamp-1">
                            {item.product.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-primary font-bold text-sm">
                                {CURRENCY}
                                {(item.product.discount_price ?? item.product.selling_price).toLocaleString(
                                    "en-IN",
                                )}
                            </span>
                            {item.product.discount_price &&
                                item.product.discount_price < item.product.selling_price && (
                                    <span className="text-slate-500 text-xs line-through">
                                        {CURRENCY}
                                        {item.product.selling_price.toLocaleString("en-IN")}
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

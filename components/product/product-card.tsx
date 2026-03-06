/**
 * ============================================================
 * ProductCard — Thumbnail Card for Grid Views
 * ============================================================
 *
 * 3:4 aspect ratio image card with:
 *  - Heart button (syncs with Supabase via likes-store)
 *  - Badge (Best Seller / New)
 *  - Product name, price, sale price with strikethrough, discount %
 *  - Tap image → opens Product Drawer
 * ============================================================
 */

"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/types";
import { CURRENCY } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { useLikesStore } from "@/stores/likes-store";

interface ProductCardProps {
    product: Product;
    /** Callback when the card image is tapped */
    onTap?: (product: Product) => void;
}

export function ProductCard({ product, onTap }: ProductCardProps) {
    const user = useAuthStore((s) => s.user);
    const isLiked = useLikesStore((s) => s.isLiked(product.id));
    const toggleLike = useLikesStore((s) => s.toggleLike);

    /** Calculate discount percentage */
    const discount =
        product.discount_price && product.discount_price < product.selling_price
            ? Math.round(((product.selling_price - product.discount_price) / product.selling_price) * 100)
            : null;

    /** Get badge label from tags */
    const productTags: string[] = product.attributes?.tags ?? [];
    const badge = productTags.includes("best-seller")
        ? "Best Seller"
        : productTags.includes("new")
            ? "New"
            : null;

    const handleLike = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!user) return; // Must be logged in to like
            toggleLike(user.id, product.id);
        },
        [user, toggleLike, product.id],
    );

    return (
        <div className="group relative flex flex-col gap-2">
            {/* Image Container */}
            <div
                className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-100 relative cursor-pointer"
                onClick={() => onTap?.(product)}
            >
                {product.media_urls?.[0] && (
                    <Image
                        src={product.media_urls[0]}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 448px) 50vw, 200px"
                    />
                )}

                {/* Heart Button */}
                <motion.button
                    onClick={handleLike}
                    whileTap={{ scale: 1.3 }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm shadow-sm transition-colors ${isLiked
                        ? "bg-white/80 text-red-500"
                        : "bg-white/80 text-slate-400 hover:text-red-500"
                        }`}
                >
                    <span
                        className="material-symbols-outlined text-lg"
                        style={{ fontVariationSettings: `'FILL' ${isLiked ? 1 : 0}` }}
                    >
                        favorite
                    </span>
                </motion.button>

                {/* Badge */}
                {badge && (
                    <div
                        className={`absolute bottom-2 left-2 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-medium text-white ${badge === "New" ? "bg-primary/90" : "bg-black/60"
                            }`}
                    >
                        {badge}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {product.title}
                </h4>
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {CURRENCY}
                        {(product.discount_price ?? product.selling_price).toLocaleString("en-IN")}
                    </p>
                    {product.discount_price && product.discount_price < product.selling_price && (
                        <p className="text-[10px] text-slate-500 line-through">
                            {CURRENCY}
                            {product.selling_price.toLocaleString("en-IN")}
                        </p>
                    )}
                    {discount && (
                        <p className="text-[10px] text-green-600 font-medium">
                            {discount}% Off
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

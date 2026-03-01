/**
 * ============================================================
 * ProductCard — Thumbnail Card for Grid Views
 * ============================================================
 *
 * 3:4 aspect ratio image card with:
 *  - Heart button (pop/bounce animation on click)
 *  - Badge (Best Seller / New)
 *  - Product name, price, sale price with strikethrough, discount %
 *  - Tap image → opens Product Drawer
 * ============================================================
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/types";
import { CURRENCY } from "@/lib/constants";

interface ProductCardProps {
    product: Product;
    /** Callback when the card image is tapped */
    onTap?: (product: Product) => void;
}

export function ProductCard({ product, onTap }: ProductCardProps) {
    const [liked, setLiked] = useState(false);

    /** Calculate discount percentage */
    const discount =
        product.salePrice && product.salePrice < product.price
            ? Math.round(((product.price - product.salePrice) / product.price) * 100)
            : null;

    /** Get badge label from tags */
    const badge = product.tags.includes("best-seller")
        ? "Best Seller"
        : product.tags.includes("new")
            ? "New"
            : null;

    const handleLike = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked((prev) => !prev);
    }, []);

    return (
        <div className="group relative flex flex-col gap-2">
            {/* Image Container */}
            <div
                className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-100 relative cursor-pointer"
                onClick={() => onTap?.(product)}
            >
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 448px) 50vw, 200px"
                />

                {/* Heart Button */}
                <motion.button
                    onClick={handleLike}
                    whileTap={{ scale: 1.3 }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm shadow-sm transition-colors ${liked
                            ? "bg-white/80 text-red-500"
                            : "bg-white/80 text-slate-400 hover:text-red-500"
                        }`}
                >
                    <span
                        className="material-symbols-outlined text-lg"
                        style={{ fontVariationSettings: `'FILL' ${liked ? 1 : 0}` }}
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
                    {product.name}
                </h4>
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {CURRENCY}
                        {(product.salePrice ?? product.price).toLocaleString("en-IN")}
                    </p>
                    {product.salePrice && product.salePrice < product.price && (
                        <p className="text-[10px] text-slate-500 line-through">
                            {CURRENCY}
                            {product.price.toLocaleString("en-IN")}
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

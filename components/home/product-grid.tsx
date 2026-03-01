/**
 * ============================================================
 * ProductGrid — 2-Column Product Grid with Animated Filtering
 * ============================================================
 *
 * Shows "Just For You" header + "View All" link.
 * Filters products based on active vibe and filter pill.
 * Fade transition when grid content changes.
 * ============================================================
 */

"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { Product } from "@/types";

interface ProductGridProps {
    /** Active vibe slug for filtering (null = show all) */
    activeVibe: string | null;
    /** Active filter pill ID (null = show all) */
    activeFilter: string | null;
    /** Callback when a product card is tapped */
    onProductTap?: (product: Product) => void;
}

export function ProductGrid({
    activeVibe,
    activeFilter,
    onProductTap,
}: ProductGridProps) {
    /** Filter products based on active vibe and filter pill */
    const filteredProducts = useMemo(() => {
        let products = MOCK_PRODUCTS;

        // Filter by vibe (category slug in tags)
        if (activeVibe) {
            products = products.filter((p) => p.tags.includes(activeVibe));
        }

        // Filter by pill
        if (activeFilter) {
            switch (activeFilter) {
                case "under-499":
                    products = products.filter(
                        (p) => (p.salePrice ?? p.price) < 500,
                    );
                    break;
                case "trending":
                    products = products.filter((p) => p.tags.includes("trending"));
                    break;
                case "new-arrivals":
                    products = products.filter(
                        (p) => p.tags.includes("new-arrival") || p.tags.includes("new"),
                    );
                    break;
                case "best-sellers":
                    products = products.filter((p) => p.tags.includes("best-seller"));
                    break;
            }
        }

        return products;
    }, [activeVibe, activeFilter]);

    return (
        <div className="px-4 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Just For You
                </h3>
                <a
                    className="text-xs font-medium text-primary hover:text-primary/80"
                    href="#"
                >
                    View All
                </a>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${activeVibe}-${activeFilter}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-3"
                >
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onTap={onProductTap}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 py-12 text-center text-slate-400 text-sm">
                            No products match this filter
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

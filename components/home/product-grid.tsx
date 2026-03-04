/**
 * ============================================================
 * ProductGrid — 2-Column Product Grid with Live Data
 * ============================================================
 *
 * Shows "Just For You" header + "View All" link.
 * Fetches products from Supabase with optional filters.
 * Loading skeleton while data is being fetched.
 * ============================================================
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/supabase/queries";
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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from Supabase whenever filters change
    useEffect(() => {
        setLoading(true);

        // Build query options based on active filters
        const options: Parameters<typeof getProducts>[0] = {
            activeOnly: true,
            limit: 20,
        };

        // Price filter
        if (activeFilter === "under-499") {
            options.maxPrice = 499;
        }

        // Tag-based filters
        if (activeFilter === "trending") {
            options.tag = "trending";
        } else if (activeFilter === "new-arrivals") {
            options.tag = "new-arrival";
        } else if (activeFilter === "best-sellers") {
            options.tag = "best-seller";
        }

        // Vibe (category tag) filter
        if (activeVibe) {
            options.tag = activeVibe;
        }

        getProducts(options).then(({ data, error }) => {
            if (error) {
                console.error("Failed to fetch products:", error.message);
                setProducts([]);
            } else {
                setProducts((data as Product[]) ?? []);
            }
            setLoading(false);
        });
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
                    {loading ? (
                        // Skeleton loader
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] rounded-xl bg-slate-200 dark:bg-slate-800 mb-2" />
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-1" />
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                            </div>
                        ))
                    ) : products.length > 0 ? (
                        products.map((product) => (
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

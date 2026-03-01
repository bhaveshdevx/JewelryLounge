/**
 * ============================================================
 * ProductDrawer — Bottom Sheet Product Detail Overlay
 * ============================================================
 *
 * Slides up from the bottom with Framer Motion.
 * Contains: drag handle, image carousel (Embla), thumbnail strip,
 * product info, accordions, and sticky Add to Cart bar.
 *
 * Swipe down or tap backdrop to dismiss.
 * ============================================================
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import type { Product } from "@/types";
import { CURRENCY } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";

interface ProductDrawerProps {
    product: Product | null;
    onClose: () => void;
}

export function ProductDrawer({ product, onClose }: ProductDrawerProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const addItem = useCartStore((s) => s.addItem);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const handleAddToCart = useCallback(() => {
        if (!product) return;
        addItem(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1500);
    }, [product, addItem]);

    const discount =
        product?.salePrice && product.salePrice < product.price
            ? Math.round(
                ((product.price - product.salePrice) / product.price) * 100,
            )
            : null;

    return (
        <AnimatePresence>
            {product && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 150) onClose();
                        }}
                        className="fixed inset-x-0 bottom-0 z-[70] w-full max-w-md mx-auto h-[92%] bg-white dark:bg-slate-900 rounded-t-xl flex flex-col shadow-[0_-4px_24px_rgba(0,0,0,0.15)] overflow-hidden"
                    >
                        {/* Drag Handle */}
                        <div className="w-full flex items-center justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing">
                            <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                            {/* Image Carousel */}
                            <div className="relative w-full aspect-[4/5] bg-slate-100 dark:bg-slate-800">
                                {/* Share button */}
                                <button className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-black/50 backdrop-blur-md p-2 rounded-full shadow-sm text-slate-700 dark:text-white">
                                    <span className="material-symbols-outlined text-[20px]">
                                        share
                                    </span>
                                </button>

                                {/* Main image */}
                                <div className="w-full h-full overflow-hidden" ref={emblaRef}>
                                    <div className="flex h-full">
                                        {product.images.map((img, i) => (
                                            <div key={i} className="flex-[0_0_100%] relative h-full">
                                                <Image
                                                    src={img}
                                                    alt={`${product.name} view ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 448px) 100vw, 448px"
                                                    priority={i === 0}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pagination dots */}
                                {product.images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {product.images.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full shadow-sm ${i === activeImageIndex
                                                        ? "bg-white"
                                                        : "bg-white/50"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {product.images.length > 1 && (
                                <div className="flex gap-3 px-5 py-4 overflow-x-auto no-scrollbar">
                                    {product.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setActiveImageIndex(i);
                                                emblaApi?.scrollTo(i);
                                            }}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${i === activeImageIndex
                                                    ? "border-2 border-primary p-0.5"
                                                    : "border border-slate-200 dark:border-slate-700"
                                                }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${i + 1}`}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Product Info */}
                            <div className="px-5 pb-6">
                                {/* Name & Price */}
                                <div className="flex items-start justify-between mb-2">
                                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                                        {product.name}
                                    </h1>
                                    <div className="flex flex-col items-end">
                                        <span className="text-primary text-xl font-bold tracking-tight">
                                            {CURRENCY}
                                            {(product.salePrice ?? product.price).toLocaleString("en-IN")}
                                        </span>
                                        {product.salePrice && product.salePrice < product.price && (
                                            <span className="text-slate-500 line-through text-sm">
                                                {CURRENCY}
                                                {product.price.toLocaleString("en-IN")}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Badges + Rating */}
                                <div className="flex items-center gap-2 mb-4">
                                    {product.tags.includes("best-seller") && (
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md">
                                            Best Seller
                                        </span>
                                    )}
                                    <span className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                                        <span className="material-symbols-outlined text-[14px]">
                                            star
                                        </span>
                                        4.8
                                    </span>
                                    <span className="text-slate-500 text-xs">(124 reviews)</span>
                                </div>

                                {/* Description */}
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                                    {product.description}
                                </p>

                                {/* Material & Care Accordion */}
                                <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                                    <details className="group">
                                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-900 dark:text-slate-200">
                                            <span>Material & Care</span>
                                            <span className="transition group-open:rotate-180">
                                                <span className="material-symbols-outlined text-slate-400">
                                                    expand_more
                                                </span>
                                            </span>
                                        </summary>
                                        <div className="text-slate-500 text-sm mt-3">
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>Hypoallergenic surgical steel posts</li>
                                                <li>Matte rubberized coating</li>
                                                <li>Avoid direct contact with perfumes</li>
                                                <li>Wipe with a soft cloth after use</li>
                                            </ul>
                                        </div>
                                    </details>
                                </div>

                                {/* Shipping & Returns Accordion */}
                                <div className="border-t border-slate-100 dark:border-slate-700 mt-4 pt-3">
                                    <details className="group">
                                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-900 dark:text-slate-200">
                                            <span>Shipping & Returns</span>
                                            <span className="transition group-open:rotate-180">
                                                <span className="material-symbols-outlined text-slate-400">
                                                    expand_more
                                                </span>
                                            </span>
                                        </summary>
                                        <div className="text-slate-500 text-sm mt-3">
                                            <p>
                                                Free shipping on orders over ₹999. Easy 7-day returns.
                                            </p>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Action Bar */}
                        <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-5 py-4 z-30">
                            <div className="flex items-center gap-4">
                                {/* Wishlist Button */}
                                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-primary hover:border-primary transition-colors bg-white dark:bg-slate-800">
                                    <span className="material-symbols-outlined">favorite</span>
                                </button>

                                {/* Add to Cart Button */}
                                <motion.button
                                    onClick={handleAddToCart}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        shopping_bag
                                    </span>
                                    {addedToCart ? "Added! ✓" : "Add to Cart"}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

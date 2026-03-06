/**
 * ============================================================
 * Discover Page — Search & Browse
 * ============================================================
 *
 * Sections:
 *   - Search bar with autofocus (wired to Supabase search)
 *   - Filter pills (All, Occasion, Type, Price, Material)
 *   - Recent Searches with Clear All
 *   - Trending Categories 2×2 grid (static)
 *   - "Recommended for You" fetched from Supabase
 * ============================================================
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts, searchProducts, getTrendingCategories } from "@/lib/supabase/queries";
import { CURRENCY } from "@/lib/constants";
import type { Product, Category } from "@/types";

const DISCOVER_PILLS = [
    { id: "all", label: "All", hasDropdown: false },
    { id: "occasion", label: "Occasion", hasDropdown: true },
    { id: "type", label: "Type", hasDropdown: true },
    { id: "price", label: "Price", hasDropdown: true },
    { id: "material", label: "Material", hasDropdown: true },
];

const FILTER_OPTIONS = {
    occasion: ["Wedding", "Party", "Casual", "Gift"],
    type: ["Necklace", "Ring", "Earrings", "Bracelet"],
    price: ["Under ₹5000", "₹5000 - ₹20000", "Above ₹20000"],
    material: ["Gold", "Silver", "Platinum", "Diamond"]
};

export default function DiscoverPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [recentSearches, setRecentSearches] = useState([
        "Vintage Pearl Necklace",
        "Silver Rings",
    ]);
    const [recommended, setRecommended] = useState<Product[]>([]);
    const [searchResults, setSearchResults] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [trendingCategories, setTrendingCategories] = useState<Category[]>([]);

    // Fetch recommended products and trending categories from DB
    useEffect(() => {
        setLoading(true);
        Promise.all([
            getProducts({ limit: 4, activeOnly: true, tag: "trending" }),
            getTrendingCategories()
        ]).then(([productsRes, categoriesRes]) => {
            setRecommended((productsRes.data as Product[]) ?? []);
            setTrendingCategories((categoriesRes.data as Category[]) ?? []);
            setLoading(false);
        });
    }, []);

    // Search with debounce
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }

        const timer = setTimeout(() => {
            searchProducts(searchQuery.trim()).then(({ data }) => {
                setSearchResults((data as Product[]) ?? []);
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-7rem)]">
            {/* Header */}
            <div className="flex items-center bg-white dark:bg-slate-900 px-4 pb-2 pt-2 justify-between sticky top-12 z-20">
                <Link
                    href="/"
                    className="text-slate-900 dark:text-white flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-transform p-2"
                >
                    <span className="material-symbols-outlined text-[24px]">
                        arrow_back
                    </span>
                </Link>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">
                    Discover
                </h2>
                <Link
                    href="/cart"
                    className="relative flex items-center justify-center rounded-full p-2 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-transform text-slate-900 dark:text-white"
                >
                    <span className="material-symbols-outlined text-[24px]">
                        shopping_cart
                    </span>
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-2 ring-white dark:ring-slate-900" />
                </Link>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3 bg-white dark:bg-slate-900 sticky top-24 z-10">
                <div className="flex w-full items-stretch rounded-xl h-12 shadow-sm bg-slate-100 dark:bg-slate-800">
                    <div className="flex items-center justify-center pl-4 text-slate-500">
                        <span className="material-symbols-outlined text-[22px]">
                            search
                        </span>
                    </div>
                    <input
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-slate-900 dark:text-white px-3 text-base font-normal focus:outline-none placeholder:text-slate-400"
                        placeholder="Try 'Rose Gold Earrings'"
                    />
                    {searchQuery && (
                        <div className="flex items-center justify-center pr-3">
                            <button
                                onClick={() => setSearchQuery("")}
                                className="flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-700 p-1 text-slate-500 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    close
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 bg-white dark:bg-slate-900">
                {/* Search Results */}
                {searchResults !== null ? (
                    <div className="px-4 py-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                            Results for &ldquo;{searchQuery}&rdquo;
                        </h3>
                        {searchResults.length === 0 ? (
                            <div className="flex flex-col items-center py-12 text-slate-400 gap-2">
                                <span className="material-symbols-outlined text-4xl">
                                    search_off
                                </span>
                                <p className="text-sm">No products found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {searchResults.map((product) => (
                                    <div key={product.id} className="flex flex-col gap-2">
                                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                                            {product.media_urls?.[0] && (
                                                <Image
                                                    src={product.media_urls[0]}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 448px) 50vw, 200px"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-semibold text-sm truncate">
                                                {product.title}
                                            </p>
                                            <p className="text-slate-500 text-xs">
                                                {CURRENCY}
                                                {(product.discount_price ?? product.selling_price).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Filter Pills Area */}
                        <div className="relative w-full z-20">
                            {/* Filter Pills */}
                            <div className="flex gap-2.5 px-4 pb-4 overflow-x-auto no-scrollbar w-full">
                                {DISCOVER_PILLS.map((pill) => (
                                    <button
                                        key={pill.id}
                                        onClick={() => {
                                            setActiveFilter(pill.id);
                                            if (pill.hasDropdown) {
                                                setOpenDropdown(openDropdown === pill.id ? null : pill.id);
                                            } else {
                                                setOpenDropdown(null);
                                                setSearchQuery(""); // Clear search on "All"
                                            }
                                        }}
                                        className={`flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-full px-4 active:scale-95 transition-transform text-sm font-medium ${activeFilter === pill.id
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                                            : "bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            }`}
                                    >
                                        {pill.label}
                                        {pill.hasDropdown && (
                                            <span className="material-symbols-outlined text-slate-400 text-[18px]">
                                                keyboard_arrow_down
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Dropdown Menu (Horizontal Scroll) */}
                            {openDropdown && (
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800 py-3 mb-2 animate-in slide-in-from-top-2 duration-200">
                                    <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar w-full">
                                        {FILTER_OPTIONS[openDropdown as keyof typeof FILTER_OPTIONS]?.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setSearchQuery(option);
                                                    setOpenDropdown(null);
                                                }}
                                                className="shrink-0 text-sm font-medium px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-95 transition-all"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <div className="px-4 mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-slate-900 dark:text-white text-sm font-bold tracking-tight">
                                        Recent Searches
                                    </h3>
                                    <button
                                        onClick={() => setRecentSearches([])}
                                        className="text-primary text-xs font-semibold"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((term) => (
                                        <div
                                            key={term}
                                            onClick={() => setSearchQuery(term)}
                                            className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-slate-600 dark:text-slate-300 text-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-slate-400 text-[16px]">
                                                history
                                            </span>
                                            {term}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trending Categories */}
                        <div className="flex items-center justify-between px-4 pb-3">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                                Trending Categories
                            </h3>
                            <button className="text-primary text-sm font-medium flex items-center gap-0.5">
                                View All
                                <span className="material-symbols-outlined text-[16px]">
                                    arrow_forward
                                </span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 px-4 pb-6">
                            {trendingCategories.map((cat) => (
                                <Link
                                    href={`/discover?category=${cat.id}`}
                                    key={cat.id}
                                    className="group relative overflow-hidden rounded-xl h-48 w-full shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
                                >
                                    {cat.image && (
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 448px) 50vw, 200px"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 flex flex-col justify-end">
                                        <h4 className="text-white font-bold text-base leading-tight">
                                            {cat.name}
                                        </h4>
                                        {cat.description && (
                                            <p className="text-white/80 text-xs mt-1 truncate">{cat.description}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Recommended for You */}
                        <div className="px-4 pb-20">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 w-1 bg-primary rounded-full" />
                                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                                    Recommended for You
                                </h3>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
                                {loading
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="w-36 shrink-0 animate-pulse">
                                            <div className="w-full aspect-square rounded-xl bg-slate-200 dark:bg-slate-800 mb-2" />
                                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-1" />
                                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                                        </div>
                                    ))
                                    : recommended.map((product) => (
                                        <div key={product.id} className="w-36 shrink-0 flex flex-col gap-2">
                                            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                                                {product.media_urls?.[0] && (
                                                    <Image
                                                        src={product.media_urls[0]}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="144px"
                                                    />
                                                )}
                                                <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-primary transition-colors">
                                                    <span
                                                        className="material-symbols-outlined text-[16px]"
                                                        style={{ fontVariationSettings: "'FILL' 0" }}
                                                    >
                                                        favorite
                                                    </span>
                                                </button>
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-semibold text-sm truncate">
                                                    {product.title}
                                                </p>
                                                <p className="text-slate-500 text-xs">
                                                    {CURRENCY}
                                                    {(product.discount_price ?? product.selling_price).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

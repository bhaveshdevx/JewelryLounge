/**
 * ============================================================
 * FilterPills — Horizontal Scrolling Filter Buttons
 * ============================================================
 *
 * Pills: Under ₹499, Trending, New Arrivals, Best Sellers
 * Active pill = pink bg, inactive = slate bg with border.
 * ============================================================
 */

"use client";

import { FILTER_PILLS } from "@/lib/mock-data";

interface FilterPillsProps {
    /** ID of the currently active filter (null = none) */
    activeFilter: string | null;
    /** Callback when a pill is tapped */
    onFilterChange: (filterId: string | null) => void;
}

export function FilterPills({ activeFilter, onFilterChange }: FilterPillsProps) {
    return (
        <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar">
            {FILTER_PILLS.map((pill) => {
                const isActive = activeFilter === pill.id;

                return (
                    <button
                        key={pill.id}
                        onClick={() => onFilterChange(isActive ? null : pill.id)}
                        className={`flex h-8 shrink-0 items-center justify-center px-4 rounded-full text-xs font-medium transition-all active:scale-95 ${isActive
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                    >
                        {pill.label}
                    </button>
                );
            })}
        </div>
    );
}

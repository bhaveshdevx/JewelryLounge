/**
 * ============================================================
 * VibeBubbles — Instagram Story-Style Category Scroller
 * ============================================================
 *
 * Horizontal scrolling row of circular category thumbnails.
 * Active bubble has a gradient ring; tapping switches the active vibe.
 * ============================================================
 */

"use client";

import Image from "next/image";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

interface VibeBubblesProps {
    /** Currently selected vibe slug (null = show all) */
    activeVibe: string | null;
    /** Callback when a vibe bubble is tapped */
    onVibeChange: (slug: string | null) => void;
}

export function VibeBubbles({ activeVibe, onVibeChange }: VibeBubblesProps) {
    return (
        <div className="w-full overflow-x-auto pb-2 pt-3 no-scrollbar">
            <div className="flex items-start gap-4 px-4 min-w-max">
                {MOCK_CATEGORIES.map((cat, i) => {
                    const isActive = activeVibe === cat.slug;
                    // First item gets primary ring by default, active item gets primary+purple ring
                    const showGradient = isActive || (activeVibe === null && i === 0);

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onVibeChange(isActive ? null : cat.slug)}
                            className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        >
                            {/* Gradient ring wrapper */}
                            <div
                                className={`p-[2px] rounded-full transition-transform duration-300 group-hover:scale-105 ${showGradient
                                        ? "bg-gradient-to-tr from-primary to-orange-400"
                                        : "bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"
                                    }`}
                            >
                                <div className="h-16 w-16 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden relative">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                            </div>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {cat.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

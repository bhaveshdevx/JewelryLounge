/**
 * ============================================================
 * Header — Sticky Top Bar
 * ============================================================
 *
 * Auto-hides on scroll down, reappears on scroll up.
 * Contains: diamond logo, brand name, search icon, notification bell.
 *
 * Uses Framer Motion for smooth slide animation.
 * ============================================================
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";

export function Header() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    // Track scroll direction — hide on scroll down, show on scroll up
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 50) {
            setHidden(true); // scrolling down
        } else {
            setHidden(false); // scrolling up
        }
    });

    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="sticky top-0 z-50 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 border-b border-slate-100 dark:border-slate-800 h-12"
        >
            {/* Logo */}
            <Link href="/" className="flex items-center text-primary">
                <span className="material-symbols-outlined !text-2xl">diamond</span>
                <span className="ml-2 font-bold text-lg tracking-tight text-slate-900 dark:text-white hidden sm:block">
                    Jewelry Lounge
                </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
                {/* Search */}
                <Link
                    href="/discover"
                    className="flex items-center justify-center p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                >
                    <span className="material-symbols-outlined !text-[20px]">search</span>
                </Link>

                {/* Notifications */}
                <button className="relative flex items-center justify-center p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined !text-[20px]">
                        notifications
                    </span>
                    {/* Red notification dot */}
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-1 ring-white dark:ring-slate-900" />
                </button>
            </div>
        </motion.header>
    );
}

/**
 * ============================================================
 * Profile Page — User Hub
 * ============================================================
 *
 * Sections:
 *   - Header: settings gear, avatar with edit badge, name, subtitle
 *   - The Vault: horizontal scroll of liked products
 *   - Account: Saved Addresses, Payment Methods, Notifications
 *   - Preferences: Theme toggle (Light / Dark / Luxury)
 *   - Customer Support link
 *   - Log Out button + version
 * ============================================================
 */

"use client";

import Image from "next/image";
import { useThemeStore } from "@/stores/theme-store";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { CURRENCY } from "@/lib/constants";
import type { Theme } from "@/types";

/** Vault items — simulating liked products */
const VAULT_ITEMS = MOCK_PRODUCTS.slice(0, 3);

/** Account menu items */
const ACCOUNT_ITEMS = [
    {
        icon: "location_on",
        title: "Saved Addresses",
        subtitle: "Manage shipping locations",
    },
    {
        icon: "credit_card",
        title: "Payment Methods",
        subtitle: "Visa ending in 4242",
    },
    {
        icon: "notifications",
        title: "Notifications",
        subtitle: "Order updates & promos",
    },
];

export default function ProfilePage() {
    const { theme, setTheme } = useThemeStore();

    const themes: { id: Theme; icon: string; label: string }[] = [
        { id: "light", icon: "light_mode", label: "Light" },
        { id: "dark", icon: "dark_mode", label: "Dark" },
        { id: "luxury", icon: "diamond", label: "Luxury" },
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-7rem)]">
            {/* Header Section */}
            <div className="relative pt-8 pb-6 px-6 bg-slate-50 dark:bg-slate-900/50">
                {/* Settings Gear */}
                <div className="absolute top-0 right-0 p-4">
                    <button className="text-slate-500 hover:text-primary dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-[24px]">
                            settings
                        </span>
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-200">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGKP8LHEBNeUhgt2mdfMtBz0bgtBCWj87qiJ4oO3Q8I_r3g1FleCUaue2JwLxxLWSESDWRyTwV6FUD0XCL9AXJfA2kJSE6XUjN_8wg1zSy5aV-_jcBw-5lhYa7HfFaPrVooWCqZT3bilW47X7jsiceoSod9pxKS9PESNHmW2PnoBLk2-GQjW82VEd231bgIJn97UIKAVFNzWncQ27sRnJ_wOsft9l1aeZUH0kVkpSo0ujHsxk9t5LOqXwGDIYPoWa4uBryhLPOFqY"
                                alt="Profile picture"
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Edit badge */}
                        <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px] font-bold">
                                edit
                            </span>
                        </div>
                    </div>

                    {/* Name & subtitle */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Aria
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                            Jewelry Enthusiast • Member since 2023
                        </p>
                    </div>

                    {/* Edit Profile button */}
                    <button className="inline-flex items-center justify-center h-9 px-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-primary shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors mt-2">
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-t-3xl -mt-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] relative z-10 pb-24">
                {/* The Vault */}
                <div className="pt-8 pb-4">
                    <div className="flex items-center justify-between px-6 mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">
                                favorite
                            </span>
                            The Vault
                        </h2>
                        <button className="text-xs font-bold text-primary hover:text-primary/80">
                            View All
                        </button>
                    </div>

                    <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar snap-x snap-mandatory">
                        {VAULT_ITEMS.map((product) => (
                            <div key={product.id} className="flex-none w-40 snap-start">
                                <div className="relative aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 mb-3 overflow-hidden group">
                                    {/* Heart badge */}
                                    <div className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                                        <span
                                            className="material-symbols-outlined text-primary text-[16px]"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            favorite
                                        </span>
                                    </div>
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="160px"
                                    />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {CURRENCY}
                                    {(product.salePrice ?? product.price).toLocaleString("en-IN")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-2" />

                {/* Account Section */}
                <div className="px-4 py-2">
                    <h3 className="px-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Account
                    </h3>
                    <div className="flex flex-col gap-1">
                        {ACCOUNT_ITEMS.map((item) => (
                            <button
                                key={item.title}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group w-full text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">
                                        {item.icon}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {item.subtitle}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 text-[20px]">
                                    chevron_right
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-2" />

                {/* Preferences Section */}
                <div className="px-4 py-2">
                    <h3 className="px-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Preferences
                    </h3>

                    {/* Theme Toggle */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl mb-3">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-3 px-1">
                            App Theme
                        </p>
                        <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 shadow-sm border border-slate-100 dark:border-slate-800">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${theme === t.id
                                            ? "bg-primary text-white shadow-sm font-bold"
                                            : "text-slate-500 dark:text-slate-400 hover:text-primary"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {t.icon}
                                    </span>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Customer Support */}
                    <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group w-full text-left">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">
                                support_agent
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                Customer Support
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Get help with your orders
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 text-[20px]">
                            chevron_right
                        </span>
                    </button>
                </div>

                {/* Log Out */}
                <div className="px-6 py-6 mt-4 mb-2">
                    <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">
                            logout
                        </span>
                        Log Out
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-4">
                        Version 2.4.0 • Jewelry Lounge Inc.
                    </p>
                </div>
            </div>
        </div>
    );
}

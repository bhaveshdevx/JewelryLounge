/**
 * ============================================================
 * Profile Page — User Hub
 * ============================================================
 *
 * Sections:
 *   - Auth: Google sign-in if not logged in
 *   - Header: settings gear, avatar with edit badge, name, subtitle
 *   - The Vault: horizontal scroll of liked products (from DB)
 *   - Account: Saved Addresses, Payment Methods, Notifications
 *   - Preferences: Theme toggle (Light / Dark / Luxury)
 *   - Customer Support link
 *   - Log Out button + version
 * ============================================================
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useThemeStore } from "@/stores/theme-store";
import { useAuthStore } from "@/stores/auth-store";
import { getLikedItems } from "@/lib/supabase/queries";
import { uploadAvatar, getAvatarUrl } from "@/lib/supabase/storage";
import { CURRENCY } from "@/lib/constants";
import type { Theme, Product } from "@/types";

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
        subtitle: "Manage payment options",
    },
    {
        icon: "notifications",
        title: "Notifications",
        subtitle: "Order updates & promos",
    },
];

export default function ProfilePage() {
    const { theme, setTheme } = useThemeStore();
    const { user, profile, isLoading, isAdmin, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } =
        useAuthStore();
    const [vaultItems, setVaultItems] = useState<Product[]>([]);
    const [vaultLoading, setVaultLoading] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auth form state
    const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [authSuccess, setAuthSuccess] = useState<string | null>(null);
    const [authSubmitting, setAuthSubmitting] = useState(false);

    const themes: { id: Theme; icon: string; label: string }[] = [
        { id: "light", icon: "light_mode", label: "Light" },
        { id: "dark", icon: "dark_mode", label: "Dark" },
        { id: "luxury", icon: "diamond", label: "Luxury" },
    ];

    // Fetch liked items for "The Vault" when user is authenticated
    useEffect(() => {
        if (!user) return;
        setVaultLoading(true);
        getLikedItems(user.id).then(({ data }) => {
            // Extract the product from each joined row
            const products = (data ?? [])
                .map((row: any) => row.product)
                .filter(Boolean);
            setVaultItems(products);
            setVaultLoading(false);
        });
    }, [user]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        setAuthSuccess(null);
        setAuthSubmitting(true);

        if (authMode === "signin") {
            const err = await signInWithEmail(email, password);
            if (err) setAuthError(err);
        } else {
            if (!fullName.trim()) {
                setAuthError("Please enter your full name");
                setAuthSubmitting(false);
                return;
            }
            const err = await signUpWithEmail(email, password, fullName.trim());
            if (err) {
                setAuthError(err);
            } else {
                setAuthSuccess("Account created! Check your email for a confirmation link.");
            }
        }

        setAuthSubmitting(false);
    };

    // ---- Not signed in → show sign-in / sign-up card ----
    if (!isLoading && !user) {
        return (
            <div className="flex flex-col items-center min-h-[calc(100vh-7rem)] px-6 pt-10 pb-8 gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-400">
                        account_circle
                    </span>
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {authMode === "signin" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        {authMode === "signin"
                            ? "Sign in to access your profile and orders"
                            : "Join Jewelry Lounge to start shopping"}
                    </p>
                </div>

                {/* Email / Password Form */}
                <form onSubmit={handleEmailAuth} className="w-full max-w-sm flex flex-col gap-3">
                    {/* Full Name — only in sign-up mode */}
                    {authMode === "signup" && (
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                                person
                            </span>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full h-12 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                            mail
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            required
                            className="w-full h-12 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                            lock
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            minLength={6}
                            className="w-full h-12 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Error / Success message */}
                    {authError && (
                        <p className="text-xs text-red-500 font-medium px-1">{authError}</p>
                    )}
                    {authSuccess && (
                        <p className="text-xs text-green-500 font-medium px-1">{authSuccess}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={authSubmitting}
                        className="w-full h-12 bg-primary text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {authSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : authMode === "signin" ? (
                            "Sign In"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Toggle sign-in ↔ sign-up */}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {authMode === "signin" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={() => { setAuthMode("signup"); setAuthError(null); setAuthSuccess(null); }}
                                className="text-primary font-bold hover:underline"
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => { setAuthMode("signin"); setAuthError(null); setAuthSuccess(null); }}
                                className="text-primary font-bold hover:underline"
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 w-full max-w-sm">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    <span className="text-xs text-slate-400 font-medium">or</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Google Sign-In */}
                <button
                    onClick={signInWithGoogle}
                    className="w-full max-w-sm flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Continue with Google
                    </span>
                </button>

                {/* Theme toggle even without login */}
                <div className="w-full max-w-sm mt-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
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
                </div>
            </div>
        );
    }

    // ---- Loading state ----
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-7rem)]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ---- Signed in ----
    const displayName = profile?.full_name || user?.user_metadata?.full_name || "User";
    const avatarUrl = customAvatarUrl || user?.user_metadata?.avatar_url || "";
    const memberSince = profile?.created_at
        ? new Date(profile.created_at).getFullYear()
        : new Date().getFullYear();

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be under 5MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        setAvatarUploading(true);
        const { data, error } = await uploadAvatar(user.id, file);
        if (!error && data) {
            const ext = file.name.split(".").pop() || "jpg";
            const url = getAvatarUrl(user.id, `avatar.${ext}`);
            // Add cache-busting timestamp
            setCustomAvatarUrl(url + "?t=" + Date.now());
        }
        setAvatarUploading(false);
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-7rem)]">
            {/* Hidden file input for avatar upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
            />

            {/* Header Section */}
            <div className="relative pt-8 pb-6 px-6 bg-slate-50 dark:bg-slate-900/50">

                <div className="flex flex-col items-center gap-4">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-200">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt={displayName}
                                    width={112}
                                    height={112}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                    <span className="material-symbols-outlined text-5xl text-primary">
                                        person
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Edit badge — triggers file upload */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarUploading}
                            className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1.5 shadow-md flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                            {avatarUploading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <span className="material-symbols-outlined text-[16px] font-bold">
                                    edit
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Name & subtitle */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {displayName}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                            {isAdmin ? "Admin" : "Jewelry Enthusiast"} • Member since {memberSince}
                        </p>
                    </div>

                    {/* Edit Profile button */}
                    <button className="inline-flex items-center justify-center h-9 px-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-primary shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors mt-2">
                        Edit Profile
                    </button>

                    {/* Admin Dashboard link */}
                    {isAdmin && (
                        <a
                            href="/admin"
                            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary px-4 py-2 rounded-full shadow-sm hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                admin_panel_settings
                            </span>
                            Admin Dashboard
                        </a>
                    )}
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

                    {vaultLoading ? (
                        <div className="flex gap-4 px-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex-none w-40 animate-pulse">
                                    <div className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800 mb-3" />
                                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : vaultItems.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-slate-400 gap-2">
                            <span className="material-symbols-outlined text-3xl">
                                favorite_border
                            </span>
                            <p className="text-xs font-medium">No liked items yet</p>
                        </div>
                    ) : (
                        <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar snap-x snap-mandatory">
                            {vaultItems.map((product) => (
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
                                        {product.media_urls?.[0] && (
                                            <Image
                                                src={product.media_urls[0]}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="160px"
                                            />
                                        )}
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {product.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {CURRENCY}
                                        {(product.discount_price ?? product.selling_price).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
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
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {item.title}
                                        </p>
                                        <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                            Soon
                                        </span>
                                    </div>
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

                    {/* Customer Support Section */}
                    <div className="mt-2">
                        <div className="flex items-center gap-3 p-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">
                                    support_agent
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Customer Support</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">We&apos;re here to help</p>
                            </div>
                        </div>

                        {/* Quick Contact Actions */}
                        <div className="flex gap-2 px-3 pb-3">
                            <a
                                href="mailto:support@jewelrylounge.com?subject=Support Request"
                                className="flex-1 flex flex-col items-center gap-1 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Email</span>
                            </a>
                            <a
                                href="tel:+919999999999"
                                className="flex-1 flex flex-col items-center gap-1 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Call</span>
                            </a>
                            <a
                                href="https://wa.me/919999999999?text=Hi%20Jewelry%20Lounge%2C%20I%20need%20help%20with%20my%20order"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex flex-col items-center gap-1 py-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                            >
                                <span className="material-symbols-outlined text-green-600 text-[20px]">chat</span>
                                <span className="text-[10px] font-bold text-green-700 dark:text-green-400">WhatsApp</span>
                            </a>
                        </div>

                        {/* FAQ */}
                        <div className="px-3 pb-2 space-y-1">
                            {[
                                { q: "How long does shipping take?", a: "Standard delivery takes 5-7 business days. Express delivery takes 2-3 days." },
                                { q: "What is your return policy?", a: "We offer 7-day easy returns on all unworn items with original packaging." },
                                { q: "How can I track my order?", a: "Once shipped, you'll receive a tracking link via email and SMS." },
                            ].map((faq) => (
                                <details key={faq.q} className="group bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                                    <summary className="flex items-center justify-between p-3 cursor-pointer list-none text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {faq.q}
                                        <span className="material-symbols-outlined text-[16px] text-slate-400 transition-transform group-open:rotate-180">expand_more</span>
                                    </summary>
                                    <p className="px-3 pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Log Out */}
                <div className="px-6 py-6 mt-4 mb-2">
                    <button
                        onClick={signOut}
                        className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
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

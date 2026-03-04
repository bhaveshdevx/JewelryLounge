/**
 * ============================================================
 * Root Layout — Jewelry Lounge
 * ============================================================
 *
 * Top-level layout wrapping every page.
 * - Plus Jakarta Sans font (matching mockups)
 * - Material Symbols Outlined icons via CDN
 * - ThemeProvider for Light/Dark/Luxury switching
 * - Header (auto-hide) + BottomNav (fixed)
 * - Mobile-first max-w-md centered layout (shop pages)
 * - Full-width layout for /admin routes (PC-friendly)
 * ============================================================
 */

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "@/styles/themes.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { LayoutShell } from "@/components/layout/layout-shell";
import { Analytics } from "@vercel/analytics/next"
// ---------------------------------------------------------------------------
// Font Configuration — Plus Jakarta Sans (matches HTML mockups)
// ---------------------------------------------------------------------------

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// ---------------------------------------------------------------------------
// Metadata (SEO + PWA)
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ---------------------------------------------------------------------------
// Layout Component
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Material Symbols Outlined — icon font used across the app */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased bg-[#f8f6f7] dark:bg-[#221019] selection:bg-primary selection:text-white`}
      >
        <ThemeProvider>
          <AuthProvider>
            <LayoutShell>{children}</LayoutShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

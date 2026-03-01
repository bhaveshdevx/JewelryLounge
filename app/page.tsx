/**
 * ============================================================
 * Home Page — The Hub
 * ============================================================
 *
 * Sections:
 *   1. VibeBubbles (story-style category selector)
 *   2. HeroCarousel (promotional banners)
 *   3. FilterPills (price/category quick filters)
 *   4. ProductGrid (filtered 2-column grid)
 *   5. ProductDrawer (opens on product tap)
 * ============================================================
 */

"use client";

import { useState } from "react";
import { VibeBubbles } from "@/components/home/vibe-bubbles";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { FilterPills } from "@/components/home/filter-pills";
import { ProductGrid } from "@/components/home/product-grid";
import { ProductDrawer } from "@/components/product/product-drawer";
import type { Product } from "@/types";

export default function HomePage() {
  /* Active vibe category slug (null = show all) */
  const [activeVibe, setActiveVibe] = useState<string | null>(null);

  /* Active filter pill ID (null = no filter) */
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  /* Product currently shown in the drawer (null = closed) */
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);

  return (
    <>
      {/* 1. Vibe Bubbles — story-style category selector */}
      <VibeBubbles activeVibe={activeVibe} onVibeChange={setActiveVibe} />

      {/* 2. Hero Carousel — promotional banners */}
      <HeroCarousel />

      {/* 3. Filter Pills — quick filters */}
      <FilterPills
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* 4. Product Grid — 2-column filtered grid */}
      <ProductGrid
        activeVibe={activeVibe}
        activeFilter={activeFilter}
        onProductTap={setDrawerProduct}
      />

      {/* 5. Product Detail Drawer — slides up on product tap */}
      <ProductDrawer
        product={drawerProduct}
        onClose={() => setDrawerProduct(null)}
      />
    </>
  );
}

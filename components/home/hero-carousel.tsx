/**
 * ============================================================
 * HeroCarousel — Snap-Scrolling Promotional Banners
 * ============================================================
 *
 * Uses Embla Carousel for smooth snap scrolling.
 * Each banner: full-bleed image + gradient overlay + badge + title + subtitle.
 * ============================================================
 */

"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { MOCK_BANNERS } from "@/lib/mock-data";

export function HeroCarousel() {
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: "center",
        containScroll: "trimSnaps",
    });

    return (
        <div className="mt-3 px-4 w-full overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
                {MOCK_BANNERS.map((banner) => (
                    <div
                        key={banner.id}
                        className="flex-[0_0_90%] relative rounded-xl overflow-hidden aspect-[21/9] group shadow-sm cursor-pointer"
                    >
                        {/* Banner Image */}
                        {banner.image && (
                            <Image
                                src={banner.image}
                                alt={banner.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 448px) 90vw, 400px"
                                priority
                            />
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                            {/* Badge */}
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-1 uppercase tracking-wide ${banner.badgeVariant === "primary"
                                    ? "bg-primary text-white"
                                    : "bg-white text-slate-900"
                                    }`}
                            >
                                {banner.badge}
                            </span>

                            {/* Title & Subtitle */}
                            <h2 className="text-white text-lg font-bold leading-tight">
                                {banner.title}
                            </h2>
                            <p className="text-slate-200 text-xs">{banner.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * ============================================================
 * Coming Soon — Placeholder Component
 * ============================================================
 *
 * Beautiful "Under Construction" placeholder for features
 * that aren't built yet.
 * ============================================================
 */

"use client";

interface ComingSoonProps {
    /** Feature title */
    title: string;
    /** Short description */
    description?: string;
    /** Material icon name */
    icon?: string;
}

export function ComingSoon({
    title,
    description = "This feature is coming soon. Stay tuned!",
    icon = "construction",
}: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* Animated icon */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl">
                        {icon}
                    </span>
                </div>
            </div>

            {/* Text */}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                {description}
            </p>

            {/* Badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                Coming Soon
            </div>
        </div>
    );
}

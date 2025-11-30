"use client";

import { cn } from "@/lib/utils";

export default function FeatureCard({
    icon,
    title,
    description,
    color = "blue",
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color?: string;
}) {
    const colors: Record<string, string> = {
        blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20",
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20",
        emerald:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20",
        orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500/20",
        yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-500/20",
        red: "bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-500/20",
    };

    return (
        <div className="group relative p-8 rounded-3xl glass-card hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />

            <div
                className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300",
                    colors[color]
                )}
            >
                {icon}
            </div>

            <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {title}
            </h3>

            <p className="text-muted-foreground leading-relaxed flex-1">
                {description}
            </p>
        </div>
    );
}

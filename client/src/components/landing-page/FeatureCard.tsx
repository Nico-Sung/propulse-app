"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

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
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    const colors: Record<string, string> = {
        blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20",
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20",
        emerald:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20",
        orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500/20",
        yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-500/20",
        red: "bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-500/20",
        pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:bg-pink-500/20", 
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative p-8 rounded-3xl glass-card hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden"
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
                }}
            />

            <div
                className="pointer-events-none absolute inset-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(var(--primary), 0.05), transparent 40%)`,
                }}
            />

            <div className="relative z-10">
                <div
                    className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300",
                        colors[color] || colors.blue
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
        </div>
    );
}

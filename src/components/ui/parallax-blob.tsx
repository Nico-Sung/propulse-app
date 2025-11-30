"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface ParallaxBlobProps {
    className?: string;
    speed?: number;
}

export default function ParallaxBlob({
    className,
    speed = 0.2,
}: ParallaxBlobProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;

            const scrollY = window.scrollY;
            const offset = scrollY * speed;

            ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [speed]);

    return (
        <div
            ref={ref}
            className={cn(
                "fixed pointer-events-none will-change-transform z-0",
                className
            )}
        />
    );
}

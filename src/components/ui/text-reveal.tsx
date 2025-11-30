"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    as?: "h1" | "h2" | "h3" | "p" | "div";
}

export default function TextReveal({
    text,
    className,
    delay = 0,
    as: Component = "div",
}: TextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const words = text.split(" ");

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

    return (
        <Component
            ref={containerRef}
            className={cn("flex flex-wrap gap-x-[0.25em]", className)}
        >
            <span className="sr-only">{text}</span>
            {words.map((word, i) => (
                <span key={i} className="overflow-hidden block relative">
                    <span
                        className={cn(
                            "block transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            isVisible ? "translate-y-0" : "translate-y-[120%]"
                        )}
                        style={{
                            transitionDelay: `${delay + i * 30}ms`,
                        }}
                    >
                        {word}
                    </span>
                </span>
            ))}
        </Component>
    );
}

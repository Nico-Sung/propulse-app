"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface RevealOnScrollProps {
    children: React.ReactNode;
    className?: string;
    delay?: number; 
}

export default function RevealOnScroll({
    children,
    className,
    delay = 0,
}: RevealOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold: 0.1, 
                rootMargin: "0px 0px -50px 0px", 
            }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-1000 ease-out transform",
                isVisible
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-12 blur-sm", 
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

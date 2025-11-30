"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface MouseGradientTrailProps {
    className?: string;
}

export default function MouseGradientTrail({
    className,
}: MouseGradientTrailProps) {
    const blobRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | null>(null);

    const mousePos = useRef({ x: 0, y: 0 });
    const blobPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            if (!blobRef.current) return;

            const ease = 0.1;

            blobPos.current.x +=
                (mousePos.current.x - blobPos.current.x) * ease;
            blobPos.current.y +=
                (mousePos.current.y - blobPos.current.y) * ease;

            const x = blobPos.current.x;
            const y = blobPos.current.y;

            blobRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div
                ref={blobRef}
                className={cn(
                    "absolute top-0 left-0 w-[500px] h-[500px] rounded-full",
                    "bg-gradient-to-r from-primary/30 via-purple-500/30 to-blue-500/30",
                    "blur-[100px] opacity-70 dark:opacity-50 mix-blend-screen dark:mix-blend-soft-light",
                    "transition-opacity duration-700 ease-in-out",
                    className
                )}
                style={{
                    willChange: "transform",
                }}
            />
        </div>
    );
}

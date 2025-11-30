"use client";

import ThemeToggle from "@/components/design-system/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingHeader() {
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setIsAtTop(currentScrollY < 50);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out",
                isAtTop ? "p-0" : "px-4 py-4 md:px-6"
            )}
        >
            <div
                className={cn(
                    "mx-auto transition-all duration-500 ease-in-out",
                    isAtTop ? "max-w-full" : "max-w-7xl"
                )}
            >
                <div
                    className={cn(
                        "flex items-center justify-between transition-all duration-500 relative overflow-hidden border",
                        isAtTop
                            ? "w-full rounded-none border-x-0 border-t-0 px-8 py-4"
                            : "rounded-full px-6 py-3",

                        isAtTop
                            ? "bg-white/30 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/10" // Style transparent/léger
                            : "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-white/40 dark:border-white/20 shadow-xl shadow-black/10 dark:shadow-black/40" // Style solide/flottant
                    )}
                >
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="relative h-8 w-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                            <Image
                                src="/logo.png"
                                alt="Propulse"
                                width={18}
                                height={18}
                                className="object-contain brightness-0 invert"
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 hidden sm:block">
                            Propulse
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground relative z-10">
                        <a
                            href="#features"
                            className="hover:text-primary transition-colors"
                        >
                            Fonctionnalités
                        </a>
                        <a
                            href="#testimonials"
                            className="hover:text-primary transition-colors"
                        >
                            Témoignages
                        </a>
                        <a
                            href="#pricing"
                            className="hover:text-primary transition-colors flex items-center gap-1"
                        >
                            Tarifs
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                Gratuit
                            </span>
                        </a>
                    </nav>

                    <div className="flex items-center gap-3 relative z-10">
                        <ThemeToggle className="hidden sm:flex rounded-full hover:bg-black/5" />
                        <Link href="/auth">
                            <Button
                                variant="ghost"
                                className="rounded-full hidden sm:flex hover:bg-black/5"
                            >
                                Se connecter
                            </Button>
                        </Link>
                        <Link href="/auth">
                            <Button className="rounded-full bg-primary hover:bg-primary/90 shadow-md px-6">
                                Commencer
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

"use client";

import ThemeToggle from "@/components/design-system/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingHeader() {
    return (
        <header className="fixed top-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto">
                <div className="glass-heavy rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-black/5 dark:shadow-black/20">
                    <div className="flex items-center gap-3">
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

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
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

                    <div className="flex items-center gap-3">
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

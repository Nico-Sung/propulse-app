"use client";

import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

            <div className="absolute top-6 left-6 z-20">
                <Link href="/">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-md border border-transparent hover:border-white/10 rounded-full transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </Button>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="glass-heavy rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8 md:p-10">
                    <div className="flex justify-center mb-8">
                        <div className="h-12 w-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={28}
                                height={28}
                                className="object-contain brightness-0 invert"
                            />
                        </div>
                    </div>

                    <AuthForm />
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Propulse. Tous droits
                        réservés.
                    </p>
                </div>
            </div>
        </div>
    );
}

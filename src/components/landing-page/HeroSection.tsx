"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-visible">
            <div className="max-w-7xl mx-auto text-center flex flex-col items-center gap-8 relative z-10">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Badge
                        variant="outline"
                        className="rounded-full px-4 py-1.5 bg-white/40 dark:bg-black/20 backdrop-blur-md border-primary/20 text-primary gap-2 shadow-sm"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>La nouvelle façon de trouver un job</span>
                    </Badge>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-backwards delay-100">
                    Organisez votre réussite <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                        sans le chaos.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-backwards delay-200">
                    Propulse centralise vos candidatures, automatise vos
                    relances et analyse vos performances pour vous aider à
                    décrocher le job de vos rêves.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-backwards delay-300">
                    <Link href="/auth">
                        <Button
                            size="lg"
                            className="rounded-full h-14 px-8 text-base shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 w-full sm:w-auto"
                        >
                            Commencer Gratuitement
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full h-14 px-8 text-base bg-white/40 dark:bg-white/5 backdrop-blur-md border-white/20 w-full sm:w-auto hover:bg-white/60"
                    >
                        Voir la démo
                    </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Tableau de bord Kanban</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Suivi intelligent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Analyses détaillées</span>
                    </div>
                </div>

                <div className="mt-16 w-full max-w-5xl relative animate-in fade-in zoom-in-95 duration-1000 delay-500">
                    <div className="relative rounded-2xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-sm p-2 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl pointer-events-none" />

                        <div className="rounded-xl overflow-hidden bg-background/80 aspect-[16/10] shadow-inner border border-black/5 dark:border-white/5 flex items-center justify-center relative">
                            <div className="block dark:hidden relative w-full h-full">
                                <Image
                                    src="/hero-light.png"
                                    alt="Interface claire de Propulse"
                                    fill
                                    className="object-cover object-top"
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                                />
                            </div>

                            <div className="hidden dark:block relative w-full h-full">
                                <Image
                                    src="/hero-dark.png"
                                    alt="Interface sombre de Propulse"
                                    fill
                                    className="object-cover object-top"
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="absolute -inset-4 bg-primary/20 blur-[60px] -z-10 rounded-full opacity-50" />
                </div>
            </div>
        </section>
    );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 px-4 md:px-6 lg:pt-40 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-screen w-full">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-60" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-full text-center flex flex-col items-center relative z-10">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mb-8">
                    <Badge
                        variant="outline"
                        className="rounded-full px-4 py-1.5 bg-white/5 backdrop-blur-xl border-white/10 text-foreground gap-2 shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:bg-white/10 transition-colors"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium tracking-wide">
                            La nouvelle façon de trouver un job
                        </span>
                    </Badge>
                </div>

                <div className="relative w-full max-w-[95vw] mx-auto leading-none">
                    <h1
                        className="
                            text-[16vw] md:text-[18vw] leading-[0.8] 
                            font-black tracking-tighter 
                            text-transparent bg-clip-text 
                            bg-gradient-to-b from-foreground via-foreground/80 to-foreground/10
                            select-none 
                            animate-in fade-in zoom-in-90 duration-1000 ease-out
                            transform-gpu
                            scale-y-110
                            drop-shadow-2xl
                        "
                        style={{
                            fontFamily: "var(--font-sans)",
                        }}
                    >
                        PROPULSE
                    </h1>

                    <div
                        className="absolute inset-0 text-[16vw] md:text-[18vw] leading-[0.8] font-black tracking-tighter text-white/5 mix-blend-overlay pointer-events-none scale-y-110 blur-[1px]"
                        aria-hidden="true"
                    >
                        PROPULSE
                    </div>
                </div>

                <p className="mt-16 md:mt-20 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 px-4">
                    Organisez votre réussite{" "}
                    <span className="text-foreground font-medium border-b border-primary/30 pb-0.5">
                        sans chaos
                    </span>
                    .
                    <br className="hidden md:block" />
                    Votre copilote de carrière intelligent et centralisé.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 z-20">
                    <Link href="/auth">
                        <Button
                            size="lg"
                            className="rounded-full h-14 px-8 text-base font-semibold shadow-[0_0_30px_rgba(var(--primary),0.4)] bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_50px_rgba(var(--primary),0.6)] transition-all duration-300 w-full sm:w-auto"
                        >
                            Commencer Gratuitement
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full h-14 px-8 text-base bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 hover:border-white/30 text-foreground w-full sm:w-auto transition-all"
                    >
                        Voir la démo
                    </Button>
                </div>

                <div className="mt-24 w-full max-w-[90rem] relative animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 px-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 blur-[100px] -z-10 rounded-full animate-pulse" />

                    <div className="relative rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-2 md:p-4 shadow-2xl ring-1 ring-white/10 transform hover:scale-[1.01] transition-transform duration-700">
                        <div className="rounded-xl overflow-hidden bg-background/80 shadow-inner border border-white/5 relative aspect-[16/9] md:aspect-[21/9]">
                            <div className="block dark:hidden relative w-full h-full">
                                <Image
                                    src="/hero-light.png"
                                    alt="Interface claire de Propulse"
                                    fill
                                    className="object-cover object-top opacity-95"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                                    priority
                                />
                            </div>
                            <div className="hidden dark:block relative w-full h-full">
                                <Image
                                    src="/hero-dark.png"
                                    alt="Interface sombre de Propulse"
                                    fill
                                    className="object-cover object-top opacity-95"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                                    priority
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

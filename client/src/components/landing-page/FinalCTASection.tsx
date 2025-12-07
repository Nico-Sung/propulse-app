"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinalCTASection() {
    return (
        <section className="py-32 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="glass-heavy rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[100px] -z-10" />

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
                        Prêt à décoller ?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Rejoignez dès maintenant les candidats qui ont choisi
                        l&apos;organisation plutôt que le hasard.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth">
                            <Button
                                size="lg"
                                className="rounded-full h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 w-full sm:w-auto"
                            >
                                Créer mon compte
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

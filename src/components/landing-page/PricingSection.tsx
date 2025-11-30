"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="glass-card rounded-3xl p-8 md:p-12 border border-primary/20 bg-primary/5 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />

                    <div className="text-center space-y-4 mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            100% Gratuit pour les candidats
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Notre mission est de vous aider à trouver un emploi,
                            pas de vous facturer pendant que vous en cherchez
                            un.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span className="text-foreground">
                                    Candidatures illimitées
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span className="text-foreground">
                                    Tableau de bord complet
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span className="text-foreground">
                                    Gestion des documents (CV, Lettres)
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span className="text-foreground">
                                    Rappels automatiques
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-6 text-center border border-white/20 dark:border-white/10 backdrop-blur-sm">
                            <div className="text-5xl font-bold text-primary mb-2">
                                0€
                            </div>
                            <div className="text-sm text-muted-foreground mb-6">
                                / mois
                            </div>
                            <Link href="/auth">
                                <Button
                                    size="lg"
                                    className="w-full rounded-full font-semibold"
                                >
                                    Créer mon compte gratuit
                                </Button>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-4">
                                Pas de carte bancaire requise.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

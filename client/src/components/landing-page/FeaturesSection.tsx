"use client";

import {
    BarChart2,
    Calendar,
    FileText,
    MessageSquareQuote,
    Target,
    Zap,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
    const features = [
        {
            icon: FileText,
            title: "Centralisation Totale",
            description:
                "Fini les feuilles Excel. Retrouvez toutes vos candidatures, CV et lettres de motivation au même endroit.",
            color: "blue",
        },
        {
            icon: Target,
            title: "Suivi Intelligent",
            description:
                "Sachez exactement où vous en êtes. Notre système vous rappelle quand relancer pour ne manquer aucune opportunité.",
            color: "purple",
        },
        {
            icon: BarChart2,
            title: "Analyses de Performance",
            description:
                "Comprenez ce qui fonctionne. Visualisez vos taux de conversion et optimisez votre stratégie de recherche.",
            color: "emerald",
        },
        {
            icon: Calendar,
            title: "Agenda Intégré",
            description:
                "Ne ratez aucun entretien. Synchronisez vos dates importantes et préparez-vous sereinement.",
            color: "orange",
        },
        {
            icon: Zap,
            title: "Actions Quotidiennes",
            description:
                "Une liste de tâches générée chaque matin pour vous garder concentré sur l'essentiel.",
            color: "yellow",
        },
        {
            icon: MessageSquareQuote,
            title: "Modèles de Messages",
            description:
                "Gagnez du temps avec des modèles pré-rédigés pour vos emails de relance, messages LinkedIn et remerciements.",
            color: "pink", 
        },
    ];

    return (
        <section id="features" className="py-32 px-6 relative">
            <div className="absolute inset-0 bg-white/50 dark:bg-black/20 -skew-y-3 transform origin-left -z-10 scale-110" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                        Tout ce dont vous avez besoin.
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Propulse a été conçu pour éliminer la friction de la
                        recherche d&apos;emploi et vous redonner le contrôle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={<feature.icon className="w-6 h-6" />}
                            title={feature.title}
                            description={feature.description}
                            color={feature.color}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

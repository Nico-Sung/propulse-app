"use client";

import Spinner from "@/components/ui/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { Award, BarChart3, Clock, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import FunnelStep from "./FunnelStep";
import InsightsList from "./InsightsList";
import StatCard from "./StatCard";

type Application = Database["public"]["Tables"]["applications"]["Row"];

interface Stats {
    total: number;
    applied: number;
    interviews: number;
    offers: number;
    rejected: number;
    conversionRate: number;
    averageResponseTime: number;
}

interface Insight {
    type: "success" | "warning" | "info";
    title: string;
    description: string;
}

const calculateStats = (apps: Application[]): Stats => {
    const total = apps.length;
    const applied = apps.filter((a) =>
        ["applied", "waiting", "interview", "offer", "rejected"].includes(
            a.status
        )
    ).length;
    const interviews = apps.filter(
        (a) => a.status === "interview" || a.status === "offer"
    ).length;
    const offers = apps.filter((a) => a.status === "offer").length;
    const rejected = apps.filter((a) => a.status === "rejected").length;
    const conversionRate =
        applied > 0 ? Math.round((interviews / applied) * 100) : 0;

    const appsWithDates = apps.filter(
        (a) => a.application_date && a.last_contact_date
    );
    let averageResponseTime = 0;
    if (appsWithDates.length > 0) {
        const totalDays = appsWithDates.reduce((sum, app) => {
            const appDate = new Date(app.application_date!);
            const contactDate = new Date(app.last_contact_date!);
            const diffTime = Math.abs(
                contactDate.getTime() - appDate.getTime()
            );
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return sum + diffDays;
        }, 0);
        averageResponseTime = Math.round(totalDays / appsWithDates.length);
    }

    return {
        total,
        applied,
        interviews,
        offers,
        rejected,
        conversionRate,
        averageResponseTime,
    };
};

const generateInsights = (stats: Stats): Insight[] => {
    const insightsList: Insight[] = [];

    if (stats.interviews > 0 && stats.applied > 0) {
        const interviewRate = (stats.interviews / stats.applied) * 100;
        if (interviewRate > 25) {
            insightsList.push({
                type: "success",
                title: "Excellent taux de conversion !",
                description: `Votre taux de passage en entretien est de ${Math.round(
                    interviewRate
                )}%.`,
            });
        }
    }
    if (stats.averageResponseTime > 5) {
        insightsList.push({
            type: "warning",
            title: "Délai de réponse élevé",
            description: `Votre délai moyen de réponse est de ${stats.averageResponseTime} jours. Essayez de répondre plus rapidement aux recruteurs.`,
        });
    }

    return insightsList;
};

export default function AnalyticsPanel() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const { data: appsData } = await supabase
                    .from("applications")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (appsData) {
                    const apps = appsData as Application[];
                    const calculatedStats = calculateStats(apps);
                    setStats(calculatedStats);

                    const generatedInsights = generateInsights(calculatedStats);
                    setInsights(generatedInsights);
                }
            } catch (err) {
                console.error("Error loading analytics data", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size={48} />
            </div>
        );
    }

    if (!stats)
        return (
            <p className="text-muted-foreground text-center py-10">
                Aucune donnée à analyser.
            </p>
        );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">
                    Données
                </h2>
                <p className="text-muted-foreground text-lg">
                    Une vue d&apos;ensemble de votre performance.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Target}
                    title="Candidatures"
                    value={stats.total}
                    color="primary"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Conversion"
                    value={`${stats.conversionRate}%`}
                    color="primary-variant"
                />
                <StatCard
                    icon={Clock}
                    title="Réponse moy."
                    value={
                        stats.averageResponseTime > 0
                            ? `${stats.averageResponseTime}j`
                            : "-"
                    }
                    color="warning"
                />
                <StatCard
                    icon={Award}
                    title="Offres"
                    value={stats.offers}
                    color="success"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="glass-card lg:col-span-2 border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-lg font-semibold text-foreground">
                                Entonnoir de conversion
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <FunnelStep
                            label="Candidatures envoyées"
                            value={stats.applied}
                            progress={100}
                            color="var(--color-primary)"
                        />
                        <FunnelStep
                            label="Processus d'entretien"
                            value={stats.interviews}
                            progress={
                                stats.applied > 0
                                    ? (stats.interviews / stats.applied) * 100
                                    : 0
                            }
                            color="var(--color-primary)"
                        />
                        <FunnelStep
                            label="Offres reçues"
                            value={stats.offers}
                            progress={
                                stats.applied > 0
                                    ? (stats.offers / stats.applied) * 100
                                    : 0
                            }
                            color="var(--color-success)"
                        />
                    </CardContent>
                </Card>

                <div className="lg:col-span-1">
                    <InsightsList insights={insights} />
                </div>
            </div>
        </div>
    );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react";

type Insight = {
    type: "success" | "warning" | "info";
    title: string;
    description: string;
};

export default function InsightsList({ insights }: { insights: Insight[] }) {
    if (!insights || insights.length === 0) return null;

    return (
        <Card className="glass-card border-0 h-full">
            <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-border/30">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <Lightbulb className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-foreground m-0">
                    Conseils
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex gap-3 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02]",
                            insight.type === "success"
                                ? "bg-green-500/5 border-green-500/20"
                                : insight.type === "warning"
                                ? "bg-orange-500/5 border-orange-500/20"
                                : "bg-blue-500/5 border-blue-500/20"
                        )}
                    >
                        <div
                            className={cn(
                                "shrink-0 mt-0.5",
                                insight.type === "success"
                                    ? "text-green-600"
                                    : insight.type === "warning"
                                    ? "text-orange-600"
                                    : "text-blue-600"
                            )}
                        >
                            {insight.type === "success" && (
                                <CheckCircle2 className="w-5 h-5" />
                            )}
                            {insight.type === "warning" && (
                                <AlertTriangle className="w-5 h-5" />
                            )}
                            {insight.type === "info" && (
                                <Info className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-foreground">
                                {insight.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {insight.description}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

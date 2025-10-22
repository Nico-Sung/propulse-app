"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

type Insight = {
    type: "success" | "warning" | "info";
    title: string;
    description: string;
};

export default function InsightsList({ insights }: { insights: Insight[] }) {
    if (!insights || insights.length === 0) return null;

    return (
        <Card>
            <CardHeader className="flex items-center gap-3 pb-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg text-foreground">
                    Insights actionnables
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {insights.map((insight, index) => (
                    <Alert
                        key={index}
                        variant={
                            insight.type === "warning"
                                ? "destructive"
                                : "default"
                        }
                        className={
                            insight.type === "success"
                                ? "bg-success/10 border-l-4 border-success text-foreground"
                                : insight.type === "info"
                                ? "bg-primary/10 border-l-4 border-primary text-foreground"
                                : "bg-warning/10 border-l-4 border-warning text-foreground"
                        }
                    >
                        <AlertTitle className="font-semibold text-foreground">
                            {insight.title}
                        </AlertTitle>
                        <AlertDescription className="text-sm text-muted-foreground">
                            {insight.description}
                        </AlertDescription>
                    </Alert>
                ))}
            </CardContent>
        </Card>
    );
}

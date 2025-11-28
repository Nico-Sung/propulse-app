"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
    icon: React.ElementType;
    title: string;
    value: string | number;
    color: string;
};

export default function StatCard({ icon: Icon, title, value, color }: Props) {
    const mapping: Record<string, string> = {
        primary: "bg-primary/10 text-primary",
        "primary-variant": "bg-primary/20 text-primary",
        warning: "bg-warning/10 text-warning",
        success: "bg-success/10 text-success",
    };

    return (
        <Card className="glass-card bg-transparent border-white/20 dark:border-white/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
                <div
                    className={`p-2 rounded-xl w-fit backdrop-blur-sm ${
                        mapping[color] ?? "bg-surface text-foreground"
                    }`}
                >
                    <Icon className="w-6 h-6" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground tracking-tight">
                    {value}
                </div>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {title}
                </p>
            </CardContent>
        </Card>
    );
}

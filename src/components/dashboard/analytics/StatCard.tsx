"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
    icon: any;
    title: string;
    value: string | number;
    color: string;
};

export default function StatCard({ icon: Icon, title, value, color }: Props) {
    const mapping: Record<string, string> = {
        primary: "bg-primary/10 text-primary",
        "primary-variant": "bg-primary/20 text-primary",
        warning: "bg-amber-100 text-amber-600",
        success: "bg-success/10 text-success",
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div
                    className={`p-2 rounded-lg w-fit ${
                        mapping[color] ?? "bg-surface text-foreground"
                    }`}
                >
                    <Icon className="w-6 h-6" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground">
                    {value}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{title}</p>
            </CardContent>
        </Card>
    );
}

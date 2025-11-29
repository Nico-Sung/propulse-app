"use client";

import { Progress } from "@/components/ui/progress";
import React from "react";

type Props = {
    label: string;
    value: number;
    progress: number;
    color: string;
};

interface CustomCSSProperties extends React.CSSProperties {
    "--progress-color"?: string;
}

export default function FunnelStep({ label, value, progress, color }: Props) {
    return (
        <div className="group">
            <div className="flex items-end justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {label}
                </span>
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-foreground tracking-tight">
                        {value}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                        ({Math.round(progress)}%)
                    </span>
                </div>
            </div>
            <div className="relative">
                <Progress
                    value={progress}
                    className="h-2.5 bg-secondary/50"
                    style={
                        {
                            "--progress-color": color,
                        } as CustomCSSProperties
                    }
                />
            </div>
        </div>
    );
}

"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";

type Props = {
    label: string;
    value: number;
    progress: number;
    color: string;
};

export default function FunnelStep({ label, value, progress, color }: Props) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                    {label}
                </span>
                <span className="text-sm font-bold text-foreground">
                    {value}
                </span>
            </div>
            <Progress
                value={progress}
                className="h-3"
                style={{ ["--progress-color" as any]: color } as any}
            />
        </div>
    );
}

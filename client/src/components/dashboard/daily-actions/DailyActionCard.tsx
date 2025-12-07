"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock,
    EyeOff,
} from "lucide-react";
import React, { useState } from "react";
import type { DailyAction } from "./DailyActions";

export function DailyActionCard({
    action,
    onComplete,
    onDismiss,
}: {
    action: DailyAction;
    onComplete?: (action: DailyAction) => void;
    onDismiss?: (action: DailyAction) => void;
}) {
    const [isVisible, setIsVisible] = useState(true);
    const isHighPriority = action.priority === "high";

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);

        setTimeout(() => {
            if (onDismiss) onDismiss(action);
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "glass-card group relative flex items-center gap-4 rounded-xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
                "hover:-translate-y-0.5 hover:shadow-lg",
                "border-l-4",
                action.priority === "high"
                    ? "border-l-destructive"
                    : action.priority === "medium"
                    ? "border-l-primary"
                    : "border-l-emerald-500/50"
            )}
        >
            <div
                className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md shadow-sm",
                    isHighPriority ? "text-destructive" : "text-primary"
                )}
            >
                {action.type === "deadline" && (
                    <AlertCircle className="h-5 w-5" />
                )}
                {action.type === "follow_up" && <Clock className="h-5 w-5" />}
                {action.type === "task" && <CheckCircle2 className="h-5 w-5" />}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className={cn(
                            "text-[10px] font-bold uppercase tracking-wider opacity-80",
                            isHighPriority
                                ? "text-destructive"
                                : "text-muted-foreground"
                        )}
                    >
                        {action.type === "task" && "Tâche"}
                        {action.type === "deadline" && "Date limite"}
                        {action.type === "follow_up" && "Relance"}
                    </span>
                    {isHighPriority && (
                        <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    )}
                </div>

                <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-semibold text-foreground truncate text-sm">
                        {action.description}
                    </h4>
                </div>

                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {action.application.position_title}{" "}
                    <span className="opacity-50">•</span>{" "}
                    {action.application.company_name}
                </p>
            </div>

            <div className="flex items-center gap-2">
                {action.type === "task" && onComplete && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onComplete(action)}
                        className={cn(
                            "shrink-0 rounded-full h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-all",
                            isHighPriority
                                ? "text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                : "text-muted-foreground"
                        )}
                        title="Terminer"
                    >
                        <CheckCircle2 className="h-5 w-5" />
                    </Button>
                )}

                {action.type !== "task" && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDismiss}
                        className="shrink-0 rounded-full h-8 w-8 p-0 text-muted-foreground/50 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
                        title="Masquer cette suggestion"
                    >
                        <EyeOff className="h-4 w-4" />
                    </Button>
                )}

                {action.type !== "task" && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <ArrowRight className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                )}
            </div>
        </div>
    );
}

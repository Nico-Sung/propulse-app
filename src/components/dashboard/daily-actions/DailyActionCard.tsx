import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { DailyAction } from "./DailyActions";

export function DailyActionCard({
    action,
    onComplete,
}: {
    action: DailyAction;
    onComplete?: (action: DailyAction) => void;
}) {
    const getPriorityStyle = (priority: DailyAction["priority"]) => {
        switch (priority) {
            case "high":
                return "bg-destructive/10 border border-destructive";
            case "medium":
                return "bg-primary/10 border border-primary";
            case "low":
                return "bg-accent/10 border border-accent";
            default:
                return "bg-surface border border-default";
        }
    };

    const getPriorityIcon = (priority: string) => {
        const sizeClass = "w-5 h-5";
        switch (priority) {
            case "high":
                return (
                    <AlertCircle
                        className={sizeClass}
                        style={{ color: "var(--color-destructive)" }}
                    />
                );
            case "medium":
                return (
                    <Clock
                        className={sizeClass}
                        style={{ color: "var(--color-primary)" }}
                    />
                );
            case "low":
                return (
                    <CheckCircle2
                        className={sizeClass}
                        style={{ color: "var(--color-accent)" }}
                    />
                );
            default:
                return (
                    <CheckCircle2
                        className={sizeClass}
                        style={{ color: "var(--color-muted-foreground)" }}
                    />
                );
        }
    };

    return (
        <div
            className={`rounded-lg p-4 border ${getPriorityStyle(
                action.priority
            )} hover:shadow-sm transition`}
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                    {getPriorityIcon(action.priority)}
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <span
                                className={`text-xs font-semibold uppercase tracking-wide`}
                                style={{
                                    color:
                                        action.priority === "high"
                                            ? "var(--color-destructive)"
                                            : action.priority === "medium"
                                            ? "var(--color-primary)"
                                            : "var(--color-accent)",
                                }}
                            >
                                {action.type === "task" && "Tâche"}
                                {action.type === "deadline" && "Date limite"}
                                {action.type === "follow_up" && "Relance"}
                            </span>
                        </div>
                        {action.type === "task" && onComplete && (
                            <Button
                                size="sm"
                                onClick={() => onComplete(action)}
                                aria-label={`Terminer ${action.description}`}
                            >
                                Terminer
                            </Button>
                        )}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">
                        {action.application.position_title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        {action.application.company_name}
                    </p>
                    <p className="text-sm text-foreground">
                        {action.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

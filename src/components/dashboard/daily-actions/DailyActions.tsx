"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/lib/database.types";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

type Application = Database["public"]["Tables"]["applications"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface DailyAction {
    id: string;
    type: "task" | "deadline" | "follow_up";
    priority: "high" | "medium" | "low";
    application: Application;
    task?: Task;
    description: string;
}

export default function DailyActions({
    initialActions,
}: {
    initialActions?: DailyAction[];
}) {
    const [actions, setActions] = useState<DailyAction[]>(initialActions || []);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) loadDailyActions();
        else {
            setActions([]);
            setLoading(false);
        }
    }, [user]);

    const loadDailyActions = async () => {
        setLoading(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data: apps } = await (supabase as any)
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });

        const { data: tasks } = await (supabase as any)
            .from("tasks")
            .select("*, applications(*)")
            .eq("is_completed", false);

        const actionsList: DailyAction[] = [];

        if (apps) {
            apps.forEach((app: Application) => {
                if (app.deadline) {
                    const deadlineDate = new Date(app.deadline);
                    deadlineDate.setHours(0, 0, 0, 0);
                    const daysUntilDeadline = Math.ceil(
                        (deadlineDate.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24)
                    );

                    if (daysUntilDeadline >= 0 && daysUntilDeadline <= 3) {
                        actionsList.push({
                            id: `deadline-${app.id}`,
                            type: "deadline",
                            priority:
                                daysUntilDeadline === 0
                                    ? "high"
                                    : daysUntilDeadline === 1
                                    ? "medium"
                                    : "low",
                            application: app,
                            description: `Date limite dans ${
                                daysUntilDeadline === 0
                                    ? "aujourd'hui"
                                    : `${daysUntilDeadline} jour${
                                          daysUntilDeadline > 1 ? "s" : ""
                                      }`
                            }`,
                        });
                    }
                }

                if (app.last_contact_date) {
                    const lastContact = new Date(app.last_contact_date);
                    const daysSinceContact = Math.floor(
                        (today.getTime() - lastContact.getTime()) /
                            (1000 * 60 * 60 * 24)
                    );

                    if (
                        daysSinceContact >= 7 &&
                        app.status !== "rejected" &&
                        app.status !== "offer"
                    ) {
                        actionsList.push({
                            id: `follow-up-${app.id}`,
                            type: "follow_up",
                            priority:
                                daysSinceContact >= 14 ? "high" : "medium",
                            application: app,
                            description: `Aucune nouvelle depuis ${daysSinceContact} jour${
                                daysSinceContact > 1 ? "s" : ""
                            } - Envisager une relance`,
                        });
                    }
                }
            });
        }

        if (tasks) {
            (tasks as any).forEach((task: any) => {
                if (task.applications) {
                    actionsList.push({
                        id: `task-${task.id}`,
                        type: "task",
                        priority: "medium",
                        application: task.applications as Application,
                        task: task as Task,
                        description: task.title,
                    });
                }
            });
        }

        actionsList.sort((a, b) => {
            const priorityOrder: Record<string, number> = {
                high: 0,
                medium: 1,
                low: 2,
            };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority])
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            return a.description.localeCompare(b.description);
        });

        setActions(actionsList);
        setLoading(false);
    };

    const completeTask = async (action: DailyAction) => {
        if (action.type === "task" && action.task) {
            await (supabase as any)
                .from("tasks")
                .update({
                    is_completed: true,
                    completed_at: new Date().toISOString(),
                })
                .eq("id", action.task.id);

            await (supabase as any).from("activity_history").insert({
                application_id: action.application.id,
                activity_type: "task_completed",
                description: `Tâche complétée : ${action.task.title}`,
            });

            await loadDailyActions();
        }
    };

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
        <Card>
            <CardHeader>
                <CardTitle>Actions du jour</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-28">
                        <div
                            className="animate-spin rounded-full h-8 w-8 border-b-2"
                            style={{ borderColor: "var(--color-primary)" }}
                        />
                    </div>
                ) : actions.length === 0 ? (
                    <div className="text-center py-6 bg-surface rounded-lg border-default">
                        <CheckCircle2
                            className="w-12 h-12 mx-auto mb-3"
                            style={{ color: "var(--color-primary)" }}
                        />
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            Tout est à jour !
                        </h3>
                        <p className="text-muted">
                            Aucune action urgente pour aujourd'hui
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="bg-slate-100 rounded-lg p-3 mb-4">
                            <div className=" rounded-md border-default">
                                <p className="text-sm font-medium text-foreground">
                                    {actions.length} action
                                    {actions.length > 1 ? "s" : ""} à traiter
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {actions.map((action) => (
                                <div
                                    key={action.id}
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
                                                                action.priority ===
                                                                "high"
                                                                    ? "var(--color-destructive)"
                                                                    : action.priority ===
                                                                      "medium"
                                                                    ? "var(--color-primary)"
                                                                    : "var(--color-accent)",
                                                        }}
                                                    >
                                                        {action.type ===
                                                            "task" && "Tâche"}
                                                        {action.type ===
                                                            "deadline" &&
                                                            "Date limite"}
                                                        {action.type ===
                                                            "follow_up" &&
                                                            "Relance"}
                                                    </span>
                                                </div>

                                                {action.type === "task" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            completeTask(action)
                                                        }
                                                        aria-label={`Terminer ${action.description}`}
                                                    >
                                                        Terminer
                                                    </Button>
                                                )}
                                            </div>

                                            <h4 className="font-semibold text-foreground mb-1">
                                                {
                                                    action.application
                                                        .position_title
                                                }
                                            </h4>
                                            <p className="text-sm text-muted-foreground  mb-2">
                                                {
                                                    action.application
                                                        .company_name
                                                }
                                            </p>
                                            <p className="text-sm text-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

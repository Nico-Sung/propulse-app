"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import type { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { DailyActionsHeader } from "./DailyActionsHeader";
import { DailyActionsList } from "./DailyActionsList";

type Application = Database["public"]["Tables"]["applications"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskWithApplication extends Task {
    applications: Application | null;
}

export interface DailyAction {
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

    const { showFollowUps, setShowFollowUps } = useSettings();

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

        const { data: appsData, error: appsError } = await supabase
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });

        if (appsError) {
            console.error("Error loading apps", appsError);
        }

        const apps = (appsData as Application[]) || [];

        const { data: tasksData, error: tasksError } = await supabase
            .from("tasks")
            .select("*, applications(*)")
            .eq("is_completed", false);

        if (tasksError) {
            console.error("Error loading tasks", tasksError);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tasks = (tasksData as any[] as TaskWithApplication[]) || [];

        const actionsList: DailyAction[] = [];

        if (apps) {
            apps.forEach((app) => {
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
                                daysUntilDeadline === 0 ? "high" : "medium",
                            application: app,
                            description: `Date limite : ${
                                daysUntilDeadline === 0
                                    ? "Aujourd'hui"
                                    : `Dans ${daysUntilDeadline}j`
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
                            description: `Sans nouvelle depuis ${daysSinceContact}j - Relancer ?`,
                        });
                    }
                }
            });
        }

        if (tasks) {
            tasks.forEach((task) => {
                if (task.applications) {
                    actionsList.push({
                        id: `task-${task.id}`,
                        type: "task",
                        priority: "medium",
                        application: task.applications,
                        task: task,
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
                .from("tasks")
                .update({
                    is_completed: true,
                    completed_at: new Date().toISOString(),
                })
                .eq("id", action.task.id);

            await loadDailyActions();
        }
    };

    const handleDismiss = (action: DailyAction) => {
        setActions((prev) => prev.filter((a) => a.id !== action.id));
    };

    const filteredActions = actions.filter((action) => {
        if (!showFollowUps && action.type === "follow_up") return false;
        return true;
    });

    const hiddenCount = actions.length - filteredActions.length;

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col gap-1 mb-8">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">
                    Bonjour 👋
                </h2>
                <p className="text-muted-foreground text-lg">
                    Voici votre focus pour aujourd&apos;hui.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <Spinner size={32} />
                </div>
            ) : actions.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center py-12 text-center rounded-2xl border-dashed border-2 border-muted">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                        Rien à signaler !
                    </h3>
                    <p className="text-muted-foreground max-w-sm mt-2">
                        Vous êtes à jour sur vos tâches. Profitez-en pour faire
                        une pause ou chercher de nouvelles offres.
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <DailyActionsHeader count={filteredActions.length} />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFollowUps(!showFollowUps)}
                            className={cn(
                                "text-xs font-medium gap-2 transition-all h-8",
                                !showFollowUps
                                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {!showFollowUps ? (
                                <Eye className="w-3.5 h-3.5" />
                            ) : (
                                <EyeOff className="w-3.5 h-3.5" />
                            )}
                            {!showFollowUps
                                ? "Afficher les relances"
                                : "Masquer les relances"}
                            {!showFollowUps && hiddenCount > 0 && (
                                <span className="ml-1 bg-background/50 px-1.5 py-0.5 rounded-full text-[10px] shadow-sm">
                                    +{hiddenCount}
                                </span>
                            )}
                        </Button>
                    </div>

                    <DailyActionsList
                        actions={filteredActions}
                        onComplete={completeTask}
                        onDismiss={handleDismiss}
                    />
                </>
            )}
        </div>
    );
}

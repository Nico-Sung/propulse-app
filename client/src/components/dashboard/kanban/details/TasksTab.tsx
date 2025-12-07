"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export function TasksTab({ applicationId }: { applicationId: string }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const loadTasks = useCallback(async () => {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
            .from("tasks")
            .select("*")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: true });
        if (data) setTasks(data as Task[]);
        setLoading(false);
    }, [applicationId]);

    useEffect(() => {
        if (applicationId) loadTasks();
    }, [applicationId, loadTasks]);

    const addTask = async () => {
        if (!newTaskTitle.trim()) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from("tasks").insert({
            application_id: applicationId,
            title: newTaskTitle.trim(),
            is_completed: false,
        });
        if (!error) {
            setNewTaskTitle("");
            await loadTasks();
        }
    };

    const toggleTask = async (task: Task) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("tasks")
            .update({ is_completed: !task.is_completed })
            .eq("id", task.id);
        if (!error) await loadTasks();
    };

    const deleteTask = async (taskId: string) => {
        if (!confirm("Supprimer cette tâche ?")) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("tasks")
            .delete()
            .eq("id", taskId);
        if (!error) await loadTasks();
    };

    const progress =
        tasks.length === 0
            ? 0
            : Math.round(
                  (tasks.filter((t) => t.is_completed).length / tasks.length) *
                      100
              );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative h-4 w-full rounded-full bg-black/5 dark:bg-white/5 overflow-hidden backdrop-blur-sm border border-black/5 dark:border-white/5">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)] relative"
                    style={{ width: `${progress}%` }}
                >
                    {progress > 10 && (
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-primary-foreground px-1 leading-none">
                            {progress}%
                        </div>
                    )}
                </div>
                {progress <= 10 && progress > 0 && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-foreground px-1 leading-none ml-[calc(10%+4px)]">
                        {progress}%
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {loading && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Chargement...
                    </p>
                )}
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={cn(
                            "group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                            "bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-sm",
                            "hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5",
                            task.is_completed &&
                                "opacity-60 bg-transparent border-transparent shadow-none"
                        )}
                    >
                        <button
                            onClick={() => toggleTask(task)}
                            className={cn(
                                "flex-shrink-0 transition-colors duration-300",
                                task.is_completed
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            {task.is_completed ? (
                                <CheckCircle2 className="w-6 h-6" />
                            ) : (
                                <Circle className="w-6 h-6" />
                            )}
                        </button>

                        <span
                            className={cn(
                                "flex-1 font-medium transition-all duration-300",
                                task.is_completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                            )}
                        >
                            {task.title}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                <div className="flex gap-2 pt-2">
                    <Input
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Ajouter une nouvelle tâche..."
                        className="bg-white/30 dark:bg-black/10 border-black/5 dark:border-white/10 backdrop-blur-sm rounded-full px-4 h-11 focus-visible:ring-primary/50 shadow-sm"
                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                    />
                    <Button
                        onClick={addTask}
                        disabled={!newTaskTitle.trim()}
                        size="icon"
                        className="rounded-full h-11 w-11 shrink-0 bg-primary hover:bg-primary/90 shadow-md text-primary-foreground"
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

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
        <div className="space-y-6">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                    className="h-2 bg-primary"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="space-y-2">
                {loading && (
                    <p className="text-sm text-foreground">Chargement...</p>
                )}
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-surface rounded-lg"
                    >
                        <input
                            type="checkbox"
                            checked={!!task.is_completed}
                            onChange={() => toggleTask(task)}
                        />
                        <span
                            className={`flex-1 ${
                                task.is_completed
                                    ? "line-through text-muted"
                                    : "text-foreground"
                            }`}
                        >
                            {task.title}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                        >
                            <Trash2 className="h-4 w-4 text-muted" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Nouvelle tâche..."
                />
                <Button onClick={addTask} disabled={!newTaskTitle.trim()}>
                    <Plus />
                </Button>
            </div>
        </div>
    );
}

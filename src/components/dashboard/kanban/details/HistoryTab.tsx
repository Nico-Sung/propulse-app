"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import {
    Calendar,
    CheckSquare,
    Clock,
    FileText,
    Loader2,
    Send,
    Upload,
    UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Activity = Database["public"]["Tables"]["activity_history"]["Row"];

interface ActivityHistorySectionProps {
    applicationId: string;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const activityConfig: Record<string, { Icon: any; className: string }> = {
    status_change: { Icon: Clock, className: "bg-blue-500/10 text-blue-500" },
    note: { Icon: FileText, className: "bg-gray-500/10 text-gray-500" },
    task_completed: {
        Icon: CheckSquare,
        className: "bg-green-500/10 text-green-500",
    },
    document_added: {
        Icon: Upload,
        className: "bg-purple-500/10 text-purple-500",
    },
    contact_added: {
        Icon: UserPlus,
        className: "bg-orange-500/10 text-orange-500",
    },
    interview_scheduled: {
        Icon: Calendar,
        className: "bg-pink-500/10 text-pink-500",
    },
};

export function HistoryTab({ applicationId }: ActivityHistorySectionProps) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newNote, setNewNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAddingNote, setIsAddingNote] = useState(false);

    const loadActivities = useCallback(async () => {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
            .from("activity_history")
            .select("*")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false });
        if (data) setActivities(data as Activity[]);
        setLoading(false);
    }, [applicationId]);

    useEffect(() => {
        if (applicationId) loadActivities();
    }, [applicationId, loadActivities]);

    const addNote = async () => {
        if (!newNote.trim()) return;
        setIsAddingNote(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("activity_history")
            .insert({
                application_id: applicationId,
                activity_type: "note",
                description: newNote,
            });
        if (!error) {
            setNewNote("");
            await loadActivities();
        }
        setIsAddingNote(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-3 items-end bg-white/40 dark:bg-white/5 border border-white/20 p-2 rounded-3xl backdrop-blur-md shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ajouter une note rapide..."
                    rows={1}
                    className="min-h-[40px] max-h-[120px] bg-transparent border-none shadow-none resize-none focus-visible:ring-0 py-3 px-4"
                />
                <Button
                    onClick={addNote}
                    disabled={isAddingNote || !newNote.trim()}
                    size="icon"
                    className="rounded-full h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 mb-0.5 mr-0.5"
                >
                    {isAddingNote ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4 ml-0.5" />
                    )}
                </Button>
            </div>

            <div className="relative space-y-6 pl-4 before:absolute before:left-[27px] before:top-2 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-border before:to-transparent">
                {loading && (
                    <p className="text-center text-muted-foreground py-4">
                        Chargement...
                    </p>
                )}

                {!loading && activities.length === 0 && (
                    <p className="text-center text-muted-foreground py-8 italic opacity-50">
                        Aucune activité enregistrée.
                    </p>
                )}

                {!loading &&
                    activities.map((activity) => {
                        const config = activityConfig[
                            activity.activity_type
                        ] || {
                            Icon: FileText,
                            className: "bg-slate-100 text-slate-600",
                        };
                        const Icon = config.Icon;

                        return (
                            <div
                                key={activity.id}
                                className="relative flex gap-4 items-start group"
                            >
                                <div
                                    className={cn(
                                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background shadow-sm",
                                        config.className
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>

                                <div className="flex-1 pt-1.5">
                                    <div className="bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-xl p-3 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                                        <p className="text-sm text-foreground/90 leading-relaxed">
                                            {activity.description}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-2 font-medium uppercase tracking-wide opacity-70">
                                            {new Date(
                                                activity.created_at
                                            ).toLocaleString("fr-FR", {
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Clock,
    FileText,
    CheckSquare,
    Upload,
    UserPlus,
    Calendar,
    Loader2,
} from "lucide-react";

type Activity = Database["public"]["Tables"]["activity_history"]["Row"];

interface ActivityHistorySectionProps {
    applicationId: string;
}

const activityConfig: Record<string, { Icon: any; className: string }> = {
    status_change: { Icon: Clock, className: "bg-blue-100 text-blue-600" },
    note: { Icon: FileText, className: "bg-slate-100 text-slate-600" },
    task_completed: {
        Icon: CheckSquare,
        className: "bg-teal-100 text-teal-600",
    },
    document_added: {
        Icon: Upload,
        className: "bg-purple-100 text-purple-600",
    },
    contact_added: { Icon: UserPlus, className: "bg-amber-100 text-amber-600" },
    interview_scheduled: {
        Icon: Calendar,
        className: "bg-green-100 text-green-600",
    },
};

export function HistoryTab({ applicationId }: ActivityHistorySectionProps) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newNote, setNewNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAddingNote, setIsAddingNote] = useState(false);

    useEffect(() => {
        if (applicationId) loadActivities();
    }, [applicationId]);

    const loadActivities = async () => {
        setLoading(true);
        const { data } = await (supabase as any)
            .from("activity_history")
            .select("*")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false });
        if (data) setActivities(data as Activity[]);
        setLoading(false);
    };

    const addNote = async () => {
        if (!newNote.trim()) return;
        setIsAddingNote(true);
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
        <div className="space-y-6">
            <div className="space-y-2">
                <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ajouter une note..."
                    rows={3}
                />
                <Button
                    onClick={addNote}
                    disabled={isAddingNote || !newNote.trim()}
                    className="w-full"
                >
                    {isAddingNote && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Ajouter une note
                </Button>
            </div>

            <div className="space-y-4">
                {loading && (
                    <p className="text-center text-slate-500">
                        Chargement de l'historique...
                    </p>
                )}
                {!loading && activities.length === 0 && (
                    <p className="text-center text-slate-500 py-8">
                        Aucun historique pour le moment.
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
                                className="flex gap-3 items-start"
                            >
                                <Avatar>
                                    <AvatarFallback
                                        className={config.className}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-slate-50 rounded-lg p-3 border">
                                    <p className="text-sm text-slate-900">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(
                                            activity.created_at
                                        ).toLocaleString("fr-FR", {
                                            dateStyle: "long",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

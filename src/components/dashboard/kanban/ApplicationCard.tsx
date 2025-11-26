"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, CalendarClock, Building2 } from "lucide-react";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export function ApplicationCard({
    application,
    onCardClick,
}: {
    application: Application;
    onCardClick: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: application.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const [showDialog, setShowDialog] = useState(false);

    const openDialog = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowDialog(true);
    };

    const handleDelete = async (applicationId: string) => {
        const { error } = await (supabase as any)
            .from("applications")
            .delete()
            .eq("id", applicationId);
        if (error) {
            console.error("Erreur suppression application:", error);
            return false;
        }
        return window.location.reload();
    };

    const getDeadlineText = () => {
        if (!application.deadline) return null;
        const diff =
            new Date(application.deadline).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        if (days < 0) return "Expiré";
        if (days === 0) return "Aujourd'hui";
        return `${days}j restants`;
    };

    const deadlineText = getDeadlineText();

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="touch-none"
        >
            <div
                className={cn(
                    "group relative flex flex-col gap-3 rounded-xl p-4 transition-all duration-200",
                    "bg-card border border-border/60 shadow-sm",
                    "hover:shadow-md hover:border-primary/30 hover:-translate-y-1 cursor-grab active:cursor-grabbing",
                    isDragging &&
                        "shadow-xl scale-105 ring-2 ring-primary rotate-2 z-50 cursor-grabbing"
                )}
                onClick={onCardClick}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Building2 className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {application.contract_type || "Contrat"}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => openDialog(e)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>

                <div>
                    <h3 className="font-bold text-base text-foreground leading-tight mb-1">
                        {application.position_title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                        {application.company_name}
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {deadlineText && (
                        <Badge
                            variant="secondary"
                            className={cn(
                                "text-[10px] px-1.5 h-5 font-medium gap-1",
                                deadlineText === "Expiré"
                                    ? "bg-destructive/10 text-destructive"
                                    : deadlineText === "Aujourd'hui"
                                    ? "bg-warning/10 text-warning"
                                    : "bg-secondary text-secondary-foreground"
                            )}
                        >
                            <CalendarClock className="w-3 h-3" />
                            {deadlineText}
                        </Badge>
                    )}

                    {application.salary_range && (
                        <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 h-5 border-border text-muted-foreground font-normal"
                        >
                            {application.salary_range}
                        </Badge>
                    )}
                </div>
            </div>

            <ConfirmationDialog
                title="Supprimer la candidature ?"
                description="Cette action est irréversible."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                open={showDialog}
                onOpenChange={setShowDialog}
                onConfirm={async () => {
                    const ok = await handleDelete(application.id);
                    if (ok) setShowDialog(false);
                }}
            />
        </div>
    );
}

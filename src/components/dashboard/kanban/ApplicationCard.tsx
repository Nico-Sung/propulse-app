"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { useState } from "react";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export function ApplicationCard({
    application,
    onCardClick,
}: {
    application: Application;
    onCardClick: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: application.id });
    const style = { transform: CSS.Transform.toString(transform), transition };
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

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                className="hover:shadow-md cursor-grab active:cursor-grabbing group"
                onClick={onCardClick}
            >
                <CardHeader className="p-4 relative">
                    <CardTitle className="text-base">
                        {application.position_title}
                    </CardTitle>
                    <CardDescription>
                        {application.company_name}
                    </CardDescription>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                        onClick={(e) => openDialog(e)}
                    >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                </CardHeader>
            </Card>
            <ConfirmationDialog
                title="Confirmer la suppression"
                description="Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible."
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

"use client";

import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useKanbanTags } from "@/hooks/useKanbanTags";
import { Database } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import { CardContextMenuContentWrapper, CardDropdownMenu } from "./CardMenus";
import { CardFooter, CardHeader, CardMainInfo, CardTags } from "./CardVisuals";
import { useApplicationActions } from "./useApplicationActions";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export function ApplicationCard({
    application,
    onCardClick,
    compact = false,
    tagsData,
}: {
    application: Application;
    onCardClick: () => void;
    compact?: boolean;
    tagsData: ReturnType<typeof useKanbanTags>;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: application.id });

    const actions = useApplicationActions(application);
    const { getAppTags } = tagsData;
    const appTags = getAppTags(application.id);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const menuProps = {
        applicationId: application.id,
        status: application.status,
        jobUrl: application.job_url,
        onCardClick,
        actions,
        tagsData,
        openDeleteDialog: () => setShowDeleteDialog(true),
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="touch-none"
            >
                <ContextMenu>
                    <ContextMenuTrigger>
                        <div
                            className={cn(
                                "group relative flex flex-col gap-2 rounded-xl transition-all duration-300 glass-card",
                                isDragging &&
                                    "shadow-2xl scale-105 ring-2 ring-primary/50 rotate-2 z-50 cursor-grabbing bg-white/90 dark:bg-black/80",
                                compact ? "p-3" : "p-4"
                            )}
                            onClick={onCardClick}
                        >
                            <CardTags tags={appTags} compact={compact} />

                            <CardHeader
                                companyName={application.company_name}
                                compact={compact}
                                menu={<CardDropdownMenu {...menuProps} />}
                            />

                            <CardMainInfo
                                title={application.position_title}
                                contract={application.contract_type}
                                compact={compact}
                            />

                            <CardFooter
                                deadline={application.deadline}
                                salaryRange={application.salary_range}
                                compact={compact}
                            />
                        </div>
                    </ContextMenuTrigger>

                    <CardContextMenuContentWrapper {...menuProps} />
                </ContextMenu>
            </div>

            <ConfirmationDialog
                title="Supprimer la candidature ?"
                description="Cette action est irréversible."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={async () => {
                    await actions.handleDelete();
                }}
            />
        </>
    );
}

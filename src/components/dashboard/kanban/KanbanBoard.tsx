"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/database.types";
import { ApplicationCard } from "./ApplicationCard";
import { EditApplicationSheet } from "./EditApplicationModal";
import { AddApplicationDialog } from "./AddApplicationDialog";
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    UniqueIdentifier,
} from "@dnd-kit/core";
import {
    SortableContext,
    rectSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

type Application = Database["public"]["Tables"]["applications"]["Row"];

const COLUMNS = [
    { id: "to_apply", label: "À postuler", color: "bg-slate-100" },
    { id: "applied", label: "Candidature envoyée", color: "bg-blue-50" },
    { id: "waiting", label: "En attente", color: "bg-amber-50" },
    { id: "interview", label: "Processus d'entretien", color: "bg-teal-50" },
    { id: "offer", label: "Offre reçue", color: "bg-green-50" },
    { id: "rejected", label: "Refusée", color: "bg-slate-100" },
] as const;

export default function KanbanBoard({
    initialApplications,
}: {
    initialApplications?: Application[];
}) {
    const [applications, setApplications] = useState<Application[]>(
        initialApplications || []
    );
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    useEffect(() => {
        if (user) loadApplications();
    }, [user]);

    const loadApplications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error && data) setApplications(data as Application[]);
        setLoading(false);
    };

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const itemsByColumn = useMemo(() => {
        const map: Record<string, UniqueIdentifier[]> = {};
        COLUMNS.forEach((c) => (map[c.id] = []));
        applications.forEach((a) => {
            if (map[a.status]) map[a.status].push(a.id as UniqueIdentifier);
        });
        return map;
    }, [applications]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as UniqueIdentifier);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const columnIds = COLUMNS.map((c) => c.id as string);
        let newStatus: Application["status"] | null = null;

        if (columnIds.includes(overId)) {
            newStatus = overId as Application["status"];
        } else {
            const overApp = applications.find((a) => a.id === overId);
            if (overApp) newStatus = overApp.status;
        }

        if (!newStatus) return;

        const prevApp = applications.find((a) => a.id === activeId);
        if (!prevApp) return;
        if (prevApp.status === newStatus) return;

        setApplications((prev) => {
            const without = prev.filter((p) => p.id !== activeId);
            const moved = {
                ...prev.find((p) => p.id === activeId)!,
                status: newStatus,
                updated_at: new Date().toISOString(),
            } as Application;
            return [moved, ...without];
        });

        const { error } = await (supabase as any)
            .from("applications")
            .update({
                status: newStatus as Application["status"],
                updated_at: new Date().toISOString(),
                ...(newStatus === "applied" && {
                    application_date: new Date().toISOString(),
                }),
                ...(newStatus !== "to_apply" && {
                    last_contact_date: new Date().toISOString(),
                }),
            })
            .eq("id", activeId);

        if (!error) {
            await (supabase as any).from("activity_history").insert({
                application_id: activeId,
                activity_type: "status_change",
                description: `Statut changé vers : ${
                    COLUMNS.find((c) => c.id === newStatus)?.label
                }`,
            });
        } else {
            await loadApplications();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    const activeApplication = applications.find(
        (a) => String(a.id) === String(activeId)
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-x-auto p-6">
                    <div className="flex gap-4 min-w-max h-full">
                        {COLUMNS.map((column) => {
                            const columnApps = applications.filter(
                                (app) => app.status === column.id
                            );
                            return (
                                <Column
                                    key={column.id}
                                    column={column}
                                    items={itemsByColumn[column.id]}
                                >
                                    <SortableContext
                                        items={itemsByColumn[column.id] || []}
                                        strategy={rectSortingStrategy}
                                    >
                                        <div
                                            className={`flex-1 ${column.color} rounded-lg p-3 space-y-3 min-h-[200px]`}
                                        >
                                            {columnApps.map((app) => (
                                                <ApplicationCard
                                                    key={app.id}
                                                    application={app}
                                                    onCardClick={() => {
                                                        setSelectedApplication(
                                                            app
                                                        );
                                                        setIsSheetOpen(true);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </Column>
                            );
                        })}
                    </div>
                </div>

                <AddApplicationDialog />
                <EditApplicationSheet
                    application={selectedApplication}
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                    onUpdate={async () => {
                        await loadApplications();
                    }}
                />
                <DragOverlay>
                    {activeApplication ? (
                        <OverlayCard application={activeApplication} />
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}

function Column({
    column,
    items,
    children,
}: {
    column: (typeof COLUMNS)[number];
    items?: UniqueIdentifier[];
    children: React.ReactNode;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });
    return (
        <div ref={setNodeRef} className="flex-shrink-0 w-80 flex flex-col">
            <div className="bg-surface rounded-lg shadow-sm border border-default p-4 mb-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                        {column.label}
                    </h3>
                    <span className="bg-muted text-foreground text-xs font-semibold px-2 py-1 rounded-full">
                        {items?.length || 0}
                    </span>
                </div>
            </div>

            <div
                className={`flex-1 ${
                    column.color
                } rounded-lg p-3 space-y-3 min-h-[200px] ${
                    isOver ? "ring-2 ring-teal-300" : ""
                }`}
            >
                {children}
            </div>
        </div>
    );
}

function OverlayCard({ application }: { application: Application }) {
    return (
        <div className="w-80">
            <div className="bg-surface rounded-lg shadow-md border border-default p-4">
                <div>
                    <div className="font-semibold text-base">
                        {application.position_title}
                    </div>
                    <div className="text-sm text-muted">
                        {application.company_name}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/database.types";
import { EditApplicationSheet } from "./modal/EditApplicationModal";
import { AddApplicationDialog } from "./modal/AddApplicationModal";
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
import { KanbanColumn, SortOption, ViewMode } from "./KanbanColumn";
import Spinner from "@/components/ui/Spinner";
import { OverlayCard } from "@/components/design-system/overlay-card";

type Application = Database["public"]["Tables"]["applications"]["Row"];

const COLUMNS = [
    { id: "to_apply", label: "À postuler", color: "bg-primary/10" },
    { id: "applied", label: "Candidature envoyée", color: "bg-primary/10" },
    { id: "waiting", label: "En attente", color: "bg-warning/10" },
    { id: "interview", label: "Processus d'entretien", color: "bg-primary/10" },
    { id: "offer", label: "Offre reçue", color: "bg-success/10" },
    { id: "rejected", label: "Refusée", color: "bg-destructive/10" },
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

    const [sortOption, setSortOption] = useState<SortOption>("date_desc");
    const [viewMode, setViewMode] = useState<ViewMode>("normal");

    useEffect(() => {
        const savedSort = localStorage.getItem("kanban_sort");
        const savedView = localStorage.getItem("kanban_view");
        if (savedSort) setSortOption(savedSort as SortOption);
        if (savedView) setViewMode(savedView as ViewMode);
    }, []);

    const handleSortChange = (option: SortOption) => {
        setSortOption(option);
        localStorage.setItem("kanban_sort", option);
    };

    const handleViewChange = (mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem("kanban_view", mode);
    };

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

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState<string>("to_apply");

    const handleOpenAddModal = (status: string) => {
        setDefaultStatus(status);
        setIsAddModalOpen(true);
    };

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
                <Spinner size={48} />
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
            <div className=" flex flex-col ">
                <div className="flex-1 overflow-x-auto p-6">
                    <div className="flex gap-4 min-w-max">
                        {COLUMNS.map((column) => {
                            const columnApps = applications.filter(
                                (app) => app.status === column.id
                            );
                            return (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    applications={columnApps}
                                    sortOption={sortOption}
                                    onSortChange={handleSortChange}
                                    viewMode={viewMode}
                                    onViewModeChange={handleViewChange}
                                    onCardClick={(app) => {
                                        setSelectedApplication(app);
                                        setIsSheetOpen(true);
                                    }}
                                    onAddApplication={() =>
                                        handleOpenAddModal(column.id)
                                    }
                                />
                            );
                        })}
                    </div>
                </div>

                <AddApplicationDialog
                    open={isAddModalOpen}
                    setOpen={setIsAddModalOpen}
                    defaultStatus={defaultStatus}
                />

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
                        <OverlayCard
                            title={activeApplication.position_title}
                            subtitle={activeApplication.company_name}
                            widthClass="w-80"
                        />
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}

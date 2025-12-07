"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { Database } from "@/lib/database.types";
import { COLUMNS } from "@/lib/kanban-utils";
import { supabase } from "@/lib/supabaseClient";
import {
    DragEndEvent,
    DragStartEvent,
    PointerSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export function useKanbanBoard(initialApplications: Application[] = []) {
    const { user } = useAuth();
    const { kanbanSort } = useSettings();

    const [applications, setApplications] =
        useState<Application[]>(initialApplications);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState<string>("to_apply");

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
            .order("position", { ascending: true })
            .order("created_at", { ascending: false });

        if (!error && data) setApplications(data as Application[]);
        setLoading(false);
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

        const activeApp = applications.find((a) => a.id === activeId);
        const overApp = applications.find((a) => a.id === overId);

        if (!activeApp) return;

        if (
            activeApp &&
            overApp &&
            activeApp.status === overApp.status &&
            activeId !== overId
        ) {
            if (kanbanSort !== "manual") {
                toast.info("Passez en tri 'Manuel' pour réorganiser l'ordre.");
                return;
            }

            const currentColumnStatus = activeApp.status;
            const columnApps = applications
                .filter((a) => a.status === currentColumnStatus)
                .sort((a, b) => (a.position || 0) - (b.position || 0));

            const oldIndex = columnApps.findIndex((a) => a.id === activeId);
            const newIndex = columnApps.findIndex((a) => a.id === overId);

            const reorderedColumnApps = arrayMove(
                columnApps,
                oldIndex,
                newIndex
            );

            const updatedColumnApps = reorderedColumnApps.map((app, index) => ({
                ...app,
                position: index,
                updated_at: new Date().toISOString(),
            }));

            setApplications((prev) => {
                const newApps = [...prev];
                updatedColumnApps.forEach((updatedApp) => {
                    const idx = newApps.findIndex(
                        (a) => a.id === updatedApp.id
                    );
                    if (idx !== -1) newApps[idx] = updatedApp;
                });
                return newApps;
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
                .from("applications")
                .upsert(updatedColumnApps, { onConflict: "id" });
            return;
        }

        const columnIds = COLUMNS.map((c) => c.id as string);
        let newStatus: Application["status"] | null = null;

        if (columnIds.includes(overId)) {
            newStatus = overId as Application["status"];
        } else if (overApp) {
            newStatus = overApp.status;
        }

        if (!newStatus || newStatus === activeApp.status) return;

        setApplications((prev) =>
            prev.map((app) =>
                app.id === activeId
                    ? {
                          ...app,
                          status: newStatus!,
                          position: 0,
                          updated_at: new Date().toISOString(),
                      }
                    : app
            )
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("applications")
            .update({
                status: newStatus,
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any).from("activity_history").insert({
                application_id: activeId,
                activity_type: "status_change",
                description: `Statut changé vers : ${
                    COLUMNS.find((c) => c.id === newStatus)?.label
                }`,
            });
        } else {
            await loadApplications();
            toast.error("Erreur lors du déplacement");
        }
    };

    const handleOpenAddModal = (status: string) => {
        setDefaultStatus(status);
        setIsAddModalOpen(true);
    };

    const handleCardClick = (app: Application) => {
        setSelectedApplication(app);
        setIsSheetOpen(true);
    };

    return {
        applications,
        loading,
        activeId,
        sensors,
        handleDragStart,
        handleDragEnd,
        loadApplications,
        modals: {
            isSheetOpen,
            setIsSheetOpen,
            isAddModalOpen,
            setIsAddModalOpen,
            selectedApplication,
            defaultStatus,
            handleOpenAddModal,
            handleCardClick,
        },
    };
}

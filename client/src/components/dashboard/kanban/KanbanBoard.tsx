"use client";

import { OverlayCard } from "@/components/design-system/overlay-card";
import Spinner from "@/components/ui/Spinner";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import { useKanbanTags } from "@/hooks/useKanbanTags";
import { useSettings } from "@/hooks/useSettings";
import { Database } from "@/lib/database.types";
import { COLUMNS, SortOption } from "@/lib/kanban-utils";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { AddApplicationDialog } from "./modal/AddApplicationModal";
import { EditApplicationSheet } from "./modal/EditApplicationModal";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export default function KanbanBoard({
    initialApplications,
}: {
    initialApplications?: Application[];
}) {
    const {
        applications,
        loading,
        activeId,
        sensors,
        handleDragStart,
        handleDragEnd,
        loadApplications,
        modals,
    } = useKanbanBoard(initialApplications);

    const tagsData = useKanbanTags();
    const { viewMode, setViewMode, kanbanSort, setKanbanSort } = useSettings();

    const activeApplication = applications.find(
        (a) => String(a.id) === String(activeId)
    );

    if (loading && applications.length === 0) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <Spinner size={48} />
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-x-auto pb-4 no-scrollbar">
                    <div className="flex gap-6 min-w-max px-4 h-full">
                        {COLUMNS.map((column) => {
                            const columnApps = applications.filter(
                                (app) => app.status === column.id
                            );

                            return (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    applications={columnApps}
                                    sortOption={
                                        (kanbanSort as SortOption) ||
                                        "date_desc"
                                    }
                                    onSortChange={(val) => setKanbanSort(val)}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    onCardClick={modals.handleCardClick}
                                    onAddApplication={() =>
                                        modals.handleOpenAddModal(column.id)
                                    }
                                    tagsData={tagsData}
                                />
                            );
                        })}
                    </div>
                </div>

                <AddApplicationDialog
                    open={modals.isAddModalOpen}
                    setOpen={modals.setIsAddModalOpen}
                    defaultStatus={modals.defaultStatus}
                />

                <EditApplicationSheet
                    application={modals.selectedApplication}
                    isOpen={modals.isSheetOpen}
                    onClose={() => modals.setIsSheetOpen(false)}
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

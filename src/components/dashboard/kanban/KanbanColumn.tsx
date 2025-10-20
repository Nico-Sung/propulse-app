import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";

interface Props {
    column: (typeof COLUMNS)[number];
    items?: UniqueIdentifier[];
    children: React.ReactNode;
}

const COLUMNS = [
    { id: "to_apply", label: "À postuler", color: "bg-slate-100" },
    { id: "applied", label: "Candidature envoyée", color: "bg-blue-50" },
    { id: "waiting", label: "En attente", color: "bg-amber-50" },
    { id: "interview", label: "Processus d'entretien", color: "bg-teal-50" },
    { id: "offer", label: "Offre reçue", color: "bg-green-50" },
    { id: "rejected", label: "Refusée", color: "bg-slate-100" },
] as const;

export function KanbanColumn({
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
        <div ref={setNodeRef} className=" w-80 flex flex-col  min-h-screen ">
            <div className="bg-surface rounded-lg shadow-sm border border-default p-4 mb-3 ">
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
                } rounded-lg p-3 space-y-3  min-h-screen  ${
                    isOver ? "ring-2 ring-teal-300" : ""
                }`}
            >
                {children}
            </div>
        </div>
    );
}

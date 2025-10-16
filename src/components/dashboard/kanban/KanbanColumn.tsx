import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";

interface Props {
    id: string;
    title: string;
    count: number;
    children: React.ReactNode;
}

export function KanbanColumn({ id, title, count, children }: Props) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex-shrink-0 w-80 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm border p-3 mb-3 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">{title}</h3>
                <Badge variant="secondary">{count}</Badge>
            </div>
            <div
                ref={setNodeRef}
                className="bg-slate-100 rounded-lg p-3 space-y-3 flex-1 min-h-[200px]"
            >
                {children}
            </div>
        </div>
    );
}

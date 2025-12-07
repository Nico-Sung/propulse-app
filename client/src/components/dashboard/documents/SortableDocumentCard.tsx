"use client";

import { Database } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DocumentCard } from "./DocumentCard";

type Document = Database["public"]["Tables"]["documents"]["Row"];

interface SortableDocumentCardProps {
    doc: Document;
    onPreview: () => void;
    onDelete?: () => void;
    onUnlink?: () => void;
}

export function SortableDocumentCard({
    doc,
    onPreview,
    onDelete,
    onUnlink,
}: SortableDocumentCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: doc.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: "none",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn("h-full touch-none", isDragging && "z-50 relative")}
        >
            <DocumentCard
                doc={doc}
                onPreview={onPreview}
                onDelete={onDelete}
                onUnlink={onUnlink}
            />
        </div>
    );
}

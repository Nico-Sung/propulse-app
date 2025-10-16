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
import { toast } from "sonner";
import { Database } from "@/lib/database.types";

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
                    >
                        <Trash2 className="h-4 w-4 text-slate-500 hover:text-destructive" />
                    </Button>
                </CardHeader>
            </Card>
        </div>
    );
}

"use client";

import KanbanBoard from "@/components/dashboard/kanban/KanbanBoard";
import { Database } from "@/lib/database.types";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export default function KanbanView({
    initialApplications,
}: {
    initialApplications?: Application[];
}) {
    return (
        <div className="w-full min-h-screen">
            <KanbanBoard initialApplications={initialApplications} />
        </div>
    );
}

"use client";

import React from "react";
import KanbanBoard from "@/components/dashboard/kanban/KanbanBoard";

export default function KanbanView({
    initialApplications,
}: {
    initialApplications?: any[];
}) {
    return (
        <div className="w-full min-h-screen">
            <KanbanBoard initialApplications={initialApplications} />
        </div>
    );
}

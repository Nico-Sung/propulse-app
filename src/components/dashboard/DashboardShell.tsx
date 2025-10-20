"use client";

import React from "react";
import KanbanView from "@/components/views/KanbanView";
import DailyActions from "./DailyActions";
import { useDashboardTab } from "@/contexts/DashboardTabContext";

export default function DashboardShell({
    initialApplications,
}: {
    initialApplications?: any[];
}) {
    const { tab } = useDashboardTab();

    return (
        <div className="min-h-screen">
            <main className="p-6 min-h-screen">
                {tab === "dashboard" && (
                    <div className="w-full min-h-screen">
                        <KanbanView initialApplications={initialApplications} />
                    </div>
                )}

                {tab === "actions" && (
                    <div>
                        <h2 className="text-lg font-semibold">
                            Actions du jour
                        </h2>
                        <DailyActions />
                    </div>
                )}

                {tab === "calendar" && (
                    <div>
                        <h2>Calendrier (placeholder)</h2>
                    </div>
                )}

                {tab === "analytics" && (
                    <div>
                        <h2>Analyse (placeholder)</h2>
                    </div>
                )}
            </main>
        </div>
    );
}

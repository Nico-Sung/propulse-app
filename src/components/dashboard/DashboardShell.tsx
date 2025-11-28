"use client";

import React from "react";
import KanbanView from "@/components/views/KanbanView";
import { useDashboardTab } from "@/contexts/DashboardTabContext";
import DailyActionsView from "../views/DailyActionsView";
import CalendarView from "../views/CalendarView";
import AnalyticsView from "../views/AnalyticsView";
import DocumentsView from "../views/DocumentView";

export default function DashboardShell({
    initialApplications,
    initialActions,
}: {
    initialApplications?: any[];
    initialActions?: any[];
}) {
    const { tab } = useDashboardTab();

    return (
        <div className="">
            <main className="min-h-screen">
                {tab === "dashboard" && (
                    <div className="w-full min-h-screen p-6">
                        <KanbanView initialApplications={initialApplications} />
                    </div>
                )}

                {tab === "actions" && (
                    <div className="p-6">
                        <DailyActionsView initialActions={initialActions} />
                    </div>
                )}

                {tab === "calendar" && (
                    <div className="p-6">
                        <CalendarView />
                    </div>
                )}

                {tab === "documents" && (
                    <div className="w-full">
                        <DocumentsView />
                    </div>
                )}

                {tab === "analytics" && (
                    <div className="p-6">
                        <AnalyticsView />
                    </div>
                )}
            </main>
        </div>
    );
}

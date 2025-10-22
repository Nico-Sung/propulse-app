"use client";

import React from "react";
import KanbanView from "@/components/views/KanbanView";
import { useDashboardTab } from "@/contexts/DashboardTabContext";
import DailyActionsView from "../views/DailyActionsView";
import CalendarView from "../views/CalendarView";
import AnalyticsView from "../views/AnalyticsView";

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
            <main className="p-6 min-h-screen">
                {tab === "dashboard" && (
                    <div className="w-full min-h-screen">
                        <KanbanView initialApplications={initialApplications} />
                    </div>
                )}

                {tab === "actions" && (
                    <div>
                        <DailyActionsView initialActions={initialActions} />
                    </div>
                )}

                {tab === "calendar" && (
                    <div>
                        <CalendarView />
                    </div>
                )}

                {tab === "analytics" && (
                    <div>
                        <AnalyticsView />
                    </div>
                )}
            </main>
        </div>
    );
}

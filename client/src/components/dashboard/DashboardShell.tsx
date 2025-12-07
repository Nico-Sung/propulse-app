"use client";

import KanbanView from "@/components/views/KanbanView";
import { useDashboardTab } from "@/contexts/DashboardTabContext";
import { Database } from "@/lib/database.types";
import AnalyticsView from "../views/AnalyticsView";
import CalendarView from "../views/CalendarView";
import DailyActionsView from "../views/DailyActionsView";
import DocumentsView from "../views/DocumentView";
import TemplatesView from "../views/TemplatesView";
import { DailyAction } from "./daily-actions/DailyActions";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export default function DashboardShell({
    initialApplications,
    initialActions,
}: {
    initialApplications?: Application[];
    initialActions?: DailyAction[];
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

                {tab === "templates" && (
                    <div className="w-full">
                        <TemplatesView />
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

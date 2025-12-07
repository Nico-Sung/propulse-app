"use client";

import React from "react";
import DailyActions, {
    DailyAction,
} from "../dashboard/daily-actions/DailyActions";

export default function DailyActionsView({
    initialActions,
}: {
    initialActions?: DailyAction[];
}) {
    return (
        <div className="w-full min-h-screen">
            <DailyActions initialActions={initialActions} />
        </div>
    );
}

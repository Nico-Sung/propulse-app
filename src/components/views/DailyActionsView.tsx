"use client";

import React from "react";
import DailyActions from "../dashboard/daily-actions/DailyActions";

export default function DailyActionsView({
    initialActions,
}: {
    initialActions?: any[];
}) {
    return (
        <div className="w-full min-h-screen">
            <DailyActions initialActions={initialActions} />
        </div>
    );
}

import React from "react";
import { DailyAction } from "./DailyActions";
import { DailyActionCard } from "./DailyActionCard";

export function DailyActionsList({
    actions,
    onComplete,
}: {
    actions: DailyAction[];
    onComplete?: (action: DailyAction) => void;
}) {
    if (actions.length === 0) {
        return null;
    }
    return (
        <div className="space-y-3">
            {actions.map((action) => (
                <React.Suspense fallback={null} key={action.id}>
                    <DailyActionCard action={action} onComplete={onComplete} />
                </React.Suspense>
            ))}
        </div>
    );
}

import React from "react";
import { DailyActionCard } from "./DailyActionCard";
import { DailyAction } from "./DailyActions";

export function DailyActionsList({
    actions,
    onComplete,
    onDismiss, 
}: {
    actions: DailyAction[];
    onComplete?: (action: DailyAction) => void;
    onDismiss?: (action: DailyAction) => void; 
}) {
    if (actions.length === 0) {
        return null;
    }
    return (
        <div className="space-y-3">
            {actions.map((action) => (
                <React.Suspense fallback={null} key={action.id}>
                    <DailyActionCard
                        action={action}
                        onComplete={onComplete}
                        onDismiss={onDismiss} 
                    />
                </React.Suspense>
            ))}
        </div>
    );
}

import React from "react";

export function DailyActionsHeader({ count }: { count: number }) {
    return (
        <div className="bg-surface rounded-lg p-3 mb-4">
            <div className="rounded-md border-default">
                <p className="text-sm font-medium text-foreground">
                    {count} action{count > 1 ? "s" : ""} à traiter
                </p>
            </div>
        </div>
    );
}

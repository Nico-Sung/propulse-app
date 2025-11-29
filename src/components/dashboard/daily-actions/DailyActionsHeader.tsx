import React from "react";

export function DailyActionsHeader({ count }: { count: number }) {
    return (
        <div className="flex items-center justify-between px-1 pb-2">
            <div className="flex items-center gap-2">
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-bold text-primary">
                    {count}
                </span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Actions en attente
                </span>
            </div>
        </div>
    );
}

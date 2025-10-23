"use client";

import React from "react";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { Database } from "@/lib/database.types";

export type Application = Database["public"]["Tables"]["applications"]["Row"];

export interface CalendarEvent {
    id: string;
    date: Date;
    type: "deadline" | "interview";
    application: Application;
}

export default function CalendarEventItem({ event }: { event: CalendarEvent }) {
    const past = (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return event.date < today;
    })();

    return (
        <div
            className={`rounded-lg p-4 border-l-4 ${
                event.type === "interview"
                    ? "bg-primary/10 border-primary"
                    : past
                    ? "bg-surface border-default"
                    : "bg-warning/10 border-warning"
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {event.type === "interview" ? (
                            <Clock className="w-4 h-4 text-primary" />
                        ) : (
                            <CalendarIcon className="w-4 h-4 text-warning" />
                        )}
                        <span
                            className={`text-xs font-semibold uppercase tracking-wide ${
                                event.type === "interview"
                                    ? "text-primary"
                                    : "text-warning"
                            }`}
                        >
                            {event.type === "interview"
                                ? "Entretien"
                                : "Date limite"}
                        </span>
                        {event.type === "interview" && (
                            <span className="text-xs text-muted-foreground">
                                {event.date.toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        )}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">
                        {event.application.position_title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        {event.application.company_name}
                    </p>
                </div>
            </div>
        </div>
    );
}

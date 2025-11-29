"use client";

import React from "react";
import { Clock, Calendar as CalendarIcon, Building2 } from "lucide-react";
import { Database } from "@/lib/database.types";
import { cn } from "@/lib/utils";

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

    const isInterview = event.type === "interview";

    return (
        <div
            className={cn(
                "group relative flex items-start gap-4 rounded-xl p-4 transition-all duration-300",
                "glass-card hover:-translate-y-0.5 hover:shadow-md",
                past &&
                    "opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
            )}
        >
            {}
            <div
                className={cn(
                    "absolute left-0 top-4 bottom-4 w-1 rounded-r-full opacity-0 transition-opacity group-hover:opacity-100",
                    isInterview ? "bg-primary" : "bg-amber-500"
                )}
            />

            {}
            <div className="flex flex-col items-center gap-1 min-w-[4rem] pt-0.5">
                <span className="text-sm font-bold text-foreground">
                    {event.date.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
                <div
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm bg-white/50 dark:bg-white/10 shadow-sm",
                        isInterview ? "text-primary" : "text-amber-500"
                    )}
                >
                    {isInterview ? (
                        <Clock className="h-4 w-4" />
                    ) : (
                        <CalendarIcon className="h-4 w-4" />
                    )}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className={cn(
                            "text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full backdrop-blur-sm",
                            isInterview
                                ? "bg-primary/10 text-primary"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        )}
                    >
                        {isInterview ? "Entretien" : "Date limite"}
                    </span>
                </div>

                <h4 className="font-semibold text-base text-foreground truncate">
                    {event.application.position_title}
                </h4>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="truncate">
                        {event.application.company_name}
                    </span>
                </div>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import CalendarEventItem from "./CalendarEventItem";
import { Database } from "@/lib/database.types";

export type Application = Database["public"]["Tables"]["applications"]["Row"];

export interface CalendarEvent {
    id: string;
    date: Date;
    type: "deadline" | "interview";
    application: Application;
}

export default function CalendarDay({ events }: { events: CalendarEvent[] }) {
    const date = events[0].date;
    const today = date.toDateString() === new Date().toDateString();
    const past = (() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return date < d;
    })();

    return (
        <div>
            <div
                className={`flex items-center gap-3 mb-4 ${
                    today
                        ? "text-primary"
                        : past
                        ? "text-muted-foreground"
                        : "text-foreground"
                }`}
            >
                <div
                    className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold ${
                        today
                            ? "bg-primary/20 text-primary"
                            : past
                            ? "bg-surface text-muted-foreground"
                            : "bg-surface text-foreground"
                    }`}
                >
                    <span className="text-xs">
                        {date
                            .toLocaleDateString("fr-FR", { month: "short" })
                            .toUpperCase()}
                    </span>
                    <span className="text-lg">{date.getDate()}</span>
                </div>
                <div>
                    <h3 className="font-bold text-foreground">
                        {today
                            ? "Aujourd'hui"
                            : date.toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                              })}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {events.length} événement{events.length > 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <div className="space-y-3 ml-16">
                {events.map((event) => (
                    <CalendarEventItem key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}

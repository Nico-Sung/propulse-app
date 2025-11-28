"use client";

import React from "react";
import CalendarDay from "./CalendarDay";
import { CalendarEvent } from "./CalendarEventItem";

export default function CalendarList({
    grouped,
}: {
    grouped: Record<string, CalendarEvent[]>;
}) {
    return (
        <div className="space-y-8">
            {Object.entries(grouped).map(([dateKey, dateEvents]) => (
                <CalendarDay key={dateKey} events={dateEvents} />
            ))}
        </div>
    );
}

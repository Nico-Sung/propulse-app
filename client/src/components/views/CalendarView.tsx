"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import {
    Application,
    CalendarEvent,
} from "../dashboard/calendar/CalendarEventItem";
import CalendarList from "../dashboard/calendar/CalendarList";

export default function CalendarView() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const { user } = useAuth();

    const processEvents = useCallback((apps: Application[]) => {
        const eventList: CalendarEvent[] = [];

        apps.forEach((app) => {
            if (app.deadline) {
                eventList.push({
                    id: `${app.id}-deadline`,
                    date: new Date(app.deadline),
                    type: "deadline",
                    application: app,
                });
            }
            if (app.interview_date) {
                eventList.push({
                    id: `${app.id}-interview`,
                    date: new Date(app.interview_date),
                    type: "interview",
                    application: app,
                });
            }
        });

        eventList.sort((a, b) => a.date.getTime() - b.date.getTime());
        setEvents(eventList);
    }, []);

    const loadApplications = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            const apps = data as Application[];
            processEvents(apps);
        }
    }, [processEvents]);

    useEffect(() => {
        if (user) {
            loadApplications();
        } else {
            setEvents([]);
        }
    }, [user, loadApplications]);

    const groupEventsByDate = () => {
        const grouped: Record<string, CalendarEvent[]> = {};
        events.forEach((event) => {
            const dateKey = event.date.toLocaleDateString("fr-FR");
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(event);
        });
        return grouped;
    };

    const groupedEvents = groupEventsByDate();

    return (
        <div className="w-full min-h-screen">
            <CalendarList grouped={groupedEvents} />
        </div>
    );
}

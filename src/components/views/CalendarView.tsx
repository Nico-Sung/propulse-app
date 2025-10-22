"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Application,
    CalendarEvent,
} from "../dashboard/calendar/CalendarEventItem";
import CalendarList from "../dashboard/calendar/CalendarList";

export default function CalendarView() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) loadApplications();
        else {
            setApplications([]);
            setEvents([]);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadApplications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            const apps = data as Application[];
            setApplications(apps);
            processEvents(apps);
        }
        setLoading(false);
    };

    const processEvents = (apps: Application[]) => {
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
    };

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

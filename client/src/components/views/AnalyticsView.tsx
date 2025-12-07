"use client";

import AnalyticsPanel from "@/components/dashboard/analytics/AnalyticsPanel";
import { WeeklyWrapped } from "@/components/dashboard/analytics/WeeklyWrapped";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export default function AnalyticsView() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchAnalyticsData = async () => {
            try {
                const { data, error } = await supabase
                    .from("applications")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setApplications(data || []);
            } catch (error) {
                console.error("Erreur chargement analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen">
            <AnalyticsPanel />

            <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
                <WeeklyWrapped applications={applications} />
            </div>
        </div>
    );
}

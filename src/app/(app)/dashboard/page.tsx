import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";
import KanbanBoard from "@/components/dashboard/kanban/KanbanBoard";

async function getApplications() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return [];
    return data;
}

export default async function DashboardPage() {
    const initialApplications = await getApplications();

    return <KanbanBoard initialApplications={initialApplications} />;
}

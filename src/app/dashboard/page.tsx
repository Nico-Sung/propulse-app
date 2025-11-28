import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";
import DashboardShell from "@/components/dashboard/DashboardShell";

async function getApplications() {
    const cookieStore = await cookies();

    const supabase = createServerComponentClient<Database>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cookies: () => cookieStore as any,
    });

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

    return <DashboardShell initialApplications={initialApplications} />;
}

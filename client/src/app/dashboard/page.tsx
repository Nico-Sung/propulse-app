import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";
import DashboardShell from "@/components/dashboard/DashboardShell";

async function getApplications() {
    const cookieStore = await cookies();

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {}
                },
            },
        }
    );

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

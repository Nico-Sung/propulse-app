import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseAdmin = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (
        process.env.NODE_ENV === "production" &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { data: preferences, error: prefError } = await supabaseAdmin
            .from("user_preferences")
            .select("user_id")
            .eq("email_digest", true);

        if (prefError) throw prefError;

        if (!preferences || preferences.length === 0) {
            return NextResponse.json({ message: "Aucun utilisateur abonné." });
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const dateStr = oneWeekAgo.toISOString();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const notificationsToInsert: any[] = [];

        await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            preferences.map(async (pref: any) => {
                const userId = pref.user_id;

                const { count: appsCount } = await supabaseAdmin
                    .from("applications")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", userId)
                    .gte("created_at", dateStr);

                const { data: completedTasks } = await supabaseAdmin
                    .from("tasks")
                    .select("id, applications!inner(user_id)")
                    .eq("is_completed", true)
                    .gte("completed_at", dateStr)
                    .eq("applications.user_id", userId);

                const tasksCount = completedTasks ? completedTasks.length : 0;

                if ((appsCount || 0) === 0 && tasksCount === 0) return;

                const message = `Cette semaine : ${
                    appsCount || 0
                } nouvelle(s) candidature(s) et ${tasksCount} tâche(s) accomplie(s). Continuez sur votre lancée ! 🚀`;

                notificationsToInsert.push({
                    user_id: userId,
                    title: "Bilan Hebdomadaire 📊",
                    message: message,
                    type: "info",
                    link: "/dashboard?tab=analytics",
                    is_read: false,
                    created_at: new Date().toISOString(),
                });
            })
        );

        if (notificationsToInsert.length > 0) {
            const { error: insertError } = await supabaseAdmin
                .from("notifications")
                .insert(notificationsToInsert);

            if (insertError) throw insertError;
        }

        return NextResponse.json({
            success: true,
            processed: preferences.length,
            notificationsSent: notificationsToInsert.length,
        });
    } catch (error: unknown) {
        console.error("Weekly Digest Error:", error);
        let errorMessage = "Internal Server Error";
        if (error instanceof Error) errorMessage = error.message;

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

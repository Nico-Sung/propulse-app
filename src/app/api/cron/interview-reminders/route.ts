import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const now = new Date();
    const windowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    try {
        const { data: interviews, error } = await supabaseAdmin
            .from("applications")
            .select("id, company_name, position_title, interview_date, user_id")
            .gte("interview_date", windowStart.toISOString())
            .lt("interview_date", windowEnd.toISOString())
            .not("interview_date", "is", null);

        if (error) throw error;

        let count = 0;

        if (interviews && interviews.length > 0) {
            for (const interview of interviews) {
                const { data: existing } = await supabaseAdmin
                    .from("notifications")
                    .select("id")
                    .eq("link", `/dashboard?appId=${interview.id}`)
                    .eq("type", "interview")
                    .gte(
                        "created_at",
                        new Date(now.setHours(0, 0, 0, 0)).toISOString()
                    )
                    .single();

                if (!existing) {
                    await supabaseAdmin.from("notifications").insert({
                        user_id: interview.user_id,
                        title: "Entretien demain !",
                        message: `Préparez-vous pour ${interview.position_title} chez ${interview.company_name}.`,
                        type: "interview",
                        link: `/dashboard?appId=${interview.id}`,
                        is_read: false,
                    });
                    count++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            notificationsCreated: count,
        });
    } catch (error: unknown) {
        console.error("Cron Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

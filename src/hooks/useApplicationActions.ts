"use client";

import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

type Application = Database["public"]["Tables"]["applications"]["Row"];
type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"];

export const COLUMN_LABELS = {
    to_apply: "À postuler",
    applied: "Candidature envoyée",
    waiting: "En attente",
    interview: "Entretien",
    offer: "Offre",
    rejected: "Refusé",
};

export function useApplicationActions(application: Application) {
    const handleDelete = async () => {
        const { error } = await supabase
            .from("applications")
            .delete()
            .eq("id", application.id);
        if (error) {
            toast.error("Erreur lors de la suppression");
            return false;
        }
        toast.success("Candidature supprimée");
        window.location.reload();
        return true;
    };

    const handleDuplicate = async () => {
        const newApplication: ApplicationInsert = {
            user_id: application.user_id,
            company_name: application.company_name,
            position_title: `${application.position_title} (Copie)`,
            job_description: application.job_description,
            status: application.status,
            application_date: application.application_date,
            last_contact_date: application.last_contact_date,
            notes: application.notes,
            job_url: application.job_url,
            contract_type: application.contract_type,
            deadline: application.deadline,
            interview_date: application.interview_date,
            salary_range: application.salary_range,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("applications")
            .insert(newApplication);

        if (error) {
            console.error(error);
            toast.error("Erreur lors de la duplication");
        } else {
            toast.success("Candidature dupliquée");
            window.location.reload();
        }
    };

    const handleMove = async (status: string) => {
        if (status === application.status) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("applications")
            .update({
                status: status,
                updated_at: new Date().toISOString(),
            })
            .eq("id", application.id);

        if (error) {
            toast.error("Erreur lors du déplacement");
        } else {
            toast.success(
                `Déplacé vers ${
                    COLUMN_LABELS[status as keyof typeof COLUMN_LABELS]
                }`
            );
            window.location.reload();
        }
    };

    const copyToClipboard = (text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papier");
    };

    return {
        handleDelete,
        handleDuplicate,
        handleMove,
        copyToClipboard,
    };
}

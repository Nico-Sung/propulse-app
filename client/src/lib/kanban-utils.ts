import { Database } from "@/lib/database.types";

type Application = Database["public"]["Tables"]["applications"]["Row"];
export type SortOption = "date_desc" | "date_asc" | "name_asc" | "manual";

export const sortApplications = (
    apps: Application[],
    sortOption: SortOption
): Application[] => {
    const sortedApps = [...apps];
    switch (sortOption) {
        case "date_desc":
            return sortedApps.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            );
        case "date_asc":
            return sortedApps.sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            );
        case "name_asc":
            return sortedApps.sort((a, b) =>
                a.company_name.localeCompare(b.company_name)
            );
        case "manual":
        default:
            return sortedApps.sort(
                (a, b) => (a.position || 0) - (b.position || 0)
            );
    }
};

export const COLUMNS = [
    { id: "to_apply", label: "À postuler", color: "bg-primary/10" },
    { id: "applied", label: "Candidature envoyée", color: "bg-primary/10" },
    { id: "waiting", label: "En attente", color: "bg-warning/10" },
    { id: "interview", label: "Processus d'entretien", color: "bg-primary/10" },
    { id: "offer", label: "Offre reçue", color: "bg-success/10" },
    { id: "rejected", label: "Refusée", color: "bg-destructive/10" },
] as const;

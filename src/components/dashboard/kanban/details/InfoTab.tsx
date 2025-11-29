"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import {
    AlignLeft,
    Briefcase,
    Calendar,
    DollarSign,
    ExternalLink,
    StickyNote,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export function InfoTab({
    application,
    onUpdate,
}: {
    application: Application;
    onUpdate: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        company_name: application.company_name,
        position_title: application.position_title,
        job_description: application.job_description,
        notes: application.notes,
        job_url: application.job_url,
        contract_type: application.contract_type,
        deadline: (application.deadline as string) || "",
        interview_date: (application.interview_date as string) || "",
        salary_range: application.salary_range,
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("applications")
            .update({
                ...formData,
                deadline: formData.deadline || null,
                interview_date: formData.interview_date || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", application.id);

        if (!error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any).from("activity_history").insert({
                application_id: application.id,
                activity_type: "note",
                description: "Informations mises à jour",
            });
            onUpdate();
            setIsEditing(false);
            toast.success("Informations sauvegardées");
        } else {
            toast.error("Erreur lors de la sauvegarde");
        }
        setLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const InfoCard = ({ icon: Icon, label, value, highlight = false }: any) => (
        <div
            className={cn(
                "p-4 rounded-2xl border backdrop-blur-md transition-all duration-300",
                highlight
                    ? "bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                    : "bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 shadow-sm"
            )}
        >
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <div
                className={cn(
                    "font-bold text-base truncate",
                    highlight ? "text-primary" : "text-foreground"
                )}
            >
                {value}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!isEditing ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoCard
                            icon={Briefcase}
                            label="Contrat"
                            value={application.contract_type || "Non spécifié"}
                        />
                        <InfoCard
                            icon={DollarSign}
                            label="Salaire"
                            value={application.salary_range || "Non spécifié"}
                        />
                        <InfoCard
                            icon={Calendar}
                            label="Deadline"
                            value={
                                application.deadline
                                    ? new Date(
                                          application.deadline
                                      ).toLocaleDateString("fr-FR")
                                    : "Aucune"
                            }
                        />
                        <InfoCard
                            icon={Calendar}
                            label="Entretien"
                            value={
                                application.interview_date
                                    ? new Date(
                                          application.interview_date
                                      ).toLocaleDateString("fr-FR", {
                                          day: "numeric",
                                          month: "short",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : "À planifier"
                            }
                            highlight={!!application.interview_date}
                        />
                    </div>

                    {application.job_url && (
                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium px-2">
                                <ExternalLink className="w-4 h-4" />
                                Lien de l&apos;offre
                            </div>
                            <a
                                href={application.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-muted-foreground hover:text-blue-500 hover:underline truncate max-w-[300px] px-2"
                            >
                                {application.job_url}
                            </a>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="flex flex-col h-full p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-sm backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                                <AlignLeft className="w-4 h-4" />
                                <h4 className="text-sm font-semibold uppercase tracking-wider">
                                    Description du poste
                                </h4>
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 min-h-[100px]">
                                {application.job_description ||
                                    "Aucune description ajoutée."}
                            </div>
                        </div>

                        <div className="flex flex-col h-full p-5 rounded-2xl bg-yellow-500/5 dark:bg-yellow-500/5 border border-yellow-500/10 shadow-sm backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-4 text-yellow-600 dark:text-yellow-500">
                                <StickyNote className="w-4 h-4" />
                                <h4 className="text-sm font-semibold uppercase tracking-wider">
                                    Notes Personnelles
                                </h4>
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 min-h-[100px]">
                                {application.notes ||
                                    "Aucune note pour le moment."}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20 transition-all rounded-full px-8"
                        >
                            Modifier les informations
                        </Button>
                    </div>
                </>
            ) : (
                <div className="space-y-6 p-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                                Entreprise
                            </label>
                            <Input
                                value={formData.company_name as string}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        company_name: e.target.value,
                                    })
                                }
                                className="bg-white/50 dark:bg-black/10 border-black/5 dark:border-white/10 backdrop-blur-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                                Poste
                            </label>
                            <Input
                                value={formData.position_title as string}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        position_title: e.target.value,
                                    })
                                }
                                className="bg-white/50 dark:bg-black/10 border-black/5 dark:border-white/10 backdrop-blur-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                                Contrat
                            </label>
                            <Select
                                value={formData.contract_type || ""}
                                onValueChange={(v) =>
                                    setFormData({
                                        ...formData,
                                        contract_type: v,
                                    })
                                }
                            >
                                <SelectTrigger className="bg-white/50 dark:bg-black/10 border-black/5 dark:border-white/10 backdrop-blur-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass-heavy">
                                    <SelectItem value="CDI">CDI</SelectItem>
                                    <SelectItem value="CDD">CDD</SelectItem>
                                    <SelectItem value="Stage">Stage</SelectItem>
                                    <SelectItem value="Alternance">
                                        Alternance
                                    </SelectItem>
                                    <SelectItem value="Freelance">
                                        Freelance
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                                Salaire
                            </label>
                            <Input
                                value={String(formData.salary_range || "")}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        salary_range: e.target.value,
                                    })
                                }
                                className="bg-white/50 dark:bg-black/10 border-black/5 dark:border-white/10 backdrop-blur-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                                Date Limite
                            </label>
                            <Input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        deadline: e.target.value,
                                    })
                                }
                                className="bg-white/50 dark:bg-black/10 border-black/5 dark:border-white/10 backdrop-blur-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                                Entretien
                            </label>
                            <Input
                                type="datetime-local"
                                value={formData.interview_date}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        interview_date: e.target.value,
                                    })
                                }
                                className="bg-white/50 dark:bg-black/10 border-black/5 dark:border-white/10 backdrop-blur-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                            URL de l&apos;offre
                        </label>
                        <Input
                            type="url"
                            value={(formData.job_url as string) || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    job_url: e.target.value,
                                })
                            }
                            className="bg-white/50 dark:bg-black/10 border-black/5 dark:border-white/10 backdrop-blur-sm text-blue-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                                Description
                            </label>
                            <Textarea
                                value={
                                    (formData.job_description as string) || ""
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        job_description: e.target.value,
                                    })
                                }
                                rows={8}
                                className="bg-white/50 dark:bg-black/10 border-black/5 dark:border-white/10 backdrop-blur-sm resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                                Notes
                            </label>
                            <Textarea
                                value={(formData.notes as string) || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        notes: e.target.value,
                                    })
                                }
                                rows={8}
                                className="bg-yellow-500/5 border-yellow-500/10 backdrop-blur-sm resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex w-full gap-3 pt-4 border-t border-border/40">
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 hover:bg-black/5"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 bg-primary hover:bg-primary/90 shadow-md"
                        >
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

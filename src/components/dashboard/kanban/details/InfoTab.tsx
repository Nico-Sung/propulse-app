"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Briefcase, Calendar, DollarSign } from "lucide-react";

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
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            {!isEditing ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {application.contract_type && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm text-foreground">
                                        <Briefcase className="w-4 h-4 inline-block mr-2" />
                                        Type de contrat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-semibold text-foreground">
                                        {application.contract_type}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {application.salary_range && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm text-foreground">
                                        <DollarSign className="w-4 h-4 inline-block mr-2" />
                                        Salaire
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-semibold text-foreground">
                                        {application.salary_range}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {application.deadline && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm text-foreground">
                                        <Calendar className="w-4 h-4 inline-block mr-2" />
                                        Date limite
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-semibold text-foreground">
                                        {new Date(
                                            application.deadline as string
                                        ).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {application.interview_date && (
                            <Card className="border-primary">
                                <CardHeader>
                                    <CardTitle className="text-sm text-primary">
                                        <Calendar className="w-4 h-4 inline-block mr-2" />
                                        Entretien programmé
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-semibold text-primary">
                                        {new Date(
                                            application.interview_date as string
                                        ).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {application.job_url && (
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Lien vers l&apos;offre
                            </label>
                            <a
                                href={application.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline transition"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="truncate">
                                    {application.job_url}
                                </span>
                            </a>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            Description du poste
                        </label>
                        <Card>
                            <CardContent className="whitespace-pre-wrap text-foreground">
                                {application.job_description ||
                                    "Aucune description"}
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            Notes personnelles
                        </label>
                        <Card>
                            <CardContent className="whitespace-pre-wrap text-foreground">
                                {application.notes || "Aucune note"}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="font-semibold text-primary">
                        <Button
                            className="w-full"
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier
                        </Button>
                    </div>
                </>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
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
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
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
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Type de contrat
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
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
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

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
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
                                placeholder="Ex: 45-55k€"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Date limite
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
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Date d&apos;entretien
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
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            Lien vers l&apos;offre
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
                            placeholder="https://"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            Description
                        </label>
                        <Textarea
                            value={(formData.job_description as string) || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    job_description: e.target.value,
                                })
                            }
                            rows={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
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
                            rows={4}
                        />
                    </div>

                    <div className="flex w-full gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    company_name: application.company_name,
                                    position_title: application.position_title,
                                    job_description:
                                        application.job_description,
                                    notes: application.notes,
                                    job_url: application.job_url,
                                    contract_type: application.contract_type,
                                    deadline:
                                        (application.deadline as string) || "",
                                    interview_date:
                                        (application.interview_date as string) ||
                                        "",
                                    salary_range: application.salary_range,
                                });
                            }}
                        >
                            Annuler
                        </Button>
                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

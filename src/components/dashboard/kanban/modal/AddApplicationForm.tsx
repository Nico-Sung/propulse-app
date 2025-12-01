"use client";

import { Button } from "@/components/ui/button";
import { CompanyAutocomplete } from "@/components/ui/company-autocomplete";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { JobAutocomplete } from "@/components/ui/job-autocomplete";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const applicationSchema = z.object({
    id: z.string().optional(),
    companyName: z.string().min(1, "Entreprise requise"),
    positionTitle: z.string().min(1, "Poste requis"),
    jobDescription: z.string().optional(),
    jobUrl: z.string().optional(),
    contractType: z.string().optional(),
    status: z
        .enum([
            "to_apply",
            "applied",
            "waiting",
            "interview",
            "offer",
            "rejected",
        ])
        .optional(),
    applicationDate: z.string().optional().nullable(),
    lastContactDate: z.string().optional().nullable(),
    notes: z.string().optional(),
    deadline: z.string().optional().nullable(),
    interviewDate: z.string().optional().nullable(),
    salaryRange: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function AddApplicationForm({
    setOpen,
    defaultStatus = "to_apply",
}: {
    setOpen: (open: boolean) => void;
    defaultStatus?: string;
}) {
    const router = useRouter();

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            companyName: "",
            positionTitle: "",
            jobUrl: "",
            contractType: "",
            status: defaultStatus as ApplicationFormValues["status"],
        },
    });

    useEffect(() => {
        form.setValue(
            "status",
            defaultStatus as ApplicationFormValues["status"]
        );
    }, [defaultStatus, form]);

    async function onSubmit(values: ApplicationFormValues) {
        form.resetField("id");
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                console.error("Erreur getUser:", userError);
            }

            if (!user) {
                toast.error("Veuillez vous connecter.");
                router.push("/auth");
                return;
            }

            const id =
                values.id ??
                (typeof crypto !== "undefined"
                    ? crypto.randomUUID()
                    : undefined);

            const insertObj = {
                id,
                user_id: user.id,
                company_name: values.companyName,
                position_title: values.positionTitle,
                job_description: values.jobDescription ?? "",
                status:
                    values.status ??
                    (defaultStatus as ApplicationFormValues["status"]),
                application_date: values.applicationDate ?? null,
                last_contact_date: values.lastContactDate ?? null,
                notes: values.notes ?? "",
                job_url: values.jobUrl ?? "",
                contract_type: values.contractType ?? "",
                deadline: values.deadline ?? null,
                interview_date: values.interviewDate ?? null,
                salary_range: values.salaryRange ?? "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from("applications")
                .insert([insertObj])
                .select()
                .single();

            if (error) {
                console.error("Insert error:", error);
                toast.error(error.message || "Erreur lors de la création.");
                return;
            }

            try {
                const defaultTasks = [
                    "Personnaliser le CV",
                    "Rédiger la lettre de motivation",
                    "Envoyer la candidature",
                ];

                if (data?.id) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { error: tasksError } = await (supabase as any)
                        .from("tasks")
                        .insert(
                            defaultTasks.map((title, index) => ({
                                application_id: data.id,
                                title,
                                order: index,
                                is_completed: false,
                                created_at: new Date().toISOString(),
                            }))
                        );

                    if (tasksError) {
                        console.error(
                            "Error inserting default tasks:",
                            tasksError
                        );
                    }
                }
            } catch (taskInsertErr) {
                console.error(
                    "Unexpected error inserting tasks:",
                    taskInsertErr
                );
            }

            toast.success("Candidature créée avec succès !");
            setOpen(false);
            window.location.reload();
            form.reset();
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Une erreur est survenue.");
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Entreprise *</FormLabel>
                                <FormControl>
                                    <CompanyAutocomplete
                                        value={field.value || ""} 
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="positionTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Poste *</FormLabel>
                                <FormControl>
                                    <JobAutocomplete
                                        value={field.value || ""} 
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="jobUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL de l&apos;offre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://..."
                                        {...field}
                                        value={field.value || ""} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contractType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type de contrat</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="CDI">CDI</SelectItem>
                                        <SelectItem value="CDD">CDD</SelectItem>
                                        <SelectItem value="Stage">
                                            Stage
                                        </SelectItem>
                                        <SelectItem value="Alternance">
                                            Alternance
                                        </SelectItem>
                                        <SelectItem value="Interim">
                                            Intérim
                                        </SelectItem>
                                        <SelectItem value="Autre">
                                            Autre
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description du poste</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Coller ici l'offre..."
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="applicationDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date de candidature</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deadline</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="interviewDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date d&apos;entretien</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Notes, suivi, contacts..."
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="salaryRange"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fourchette salariale</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: 45k-55k"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Statut</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value ?? defaultStatus}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="to_apply">
                                            À postuler
                                        </SelectItem>
                                        <SelectItem value="applied">
                                            Candidature envoyée
                                        </SelectItem>
                                        <SelectItem value="waiting">
                                            En attente
                                        </SelectItem>
                                        <SelectItem value="interview">
                                            Entretien
                                        </SelectItem>
                                        <SelectItem value="offer">
                                            Offre
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            Refusé
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full"
                >
                    {form.formState.isSubmitting
                        ? "Création..."
                        : "Créer la candidature"}
                </Button>
            </form>
        </Form>
    );
}

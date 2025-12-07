"use client";

import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import {
    Edit2,
    Linkedin,
    Loader2,
    Mail,
    Phone,
    Plus,
    Trash2,
    X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];

interface ContactSectionProps {
    applicationId: string;
}

const initialFormState = {
    name: "",
    email: "",
    linkedin_url: "",
    phone: "",
    notes: "",
};

export function ContactsTab({ applicationId }: ContactSectionProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const openDialog = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowDialog(true);
    };

    const loadContacts = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
            .from("contacts")
            .select("*")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false });
        if (data) setContacts(data as Contact[]);
    }, [applicationId]);

    useEffect(() => {
        if (applicationId) loadContacts();
    }, [applicationId, loadContacts]);

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setIsFormVisible(false);
    };

    const handleEdit = (contact: Contact) => {
        setFormData({
            name: contact.name || "",
            email: contact.email || "",
            linkedin_url: contact.linkedin_url || "",
            phone: contact.phone || "",
            notes: contact.notes || "",
        });
        setEditingId(contact.id);
        setIsFormVisible(true);
    };

    const handleDelete = async (contactId: string): Promise<boolean> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("contacts")
            .delete()
            .eq("id", contactId);
        if (error) {
            console.error("Erreur lors de la suppression du contact :", error);
            return false;
        }
        await loadContacts();
        return true;
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return;
        setLoading(true);

        if (editingId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
                .from("contacts")
                .update(formData)
                .eq("id", editingId);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from("contacts")
                .insert({ application_id: applicationId, ...formData });
            if (!error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any).from("activity_history").insert({
                    application_id: applicationId,
                    activity_type: "contact_added",
                    description: `Contact ajouté : ${formData.name}`,
                });
            }
        }
        await loadContacts();
        resetForm();
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!isFormVisible && (
                <Button
                    variant="outline"
                    onClick={() => setIsFormVisible(true)}
                    className="w-full border-dashed border-2 h-12 rounded-xl hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" /> Ajouter un contact
                </Button>
            )}

            {isFormVisible && (
                <div className="glass-card p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">
                            {editingId
                                ? "Modifier le contact"
                                : "Nouveau contact"}
                        </h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={resetForm}
                            className="rounded-full hover:bg-black/5"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        <Input
                            placeholder="Nom *"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="bg-white/40 dark:bg-black/10 border-black/5 backdrop-blur-sm"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="bg-white/40 dark:bg-black/10 border-black/5 backdrop-blur-sm"
                            />
                            <Input
                                placeholder="Téléphone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                                className="bg-white/40 dark:bg-black/10 border-black/5 backdrop-blur-sm"
                            />
                        </div>
                        <Input
                            placeholder="URL LinkedIn"
                            type="url"
                            value={formData.linkedin_url}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    linkedin_url: e.target.value,
                                })
                            }
                            className="bg-white/40 dark:bg-black/10 border-black/5 backdrop-blur-sm"
                        />
                        <Textarea
                            placeholder="Notes (Rôle, contexte...)"
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    notes: e.target.value,
                                })
                            }
                            className="bg-white/40 dark:bg-black/10 border-black/5 backdrop-blur-sm resize-none"
                        />
                        <Button
                            onClick={handleSave}
                            disabled={loading || !formData.name.trim()}
                            className="w-full bg-primary hover:bg-primary/90 shadow-md"
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {editingId
                                ? "Mettre à jour"
                                : "Enregistrer le contact"}
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.length === 0 && !isFormVisible && (
                    <p className="col-span-full text-center text-muted-foreground py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                        Aucun contact enregistré pour cette candidature.
                    </p>
                )}
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="group relative p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-sm backdrop-blur-md transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-black/5"
                                onClick={() => handleEdit(contact)}
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => openDialog(e)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary font-bold text-lg">
                                {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground leading-tight">
                                    {contact.name}
                                </h4>
                                {contact.notes && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {contact.notes}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            {contact.email && (
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors text-sm text-muted-foreground hover:text-primary"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">
                                        {contact.email}
                                    </span>
                                </a>
                            )}
                            {contact.phone && (
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors text-sm text-muted-foreground hover:text-primary"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span className="truncate">
                                        {contact.phone}
                                    </span>
                                </a>
                            )}
                            {contact.linkedin_url && (
                                <a
                                    href={contact.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-500/10 transition-colors text-sm text-muted-foreground hover:text-blue-600"
                                >
                                    <Linkedin className="w-4 h-4" />
                                    <span className="truncate">
                                        Voir le profil LinkedIn
                                    </span>
                                </a>
                            )}
                        </div>

                        <ConfirmationDialog
                            title="Supprimer ce contact ?"
                            description="Cette action est irréversible."
                            confirmLabel="Supprimer"
                            cancelLabel="Annuler"
                            open={showDialog}
                            onOpenChange={setShowDialog}
                            onConfirm={async () => {
                                const ok = await handleDelete(contact.id);
                                if (ok) setShowDialog(false);
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

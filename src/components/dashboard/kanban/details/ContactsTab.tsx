"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Mail,
    Phone,
    Linkedin,
    Trash2,
    Edit2,
    Loader2,
    X,
} from "lucide-react";
import ConfirmationDialog from "@/components/design-system/confirm-dialog";

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

    useEffect(() => {
        if (applicationId) loadContacts();
    }, [applicationId]);

    const loadContacts = async () => {
        const { data } = await (supabase as any)
            .from("contacts")
            .select("*")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false });
        if (data) setContacts(data as Contact[]);
    };

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
            await (supabase as any)
                .from("contacts")
                .update(formData)
                .eq("id", editingId);
        } else {
            const { error } = await (supabase as any)
                .from("contacts")
                .insert({ application_id: applicationId, ...formData });
            if (!error) {
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
        <div className="space-y-6">
            {!isFormVisible && (
                <Button
                    variant="outline"
                    onClick={() => setIsFormVisible(true)}
                    className="w-full border-dashed"
                >
                    <Plus className="w-4 h-4 mr-2" /> Ajouter un contact
                </Button>
            )}

            {isFormVisible && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>
                                {editingId
                                    ? "Modifier le contact"
                                    : "Nouveau contact"}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={resetForm}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Nom *"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
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
                        />
                        <Input
                            placeholder="LinkedIn"
                            type="url"
                            value={formData.linkedin_url}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    linkedin_url: e.target.value,
                                })
                            }
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
                        />
                        <Textarea
                            placeholder="Notes (ex: RH, Manager...)"
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    notes: e.target.value,
                                })
                            }
                        />
                        <Button
                            onClick={handleSave}
                            disabled={loading || !formData.name.trim()}
                            className="w-full"
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {editingId ? "Modifier" : "Enregistrer"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-3">
                {contacts.length === 0 && !isFormVisible && (
                    <p className="text-center text-muted-foreground py-8">
                        Aucun contact enregistré.
                    </p>
                )}
                {contacts.map((contact) => (
                    <Card key={contact.id} className="group">
                        <CardHeader className="flex flex-row justify-between items-start pb-2">
                            <CardTitle className="text-base">
                                {contact.name}
                            </CardTitle>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleEdit(contact)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => openDialog(e)}
                                >
                                    <Trash2 className="h-4 w-4 hover:text-destructive" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {contact.email && (
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                                >
                                    <Mail className="w-4 h-4" />
                                    {contact.email}
                                </a>
                            )}
                            {contact.phone && (
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                                >
                                    <Phone className="w-4 h-4" />
                                    {contact.phone}
                                </a>
                            )}
                            {contact.linkedin_url && (
                                <a
                                    href={contact.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                                >
                                    <Linkedin className="w-4 h-4" />
                                    Profil LinkedIn
                                </a>
                            )}
                            {contact.notes && (
                                <p className="text-muted-foreground mt-2 pt-2 border-t border-default">
                                    {contact.notes}
                                </p>
                            )}
                        </CardContent>
                        <ConfirmationDialog
                            title="Confirmer la suppression"
                            description="Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible."
                            confirmLabel="Supprimer"
                            cancelLabel="Annuler"
                            open={showDialog}
                            onOpenChange={setShowDialog}
                            onConfirm={async () => {
                                const ok = await handleDelete(contact.id);
                                if (ok) setShowDialog(false);
                            }}
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
}

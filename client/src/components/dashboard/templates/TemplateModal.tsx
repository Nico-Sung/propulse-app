"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/lib/database.types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Template = Database["public"]["Tables"]["templates"]["Row"];

interface TemplateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    templateToEdit: Template | null;
    onSave: (title: string, category: string, content: string) => Promise<void>;
}

export function TemplateModal({
    open,
    onOpenChange,
    templateToEdit,
    onSave,
}: TemplateModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "email",
        content: "",
    });

    useEffect(() => {
        if (open) {
            if (templateToEdit) {
                setFormData({
                    title: templateToEdit.title,
                    category: templateToEdit.category,
                    content: templateToEdit.content,
                });
            } else {
                setFormData({
                    title: "",
                    category: "email",
                    content: "",
                });
            }
        }
    }, [open, templateToEdit]);

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) return;
        setLoading(true);
        await onSave(formData.title, formData.category, formData.content);
        setLoading(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-heavy sm:max-w-lg border-0 shadow-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {templateToEdit
                            ? "Modifier le modèle"
                            : "Créer un modèle"}
                    </DialogTitle>
                    <DialogDescription>
                        Utilisez des variables comme [Nom] ou [Poste] pour
                        personnaliser vos messages plus tard.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-4">
                    <div className="space-y-2">
                        <Label>Titre du modèle</Label>
                        <Input
                            placeholder="Ex: Relance LinkedIn, Remerciements..."
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Catégorie</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(val) =>
                                setFormData({ ...formData, category: val })
                            }
                        >
                            <SelectTrigger className="bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-heavy">
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="linkedin">
                                    LinkedIn
                                </SelectItem>
                                <SelectItem value="sms">
                                    SMS / WhatsApp
                                </SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Contenu</Label>
                        <Textarea
                            placeholder="Bonjour [Prénom], je vous contacte suite à..."
                            rows={8}
                            value={formData.content}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    content: e.target.value,
                                })
                            }
                            className="bg-white/50 dark:bg-black/20 resize-none backdrop-blur-sm"
                        />
                    </div>
                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-primary hover:bg-primary/90 shadow-md"
                        disabled={loading}
                    >
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {templateToEdit ? "Mettre à jour" : "Créer le modèle"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

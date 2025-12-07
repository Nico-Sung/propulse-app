"use client";

import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import {
    Mail,
    MessageCircle,
    MessageSquare,
    MessageSquareQuote,
    MoreHorizontal,
    Plus,
    Search,
    Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TemplateCard } from "../dashboard/templates/TemplateCard";
import { TemplateModal } from "../dashboard/templates/TemplateModal";

type Template = Database["public"]["Tables"]["templates"]["Row"];

const FILTERS = [
    { id: "all", label: "Tous", icon: MessageSquareQuote },
    { id: "email", label: "Email", icon: Mail },
    { id: "linkedin", label: "LinkedIn", icon: Share2 },
    { id: "sms", label: "SMS", icon: MessageCircle },
    { id: "other", label: "Autre", icon: MoreHorizontal },
];

export default function TemplatesView() {
    const { user } = useAuth();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(
        null
    );
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        if (user) loadTemplates();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadTemplates = async () => {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from("templates")
            .select("*")
            .eq("user_id", user?.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Erreur chargement templates:", error);
            toast.error("Impossible de charger les modèles.");
        } else if (data) {
            setTemplates(data as Template[]);
        }
        setLoading(false);
    };

    const handleSave = async (
        title: string,
        category: string,
        content: string
    ) => {
        if (!user) return;

        try {
            if (editingTemplate) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { error } = await (supabase as any)
                    .from("templates")
                    .update({ title, category, content })
                    .eq("id", editingTemplate.id);
                if (error) throw error;
                toast.success("Modèle mis à jour");
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { error } = await (supabase as any)
                    .from("templates")
                    .insert({ user_id: user.id, title, category, content });
                if (error) throw error;
                toast.success("Nouveau modèle créé");
            }
            await loadTemplates();
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            toast.error("Une erreur est survenue.");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsActionLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from("templates")
                .delete()
                .eq("id", deleteId);
            if (error) throw error;

            toast.success("Modèle supprimé");
            setDeleteId(null);
            await loadTemplates();
        } catch (error) {
            console.error(error);
            toast.error("Impossible de supprimer le modèle.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papier !");
    };

    const handleOpenEdit = (template: Template) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    const handleOpenCreate = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };

    const filteredTemplates = templates.filter((t) => {
        const matchesSearch =
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                        Modèles de messages
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Gagnez du temps avec vos messages récurrents.
                    </p>
                </div>

                <Button
                    onClick={handleOpenCreate}
                    className="rounded-full shadow-lg gap-2 bg-primary hover:bg-primary/90"
                >
                    <Plus className="w-4 h-4" /> Nouveau modèle
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {FILTERS.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                    isSelected
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white/40 dark:bg-white/5 border-transparent focus:bg-background transition-all rounded-full"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <Spinner size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onEdit={handleOpenEdit}
                            onDelete={(id) => setDeleteId(id)}
                            onCopy={handleCopy}
                        />
                    ))}

                    {filteredTemplates.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20">
                            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p>
                                Aucun modèle trouvé
                                {searchQuery && ` pour "${searchQuery}"`}
                                {selectedCategory !== "all" &&
                                    ` dans la catégorie ${
                                        FILTERS.find(
                                            (c) => c.id === selectedCategory
                                        )?.label
                                    }`}
                            </p>
                        </div>
                    )}
                </div>
            )}

            <TemplateModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                templateToEdit={editingTemplate}
                onSave={handleSave}
            />

            <ConfirmationDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Supprimer ce modèle ?"
                description="Cette action est irréversible."
                confirmLabel={isActionLoading ? "Suppression..." : "Supprimer"}
                cancelLabel="Annuler"
                onConfirm={handleDelete}
            />
        </div>
    );
}

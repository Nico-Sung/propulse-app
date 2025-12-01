"use client";

import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DocumentCard } from "../dashboard/documents/DocumentCard";
import { DocumentPreviewModal } from "../dashboard/documents/DocumentPreviewModal";
import { DocumentUploadModal } from "../dashboard/documents/DocumentUploadModal";
import { SortableDocumentCard } from "../dashboard/documents/SortableDocumentCard";

type Document = Database["public"]["Tables"]["documents"]["Row"];

export default function DocumentsView() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 },
        })
    );

    useEffect(() => {
        if (user) loadDocuments();
    }, [user]);

    const loadDocuments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("documents")
            .select("*")
            .order("position", { ascending: true })
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Erreur chargement documents:", error);
        }

        if (data) setDocuments(data as Document[]);
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!deleteDoc) return;

        const { error } = await supabase
            .from("documents")
            .delete()
            .eq("id", deleteDoc.id);

        if (error) {
            toast.error("Erreur suppression");
            return;
        }

        loadDocuments();
        toast.success("Document supprimé");
        setDeleteDoc(null);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id || !user) return;

        const oldIndex = documents.findIndex((doc) => doc.id === active.id);
        const newIndex = documents.findIndex((doc) => doc.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = arrayMove(documents, oldIndex, newIndex);

            setDocuments(newOrder);

            const updates = newOrder.map((doc, index) => ({
                ...doc,
                user_id: user.id,
                position: index,
            }));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from("documents")
                .upsert(updates, { onConflict: "id" });

            if (error) {
                console.error("Erreur lors de la réorganisation:", error);

                if (error.code === "42501") {
                    toast.error(
                        "Erreur de permissions. Vérifiez la politique RLS."
                    );
                } else if (error.code === "23502") {
                    toast.error("Données incomplètes pour la mise à jour.");
                } else {
                    toast.error("Erreur lors de la sauvegarde de l'ordre");
                }

                loadDocuments();
            }
        }
    };

    const activeDocument = documents.find((doc) => doc.id === activeId);

    if (loading && documents.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                        Documents
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Centralisez et organisez vos CVs et lettres de
                        motivation.
                    </p>
                </div>
                <DocumentUploadModal onUploadComplete={loadDocuments} />
            </div>

            {documents.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center py-20 text-center rounded-2xl border-dashed border-2 border-muted/50">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md shadow-inner">
                        <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                        La bibliothèque est vide
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-6">
                        Ajoutez votre premier CV pour commencer à construire
                        votre dossier de candidature.
                    </p>
                    <DocumentUploadModal onUploadComplete={loadDocuments} />
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={documents.map((d) => d.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 content-start items-start w-full">
                            {documents.map((doc) => (
                                <SortableDocumentCard
                                    key={doc.id}
                                    doc={doc}
                                    onPreview={() => setPreviewDoc(doc)}
                                    onDelete={() => setDeleteDoc(doc)}
                                />
                            ))}
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeDocument ? (
                            <div className="scale-105 rotate-2 cursor-grabbing">
                                <DocumentCard
                                    doc={activeDocument}
                                    onPreview={() => {}}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}

            {previewDoc && (
                <DocumentPreviewModal
                    open={!!previewDoc}
                    onOpenChange={(open) => !open && setPreviewDoc(null)}
                    url={previewDoc.file_url}
                    title={previewDoc.file_name}
                />
            )}

            <ConfirmationDialog
                open={!!deleteDoc}
                onOpenChange={(open) => !open && setDeleteDoc(null)}
                title="Supprimer ce document ?"
                description="Il ne sera plus accessible dans vos candidatures."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={handleDelete}
            />
        </div>
    );
}

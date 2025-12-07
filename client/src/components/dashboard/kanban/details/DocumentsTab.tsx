"use client";

import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { useCallback, useEffect, useState } from "react";

import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileText, Link as LinkIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { DocumentCard } from "../../documents/DocumentCard";
import { DocumentPreviewModal } from "../../documents/DocumentPreviewModal";
import { DocumentUploadModal } from "../../documents/DocumentUploadModal";

type Document = Database["public"]["Tables"]["documents"]["Row"];

export function DocumentsTab({ applicationId }: { applicationId: string }) {
    const [linkedDocs, setLinkedDocs] = useState<Document[]>([]);
    const [availableDocs, setAvailableDocs] = useState<Document[]>([]);
    const [selectedDocId, setSelectedDocId] = useState<string>("");
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

    const [unlinkDoc, setUnlinkDoc] = useState<Document | null>(null);
    const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);

    const loadData = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: linked } = await (supabase as any)
            .from("documents")
            .select("*")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: available } = await (supabase as any)
            .from("documents")
            .select("*")
            .is("application_id", null)
            .order("created_at", { ascending: false });

        if (linked) setLinkedDocs(linked as Document[]);
        if (available) setAvailableDocs(available as Document[]);
    }, [applicationId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const linkDocument = async () => {
        if (!selectedDocId) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("documents")
            .update({ application_id: applicationId })
            .eq("id", selectedDocId);

        if (!error) {
            toast.success("Document lié avec succès");
            setSelectedDocId("");
            loadData();
        } else {
            toast.error("Erreur lors de la liaison");
        }
    };

    const handleUnlink = async () => {
        if (!unlinkDoc) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("documents")
            .update({ application_id: null })
            .eq("id", unlinkDoc.id);

        if (!error) {
            toast.success("Document détaché");
            setUnlinkDoc(null);
            loadData();
        } else {
            toast.error("Erreur lors du détachement");
        }
    };

    const handleDelete = async () => {
        if (!deleteDoc) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("documents")
            .delete()
            .eq("id", deleteDoc.id);

        if (!error) {
            toast.success("Document supprimé définitivement");
            setDeleteDoc(null);
            loadData();
        } else {
            toast.error("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-sm">
                <div className="flex-1 space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                        Lier un document existant
                    </label>
                    <div className="flex gap-2">
                        <Select
                            value={selectedDocId}
                            onValueChange={setSelectedDocId}
                        >
                            <SelectTrigger className="bg-white/50 dark:bg-black/10 border-black/5 dark:border-white/10 h-10">
                                <SelectValue placeholder="Choisir un document..." />
                            </SelectTrigger>
                            <SelectContent className="glass-heavy">
                                {availableDocs.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                        Aucun document disponible
                                    </div>
                                ) : (
                                    availableDocs.map((doc) => (
                                        <SelectItem key={doc.id} value={doc.id}>
                                            {doc.file_name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="secondary"
                            onClick={linkDocument}
                            disabled={!selectedDocId}
                            className="bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 h-10"
                        >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Lier
                        </Button>
                    </div>
                </div>
                <div className="flex items-end">
                    <DocumentUploadModal
                        onUploadComplete={loadData}
                        defaultApplicationId={applicationId}
                        trigger={
                            <Button className="w-full sm:w-auto h-10 bg-primary hover:bg-primary/90 shadow-md rounded-full px-6">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouveau Doc
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="space-y-4">
                {linkedDocs.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-2xl">
                        <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                        <p className="text-sm text-muted-foreground">
                            Aucun document lié pour l&apos;instant
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {linkedDocs.map((doc) => (
                            <div key={doc.id} className="relative group h-full">
                                <DocumentCard
                                    doc={doc}
                                    onPreview={() => setPreviewDoc(doc)}
                                    onUnlink={() => setUnlinkDoc(doc)}
                                    onDelete={() => setDeleteDoc(doc)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {previewDoc && (
                <DocumentPreviewModal
                    open={!!previewDoc}
                    onOpenChange={(open) => !open && setPreviewDoc(null)}
                    url={previewDoc.file_url}
                    title={previewDoc.file_name}
                />
            )}

            <ConfirmationDialog
                open={!!unlinkDoc}
                onOpenChange={(open) => !open && setUnlinkDoc(null)}
                title="Détacher le document ?"
                description="Le document restera dans votre bibliothèque mais ne sera plus lié ici."
                confirmLabel="Détacher"
                cancelLabel="Annuler"
                onConfirm={handleUnlink}
            />

            <ConfirmationDialog
                open={!!deleteDoc}
                onOpenChange={(open) => !open && setDeleteDoc(null)}
                title="Supprimer définitivement ?"
                description="Attention : Suppression définitive de la bibliothèque."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={handleDelete}
            />
        </div>
    );
}

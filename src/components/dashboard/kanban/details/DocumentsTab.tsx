"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/database.types";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Link as LinkIcon, Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { DocumentUploadModal } from "../../documents/DocumentUploadModal";
import { DocumentPreviewModal } from "../../documents/DocumentPreviewModal";
import { DocumentCard } from "../../documents/DocumentCard";

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
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Lier un document existant
                    </label>
                    <div className="flex gap-2">
                        <Select
                            value={selectedDocId}
                            onValueChange={setSelectedDocId}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Choisir un document..." />
                            </SelectTrigger>
                            <SelectContent>
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
                            <Button className="w-full sm:w-auto">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouveau Doc
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Documents associés ({linkedDocs.length})
                </h3>

                {linkedDocs.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-border rounded-lg">
                        <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-muted-foreground">
                            Aucun document lié à cette candidature
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {linkedDocs.map((doc) => (
                            <div key={doc.id} className="relative group">
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
                description="Le document restera dans votre bibliothèque globale mais ne sera plus lié à cette candidature."
                confirmLabel="Détacher"
                cancelLabel="Annuler"
                onConfirm={handleUnlink}
            />

            <ConfirmationDialog
                open={!!deleteDoc}
                onOpenChange={(open) => !open && setDeleteDoc(null)}
                title="Supprimer définitivement ?"
                description="Attention : Ce document sera supprimé de votre bibliothèque et de toutes les candidatures associées."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={handleDelete}
            />
        </div>
    );
}

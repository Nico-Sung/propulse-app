"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/database.types";
import Spinner from "@/components/ui/Spinner";
import { FileText } from "lucide-react";
import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { toast } from "sonner";
import { DocumentUploadModal } from "../dashboard/documents/DocumentUploadModal";
import { DocumentCard } from "../dashboard/documents/DocumentCard";
import { DocumentPreviewModal } from "../dashboard/documents/DocumentPreviewModal";

type Document = Database["public"]["Tables"]["documents"]["Row"];

export default function DocumentsView() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);

    useEffect(() => {
        if (user) loadDocuments();
    }, [user]);

    const loadDocuments = async () => {
        setLoading(true);
        const { data } = await (supabase as any)
            .from("documents")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setDocuments(data as Document[]);
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!deleteDoc) return;

        const { error } = await (supabase as any)
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

    return (
        <div className="p-6 w-full max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                        Documents
                    </h2>
                    <p className="text-muted-foreground">
                        Centralisez vos CVs et lettres de motivation.
                    </p>
                </div>
                <DocumentUploadModal onUploadComplete={loadDocuments} />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size={32} />
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
                    <div className="bg-background rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                        C'est un peu vide ici
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-6">
                        Ajoutez votre premier CV pour commencer.
                    </p>
                    <DocumentUploadModal onUploadComplete={loadDocuments} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 content-start items-start w-full">
                    {documents.map((doc) => (
                        <DocumentCard
                            key={doc.id}
                            doc={doc}
                            onPreview={() => setPreviewDoc(doc)}
                            onDelete={() => setDeleteDoc(doc)}
                        />
                    ))}
                </div>
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

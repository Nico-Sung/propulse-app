"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/database.types";
import { Eye, FileText, Trash2, Unlink } from "lucide-react";

type Document = Database["public"]["Tables"]["documents"]["Row"];

interface DocumentCardProps {
    doc: Document;
    onPreview: () => void;
    onDelete?: () => void;
    onUnlink?: () => void;
}

export function DocumentCard({
    doc,
    onPreview,
    onDelete,
    onUnlink,
}: DocumentCardProps) {
    return (
        <div
            className="glass-card group relative flex flex-col h-full rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            onClick={onPreview}
        >
            <div className="flex items-start gap-4 flex-1 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary backdrop-blur-md shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                    <h3
                        className="font-semibold text-foreground truncate w-full transition-colors text-base group-hover:text-primary"
                        title={doc.file_name}
                    >
                        {doc.file_name}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center">
                        <Badge
                            variant="secondary"
                            className="capitalize shrink-0 text-[10px] px-2 h-5 font-medium bg-surface/50 backdrop-blur-sm border-border/50"
                        >
                            {doc.document_type === "cover_letter"
                                ? "Lettre"
                                : "CV"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-white/10 dark:border-white/5 pt-3 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPreview();
                    }}
                    title="Prévisualiser"
                >
                    <Eye className="w-4 h-4 mr-1.5" />
                    <span className="text-xs font-medium">Voir</span>
                </Button>

                {onUnlink && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 transition-colors rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            onUnlink();
                        }}
                        title="Détacher de la candidature"
                    >
                        <Unlink className="w-4 h-4" />
                    </Button>
                )}

                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        title="Supprimer définitivement"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

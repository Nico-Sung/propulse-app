"use client";

import { Database } from "@/lib/database.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Trash2, Unlink } from "lucide-react";

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
        <Card className="group hover:shadow-md hover:border-primary/20 transition-all duration-200 border-border/60 bg-card/50 backdrop-blur-sm flex flex-col h-full">
            <div className="p-4 flex items-start gap-4 flex-1">
                <div
                    className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                    onClick={onPreview}
                >
                    <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                            <h3
                                className="font-semibold text-foreground truncate w-full cursor-pointer hover:text-primary transition-colors"
                                title={doc.file_name}
                                onClick={onPreview}
                            >
                                {doc.file_name}
                            </h3>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                                {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                            <Badge
                                variant="secondary"
                                className="capitalize shrink-0 text-[10px] px-1.5 h-5 font-medium bg-muted text-muted-foreground"
                            >
                                {doc.document_type === "cover_letter"
                                    ? "Lettre"
                                    : "CV"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4 pt-0 flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/5"
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
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10"
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
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
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
        </Card>
    );
}

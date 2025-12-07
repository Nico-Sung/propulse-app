"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentPreviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    title: string;
}

export function DocumentPreviewModal({
    open,
    onOpenChange,
    url,
    title,
}: DocumentPreviewModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const isOfficeDoc = /\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(url);

    const pdfParams = "#toolbar=0&navpanes=0&view=FitH";

    const previewUrl = isOfficeDoc
        ? `https://docs.google.com/gview?url=${encodeURIComponent(
              url
          )}&embedded=true`
        : `${url}${pdfParams}`;

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erreur réseau");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            let filename = title;
            if (!/\.[a-zA-Z0-9]+$/.test(filename)) {
                const extFromUrl = url.split(".").pop()?.split("?")[0];
                if (extFromUrl) filename += `.${extFromUrl}`;
            }

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            toast.success("Téléchargement commencé");
        } catch (error) {
            console.error("Erreur téléchargement:", error);
            toast.error("Impossible de télécharger le fichier");
            window.open(url, "_blank");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden glass-heavy border-0 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                <DialogHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between space-y-0 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <DialogTitle className="truncate font-semibold text-foreground pl-2 text-lg tracking-tight">
                            {title}
                        </DialogTitle>
                    </div>
                    <div className="flex items-center gap-2 pl-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Ouvrir l&apos;original
                            </a>
                        </Button>
                        <Button
                            size="sm"
                            className="h-8 bg-primary/90 hover:bg-primary text-primary-foreground shadow-sm"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4 mr-2" />
                            )}
                            Télécharger
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 ml-2 rounded-full"
                            onClick={() => onOpenChange(false)}
                        ></Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 w-full h-full relative bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-none absolute inset-0 block"
                        title={title}
                        allowFullScreen
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { FileText, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DocumentUploadModal({
    onUploadComplete,
    defaultApplicationId,
    trigger,
}: {
    onUploadComplete: () => void;
    defaultApplicationId?: string;
    trigger?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [type, setType] = useState<"cv" | "cover_letter">("cv");
    const { user } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            if (!name) {
                const cleanName = selectedFile.name
                    .split(".")
                    .slice(0, -1)
                    .join(".");
                setName(cleanName);
            }
        }
    };

    const handleUpload = async () => {
        if (!file || !user) return;
        setLoading(true);

        try {
            const fileExt = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("documents")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage.from("documents").getPublicUrl(filePath);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: dbError } = await (supabase as any)
                .from("documents")
                .insert({
                    user_id: user.id,
                    file_name: name,
                    file_url: publicUrl,
                    document_type: type,
                    version_number: 1,
                    application_id: defaultApplicationId || null,
                    created_at: new Date().toISOString(),
                });

            if (dbError) throw dbError;

            if (defaultApplicationId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any).from("activity_history").insert({
                    application_id: defaultApplicationId,
                    activity_type: "document_added",
                    description: `Document ajouté : ${name} (${
                        type === "cv" ? "CV" : "Lettre"
                    })`,
                });
            }

            toast.success("Document ajouté avec succès");
            setOpen(false);
            setFile(null);
            setName("");
            onUploadComplete();
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                toast.error("Erreur lors de l'upload: " + error.message);
            } else {
                toast.error("Une erreur inconnue est survenue");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2 bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6">
                        <Upload className="w-4 h-4" />
                        Ajouter un document
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glass-heavy border-0 ring-1 ring-white/20 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-foreground">
                        Ajouter un document
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Stockez vos CV et lettres de motivation.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-4">
                    <div className="space-y-2">
                        <Label>Type de document</Label>
                        <Select
                            value={type}
                            onValueChange={(v: "cv" | "cover_letter") =>
                                setType(v)
                            }
                        >
                            <SelectTrigger className="bg-white/50 dark:bg-black/20 border-border/50 backdrop-blur-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-heavy border-border/50">
                                <SelectItem value="cv">CV</SelectItem>
                                <SelectItem value="cover_letter">
                                    Lettre de motivation
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Nom du fichier</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: CV Développeur React 2025"
                            className="bg-white/50 dark:bg-black/20 border-border/50 backdrop-blur-sm focus:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Fichier (PDF recommandé)</Label>
                        <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 relative bg-white/30 dark:bg-black/10 backdrop-blur-sm group">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {file ? (
                                <div className="flex flex-col items-center gap-2 text-primary font-medium animate-in zoom-in-50 duration-300">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm underline decoration-dotted underline-offset-4">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-normal">
                                        Cliquez pour changer
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        Cliquez ou glissez un fichier ici
                                    </p>
                                    <p className="text-xs text-muted-foreground/80 mt-1">
                                        PDF, DOCX jusqu&apos;à 5MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="hover:bg-black/5"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || !name || loading}
                        className="bg-primary hover:bg-primary/90 shadow-md transition-all"
                    >
                        {loading && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Sauvegarder
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2 } from "lucide-react";
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
        } catch (error: any) {
            console.error(error);
            toast.error("Erreur lors de l'upload: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Upload className="w-4 h-4" />
                        Ajouter un document
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ajouter un document</DialogTitle>
                    <DialogDescription>
                        Stockez vos CV et lettres de motivation.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Type de document</Label>
                        <Select
                            value={type}
                            onValueChange={(v: any) => setType(v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
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
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Fichier (PDF recommandé)</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {file ? (
                                <div className="flex items-center gap-2 text-primary font-medium">
                                    <FileText className="w-6 h-6" />
                                    {file.name}
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Cliquez ou glissez un fichier ici
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || !name || loading}
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

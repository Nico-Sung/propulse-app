"use client";

import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SecurityTab() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.rpc("delete_user");
            if (error) throw error;
            toast.success("Compte supprimé avec succès. Au revoir !");
            router.push("/");
            window.location.href = "/";
        } catch (error: unknown) {
            console.error("Erreur suppression:", error);
            let message = "Erreur inconnue";
            if (error instanceof Error) {
                message = error.message;
            } else if (
                typeof error === "object" &&
                error !== null &&
                "message" in error
            ) {
                message = String((error as { message: string }).message);
            }
            toast.error("Impossible de supprimer le compte : " + message);
        } finally {
            setLoading(false);
            setShowDeleteDialog(false);
        }
    };

    const handleChangePassword = async () => {
        if (!user || !user.email) {
            toast.error("Utilisateur non identifié");
            return;
        }
        if (!oldPassword) {
            toast.error("Veuillez entrer votre ancien mot de passe");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Les nouveaux mots de passe ne correspondent pas");
            return;
        }
        if (newPassword.length < 6) {
            toast.error(
                "Le nouveau mot de passe doit contenir au moins 6 caractères"
            );
            return;
        }

        setPasswordLoading(true);
        try {
            const { error: signInError } =
                await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: oldPassword,
                });

            if (signInError) {
                throw new Error("L'ancien mot de passe est incorrect");
            }

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            toast.success("Mot de passe mis à jour avec succès");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: unknown) {
            console.error(error);
            let message = "Impossible de mettre à jour le mot de passe";
            if (error instanceof Error) {
                message = error.message;
            } else if (
                typeof error === "object" &&
                error !== null &&
                "message" in error
            ) {
                message = String((error as { message: string }).message);
            }
            toast.error(message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h3 className="text-xl font-semibold text-foreground">
                    Confidentialité & Données
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Gérez vos données personnelles et la sécurité.
                </p>
            </div>

            <div className="space-y-6">
                <Card className="glass-card border-0 ring-1 ring-white/10">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Sécurité</CardTitle>
                        </div>
                        <CardDescription>
                            Modifiez votre mot de passe.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="old-password">
                                Ancien mot de passe
                            </Label>
                            <Input
                                id="old-password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="bg-white/50 dark:bg-black/10 backdrop-blur-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">
                                Nouveau mot de passe
                            </Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-white/50 dark:bg-black/10 backdrop-blur-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">
                                Confirmer le nouveau
                            </Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="bg-white/50 dark:bg-black/10 backdrop-blur-sm"
                            />
                        </div>
                        <Button
                            onClick={handleChangePassword}
                            disabled={
                                passwordLoading ||
                                !oldPassword ||
                                !newPassword ||
                                !confirmPassword
                            }
                            className="w-full sm:w-auto"
                        >
                            {passwordLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Mettre à jour
                        </Button>
                    </CardContent>
                </Card>

                <div className="p-4 rounded-xl border border-border bg-white/50 dark:bg-white/5">
                    <h4 className="font-medium mb-2">Exporter mes données</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                        Téléchargez une copie de vos données (CSV).
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => toast.info("Bientôt disponible")}
                    >
                        Exporter en CSV
                    </Button>
                </div>

                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                    <div className="flex items-center gap-2 mb-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        <h4 className="font-medium">Zone de danger</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        La suppression de votre compte est{" "}
                        <strong>irréversible</strong>.
                    </p>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        Supprimer mon compte
                    </Button>
                </div>
            </div>

            <ConfirmationDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Êtes-vous sûr ?"
                description="Cette action est irréversible."
                confirmLabel={loading ? "Suppression..." : "Oui, supprimer"}
                cancelLabel="Annuler"
                onConfirm={handleDeleteAccount}
            />
        </div>
    );
}

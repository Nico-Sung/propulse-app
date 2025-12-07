"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        if (password.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            toast.success("Mot de passe mis à jour avec succès !");
            router.push("/dashboard");
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

            <div className="relative z-10 w-full max-w-md glass-heavy rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8 md:p-10">
                <div className="flex flex-col space-y-2 text-center mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Nouveau mot de passe
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Saisissez votre nouveau mot de passe pour sécuriser
                        votre compte.
                    </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nouveau mot de passe</Label>
                        <PasswordInput
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm">
                            Confirmer le mot de passe
                        </Label>
                        <PasswordInput
                            id="confirm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Mettre à jour
                    </Button>
                </form>
            </div>
        </div>
    );
}

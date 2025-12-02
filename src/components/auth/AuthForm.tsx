"use client";

import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";

type Props = {
    initialSignUp?: boolean;
};

type AuthView = "signin" | "signup" | "forgot_password";

export default function AuthForm({ initialSignUp = false }: Props) {
    const [view, setView] = useState<AuthView>(
        initialSignUp ? "signup" : "signin"
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (view === "forgot_password") {
                const { error } = await supabase.auth.resetPasswordForEmail(
                    email,
                    {
                        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
                    }
                );
                if (error) throw error;
                toast.success("Email de réinitialisation envoyé !");
                setView("signin");
            } else if (view === "signup") {
                if (password !== confirmPassword) {
                    setError("Les mots de passe ne correspondent pas.");
                    setLoading(false);
                    return;
                }
                const { error } = await signUp(email, password, fullName);
                if (error) throw error;
            } else {
                const { error } = await signIn(email, password);
                if (error) throw error;
            }
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Erreur Auth:", err);
            let message = err.message || "Une erreur est survenue";
            if (message.includes("User already registered"))
                message = "Cet email est déjà utilisé.";
            if (message.includes("Invalid login credentials"))
                message = "Identifiants incorrects.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    {view === "signup" && "Créer un compte"}
                    {view === "signin" && "Bon retour"}
                    {view === "forgot_password" && "Mot de passe oublié"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {view === "forgot_password"
                        ? "Entrez votre email pour recevoir un lien de réinitialisation"
                        : "Entrez vos informations pour continuer"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {view === "signup" && (
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="sr-only">
                            Nom complet
                        </Label>
                        <Input
                            id="fullName"
                            placeholder="Nom complet"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="bg-white/50 dark:bg-black/20 border-transparent focus:border-primary/50 backdrop-blur-sm h-11"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email" className="sr-only">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="nom@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/50 dark:bg-black/20 border-transparent focus:border-primary/50 backdrop-blur-sm h-11"
                    />
                </div>

                {view !== "forgot_password" && (
                    <>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="sr-only">
                                    Mot de passe
                                </Label>
                                {view === "signin" && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        type="button"
                                        className="px-0 h-auto font-normal text-xs text-muted-foreground hover:text-primary"
                                        onClick={() => {
                                            setError("");
                                            setView("forgot_password");
                                        }}
                                    >
                                        Mot de passe oublié ?
                                    </Button>
                                )}
                            </div>
                            <PasswordInput
                                id="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="bg-white/50 dark:bg-black/20 border-transparent focus:border-primary/50 backdrop-blur-sm h-11"
                            />
                        </div>

                        {view === "signup" && (
                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="sr-only"
                                >
                                    Confirmer le mot de passe
                                </Label>
                                <PasswordInput
                                    id="confirmPassword"
                                    placeholder="Confirmer le mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                    minLength={6}
                                    className="bg-white/50 dark:bg-black/20 border-transparent focus:border-primary/50 backdrop-blur-sm h-11"
                                />
                            </div>
                        )}
                    </>
                )}

                {error && (
                    <Alert
                        variant={
                            error.includes("vérifier vos emails")
                                ? "default"
                                : "destructive"
                        }
                        className={
                            error.includes("vérifier vos emails")
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                    >
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : view === "forgot_password" ? (
                        <>
                            <Mail className="mr-2 h-4 w-4" /> Envoyer le lien
                        </>
                    ) : (
                        <>
                            {view === "signup" ? "S'inscrire" : "Se connecter"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center text-sm">
                {view === "forgot_password" ? (
                    <Button
                        variant="link"
                        className="p-0 h-auto font-semibold text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            setError("");
                            setView("signin");
                        }}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la
                        connexion
                    </Button>
                ) : (
                    <>
                        <span className="text-muted-foreground">
                            {view === "signin"
                                ? "Pas encore de compte ? "
                                : "Déjà un compte ? "}
                        </span>
                        <Button
                            variant="link"
                            className="p-0 h-auto font-semibold text-primary hover:underline underline-offset-4"
                            onClick={() => {
                                setError("");
                                setView(
                                    view === "signin" ? "signup" : "signin"
                                );
                            }}
                        >
                            {view === "signin" ? "S'inscrire" : "Se connecter"}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

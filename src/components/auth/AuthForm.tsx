"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
    initialSignUp?: boolean;
};

export default function AuthForm({ initialSignUp = false }: Props) {
    const [isSignUp, setIsSignUp] = useState(initialSignUp);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { error } = isSignUp
                ? await signUp(email, password, fullName)
                : await signIn(email, password);
            if (error) throw error;
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    {isSignUp ? "Créer un compte" : "Bon retour"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {isSignUp
                        ? "Entrez vos informations pour commencer"
                        : "Entrez vos identifiants pour accéder à votre espace"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="sr-only">
                            Nom complet
                        </Label>
                        <Input
                            id="fullName"
                            placeholder="Nom complet"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required={isSignUp}
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

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="sr-only">
                            Mot de passe
                        </Label>
                        {!isSignUp && (
                            <Button
                                variant="link"
                                size="sm"
                                className="px-0 h-auto font-normal text-xs text-muted-foreground hover:text-primary"
                                tabIndex={-1}
                            >
                                Mot de passe oublié ?
                            </Button>
                        )}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-white/50 dark:bg-black/20 border-transparent focus:border-primary/50 backdrop-blur-sm h-11"
                    />
                </div>

                {error && (
                    <Alert
                        variant="destructive"
                        className="bg-destructive/10 text-destructive border-destructive/20"
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
                    ) : (
                        <>
                            {isSignUp ? "S'inscrire" : "Se connecter"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">
                    {isSignUp ? "Déjà un compte ? " : "Pas encore de compte ? "}
                </span>
                <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-primary hover:underline underline-offset-4"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError("");
                    }}
                >
                    {isSignUp ? "Se connecter" : "S'inscrire"}
                </Button>
            </div>
        </div>
    );
}

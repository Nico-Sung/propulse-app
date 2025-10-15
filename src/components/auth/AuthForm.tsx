"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInputField from "@/components/design-system/form-input-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

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
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
                <FormInputField
                    id="fullName"
                    label="Nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    placeholder="Jean Dupont"
                />
            )}

            <FormInputField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jean@exemple.fr"
            />

            <FormInputField
                id="password"
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
            />

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading
                    ? "Chargement..."
                    : isSignUp
                    ? "Créer un compte"
                    : "Se connecter"}
            </Button>

            <div className="text-sm text-center">
                <Button
                    variant={"link"}
                    type="button"
                    className="text-sm text-muted-foreground underline"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError("");
                    }}
                >
                    {isSignUp
                        ? "Déjà un compte ? Se connecter"
                        : "Pas de compte ? Créer un compte"}
                </Button>
            </div>
        </form>
    );
}

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProfileTab() {
    const { user } = useAuth();
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("full_name")
                    .eq("id", user.id)
                    .single();

                if (error && error.code !== "PGRST116") throw error;

                if (data) {
                    setFullName(
                        (data as { full_name: string | null }).full_name || ""
                    );
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user]);

    const updateProfile = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any).from("profiles").upsert({
                id: user.id,
                full_name: fullName,
                email: user.email!,
                updated_at: new Date().toISOString(),
            });

            if (error) throw error;

            toast.success("Profil mis à jour avec succès !");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h3 className="text-xl font-semibold text-foreground">
                    Profil Public
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Gérez vos informations personnelles et votre identité sur la
                    plateforme.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-6 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 shadow-sm">
                    <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-white/10 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-2xl font-bold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-white/80 dark:bg-black/50 backdrop-blur-md"
                        >
                            Changer l&apos;avatar
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            JPG, GIF ou PNG. 1MB max.
                        </p>
                    </div>
                </div>

                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                value={user?.email}
                                disabled
                                className="pl-9 bg-muted/30 border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="fullname">Nom complet</Label>
                        <Input
                            id="fullname"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Votre nom"
                            className="bg-white/50 dark:bg-black/10 backdrop-blur-sm focus:bg-white dark:focus:bg-black/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/30">
                <Button
                    onClick={updateProfile}
                    disabled={saving}
                    className="bg-primary/90 hover:bg-primary shadow-md min-w-[120px]"
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Sauvegarder"
                    )}
                </Button>
            </div>
        </div>
    );
}

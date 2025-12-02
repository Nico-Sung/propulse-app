"use client";

import { supabase } from "@/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (
        email: string,
        password: string,
        fullName: string
    ) => Promise<{
        data?: { user: User | null; session: Session | null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: any;
    }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (
        email: string,
        password: string,
        fullName: string
    ) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) return { data, error };

        if (data.user && !data.session) {
            return { data, error: null };
        }

        if (data.user && data.session) {
            const now = new Date().toISOString();
            const profile = {
                id: data.user.id,
                email: data.user.email!,
                full_name: fullName ?? null,
                created_at: now,
                updated_at: now,
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: profileError } = await (supabase as any)
                .from("profiles")
                .upsert([profile], { onConflict: "id" });

            if (!profileError) router.push("/dashboard");
            return { data, error: profileError };
        }

        return { data, error };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (!error) router.push("/dashboard");
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth");
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, signUp, signIn, signOut }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

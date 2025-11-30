"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { toast } from "sonner";

type Theme = "light" | "dark";
type ViewMode = "normal" | "compact";
type KanbanSort = "date_desc" | "date_asc" | "name_asc";

type UserPreference = Database["public"]["Tables"]["user_preferences"]["Row"];

interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    kanbanSort: KanbanSort;
    setKanbanSort: (sort: KanbanSort) => void;
    loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    const [theme, setThemeState] = useState<Theme>("light");
    const [viewMode, setViewModeState] = useState<ViewMode>("normal");
    const [kanbanSort, setKanbanSortState] = useState<KanbanSort>("date_desc");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const loadPreferences = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("user_preferences")
                    .select("*")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (data) {
                    const prefs = data as UserPreference;
                    if (prefs.theme) applyTheme(prefs.theme as Theme);
                    if (prefs.view_mode)
                        setViewModeState(prefs.view_mode as ViewMode);
                    if (prefs.kanban_sort)
                        setKanbanSortState(prefs.kanban_sort as KanbanSort);
                } else if (!error) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await (supabase as any).from("user_preferences").insert({
                        user_id: user.id,
                        theme: "light",
                        view_mode: "normal",
                        kanban_sort: "date_desc",
                    });
                } else {
                    console.error(
                        "Erreur lors du chargement des préférences",
                        error
                    );
                }
            } catch (err) {
                console.error("Erreur chargement préférences:", err);
            } finally {
                setLoading(false);
            }
        };

        loadPreferences();
    }, [user]);

    const applyTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        const root = document.documentElement;
        if (newTheme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    };

    const savePreference = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (key: string, value: any) => {
            if (!user) return;
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { error } = await (supabase as any)
                    .from("user_preferences")
                    .upsert(
                        {
                            user_id: user.id,
                            [key]: value,
                            updated_at: new Date().toISOString(),
                        },
                        { onConflict: "user_id" }
                    );

                if (error) throw error;
            } catch (err) {
                console.error(`Erreur sauvegarde ${key}:`, err);
                toast.error("Erreur de sauvegarde des préférences");
            }
        },
        [user]
    );

    const setTheme = (newTheme: Theme) => {
        applyTheme(newTheme);
        savePreference("theme", newTheme);
    };

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    };

    const setViewMode = (newMode: ViewMode) => {
        setViewModeState(newMode);
        savePreference("view_mode", newMode);
    };

    const setKanbanSort = (newSort: KanbanSort) => {
        setKanbanSortState(newSort);
        savePreference("kanban_sort", newSort);
    };

    return (
        <SettingsContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
                viewMode,
                setViewMode,
                kanbanSort,
                setKanbanSort,
                loading,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettingsContext() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error(
            "useSettingsContext must be used within a SettingsProvider"
        );
    }
    return context;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ViewMode = "normal" | "compact";

interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [viewMode, setViewModeState] = useState<ViewMode>("normal");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedTheme = localStorage.getItem("theme") as Theme;
        if (storedTheme) {
            setThemeState(storedTheme);
            if (storedTheme === "dark")
                document.documentElement.classList.add("dark");
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setThemeState("dark");
            document.documentElement.classList.add("dark");
        }

        const storedViewMode = localStorage.getItem("view_mode") as ViewMode;
        if (storedViewMode) {
            setViewModeState(storedViewMode);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("theme", newTheme);
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const setViewMode = (newMode: ViewMode) => {
        setViewModeState(newMode);
        localStorage.setItem("view_mode", newMode);
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <SettingsContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
                viewMode,
                setViewMode,
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

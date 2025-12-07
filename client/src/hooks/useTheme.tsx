"use client";

import { useSettingsContext } from "@/contexts/SettingsContext";

export function useTheme() {
    const { theme, setTheme, toggleTheme } = useSettingsContext();
    return { theme, setTheme, toggle: toggleTheme };
}

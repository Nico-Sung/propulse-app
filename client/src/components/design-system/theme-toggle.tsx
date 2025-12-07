"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggle } = useTheme();
    return (
        <Button
            variant="ghost"
            size="icon"
            className={className}
            onClick={(e) => {
                e.stopPropagation();
                toggle();
            }}
            aria-label="Basculer thème"
        >
            {theme === "dark" ? (
                <Sun className="w-4 h-4" />
            ) : (
                <Moon className="w-4 h-4" />
            )}
        </Button>
    );
}

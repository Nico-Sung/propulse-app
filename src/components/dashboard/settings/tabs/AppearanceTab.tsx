"use client";

import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { Layout, List, Moon, Sun } from "lucide-react";

export function AppearanceTab() {
    const { theme, setTheme, viewMode, setViewMode } = useSettings();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h3 className="text-xl font-semibold text-foreground">
                    Apparence
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Personnalisez l&apos;interface pour réduire la fatigue
                    visuelle.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Thème</h4>
                <div className="grid grid-cols-2 gap-6">
                    <button
                        onClick={() => setTheme("light")}
                        className={cn(
                            "group flex flex-col gap-3 p-3 rounded-2xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary text-left",
                            theme === "light"
                                ? "border-primary bg-primary/5"
                                : "border-transparent bg-secondary/60 hover:bg-secondary/90"
                        )}
                    >
                        <div className="w-full aspect-[4/3] rounded-xl bg-[#f4f4f5] border shadow-sm flex items-center justify-center group-hover:scale-[1.02] transition-transform overflow-hidden relative">
                            <div className="absolute inset-x-4 top-4 bottom-0 bg-white rounded-t-lg shadow-md border border-b-0 p-2">
                                <div className="space-y-2">
                                    <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                                    <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm z-10">
                                <Sun className="w-4 h-4 text-orange-500" />
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-semibold block">
                                Clair
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Idéal pour la journée
                            </span>
                        </div>
                    </button>

                    <button
                        onClick={() => setTheme("dark")}
                        className={cn(
                            "group flex flex-col gap-3 p-3 rounded-2xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary text-left",
                            theme === "dark"
                                ? "border-primary bg-primary/5"
                                : "border-transparent bg-white/50 hover:bg-white/80"
                        )}
                    >
                        <div className="w-full aspect-[4/3] rounded-xl bg-[#09090b] border border-white/10 shadow-sm flex items-center justify-center group-hover:scale-[1.02] transition-transform overflow-hidden relative">
                            <div className="absolute inset-x-4 top-4 bottom-0 bg-zinc-900 rounded-t-lg shadow-md border border-white/10 border-b-0 p-2">
                                <div className="space-y-2">
                                    <div className="h-2 w-1/2 bg-zinc-800 rounded-full" />
                                    <div className="h-2 w-3/4 bg-zinc-800 rounded-full" />
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-zinc-800 p-1.5 rounded-full shadow-sm z-10 border border-white/10">
                                <Moon className="w-4 h-4 text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-semibold block">
                                Sombre
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Moins de fatigue oculaire
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/40">
                <h4 className="text-sm font-medium text-foreground">
                    Densité d&apos;affichage
                </h4>
                <div className="grid grid-cols-2 gap-6">
                    <button
                        onClick={() => setViewMode("normal")}
                        className={cn(
                            "group flex flex-col gap-3 p-3 rounded-2xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary text-left",
                            viewMode === "normal"
                                ? "border-primary bg-primary/5"
                                : "border-transparent bg-secondary/60 hover:bg-secondary/90"
                        )}
                    >
                        <div className="w-full h-24 rounded-xl bg-white/50 dark:bg-white/5 border shadow-sm flex items-center justify-center group-hover:scale-[1.02] transition-transform relative overflow-hidden">
                            <div className="flex flex-col gap-2 w-3/4 opacity-80">
                                <div className="h-8 w-full bg-foreground/10 rounded-md" />
                                <div className="h-4 w-2/3 bg-foreground/10 rounded-md" />
                            </div>
                            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-primary/10 text-primary">
                                <Layout className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-semibold block">
                                Normal
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Cartes détaillées
                            </span>
                        </div>
                    </button>

                    <button
                        onClick={() => setViewMode("compact")}
                        className={cn(
                            "group flex flex-col gap-3 p-3 rounded-2xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary text-left",
                            viewMode === "compact"
                                ? "border-primary bg-primary/5"
                                : "border-transparent bg-secondary/60 hover:bg-secondary/90"
                        )}
                    >
                        <div className="w-full h-24 rounded-xl bg-white/50 dark:bg-white/5 border shadow-sm flex items-center justify-center group-hover:scale-[1.02] transition-transform relative overflow-hidden">
                            <div className="flex flex-col gap-1 w-3/4 opacity-80">
                                <div className="h-3 w-full bg-foreground/10 rounded-sm" />
                                <div className="h-3 w-full bg-foreground/10 rounded-sm" />
                                <div className="h-3 w-full bg-foreground/10 rounded-sm" />
                            </div>
                            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-primary/10 text-primary">
                                <List className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-semibold block">
                                Compact
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Plus d&apos;éléments visibles
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

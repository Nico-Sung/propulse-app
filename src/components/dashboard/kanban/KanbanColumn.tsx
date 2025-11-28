"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
    ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";
import { PlusCircle, RotateCw, SortAsc, Palette, Plus } from "lucide-react";
import { useMemo } from "react";
import { Database } from "@/lib/database.types";
import { ApplicationCard } from "./ApplicationCard";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export type SortOption = "date_desc" | "date_asc" | "name_asc";
export type ViewMode = "normal" | "compact";

interface KanbanColumnProps {
    column: { id: string; label: string; color: string };
    applications: Application[];
    onCardClick: (app: Application) => void;
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    onAddApplication: () => void;
}

export function KanbanColumn({
    column,
    applications,
    onCardClick,
    sortOption,
    onSortChange,
    viewMode,
    onViewModeChange,
    onAddApplication,
}: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });

    const sortedApplications = useMemo(() => {
        const apps = [...applications];
        switch (sortOption) {
            case "date_desc":
                return apps.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );
            case "date_asc":
                return apps.sort(
                    (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                );
            case "name_asc":
                return apps.sort((a, b) =>
                    a.company_name.localeCompare(b.company_name)
                );
            default:
                return apps;
        }
    }, [applications, sortOption]);

    const sortedIds = useMemo(
        () => sortedApplications.map((app) => app.id),
        [sortedApplications]
    );

    const badgeColorMap: Record<string, string> = {
        to_apply:
            "bg-slate-200/50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
        applied:
            "bg-blue-200/50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
        waiting:
            "bg-orange-200/50 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
        interview:
            "bg-purple-200/50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
        offer: "bg-emerald-200/50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
        rejected:
            "bg-red-200/50 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    };

    const columnBgMap: Record<string, string> = {
        to_apply:
            "bg-slate-50/40 dark:bg-slate-900/20 border-slate-100/50 dark:border-slate-800/50",
        applied:
            "bg-blue-50/30 dark:bg-blue-900/10 border-blue-100/30 dark:border-blue-900/20",
        waiting:
            "bg-orange-50/30 dark:bg-orange-900/10 border-orange-100/30 dark:border-orange-900/20",
        interview:
            "bg-purple-50/30 dark:bg-purple-900/10 border-purple-100/30 dark:border-purple-900/20",
        offer: "bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100/30 dark:border-emerald-900/20",
        rejected:
            "bg-red-50/30 dark:bg-red-900/10 border-red-100/30 dark:border-red-900/20",
    };

    const buttonColorMap: Record<string, string> = {
        to_apply:
            "hover:bg-slate-500/10 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
        applied:
            "hover:bg-blue-500/10 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200",
        waiting:
            "hover:bg-orange-500/10 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200",
        interview:
            "hover:bg-purple-500/10 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200",
        offer: "hover:bg-emerald-500/10 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200",
        rejected:
            "hover:bg-red-500/10 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200",
    };

    return (
        <div className="flex flex-col w-80 h-full shrink-0">
            <div className="flex items-center justify-between px-3 mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground/80 tracking-tight">
                        {column.label}
                    </h3>
                    <span
                        className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm",
                            badgeColorMap[column.id] ||
                                "bg-muted text-muted-foreground"
                        )}
                    >
                        {applications.length}
                    </span>
                </div>
            </div>

            <ContextMenu>
                <ContextMenuTrigger className="flex-1 flex flex-col h-full">
                    <div
                        ref={setNodeRef}
                        className={cn(
                            "flex-1 rounded-2xl transition-all duration-300 p-2 border h-fit min-h-[150px] backdrop-blur-[2px] flex flex-col gap-3",
                            columnBgMap[column.id] ||
                                "bg-muted/20 border-transparent",
                            isOver
                                ? "ring-2 ring-primary/20 bg-background/60"
                                : ""
                        )}
                    >
                        <SortableContext
                            items={sortedIds}
                            strategy={rectSortingStrategy}
                        >
                            {sortedApplications.map((app) => (
                                <ApplicationCard
                                    key={app.id}
                                    application={app}
                                    onCardClick={() => onCardClick(app)}
                                    compact={viewMode === "compact"}
                                />
                            ))}
                        </SortableContext>

                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start h-9 px-2 text-sm mt-1 transition-all duration-200 backdrop-blur-sm bg-white/30 dark:bg-black/20 border border-transparent hover:border-black/5 dark:hover:border-white/5",
                                buttonColorMap[column.id] ||
                                    "text-muted-foreground hover:text-primary hover:bg-background/50"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddApplication();
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une carte
                        </Button>
                    </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-56 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1">
                    <ContextMenuLabel className="text-xs text-muted-foreground uppercase font-bold px-2 py-1.5">
                        Affichage & Tri
                    </ContextMenuLabel>

                    <ContextMenuItem
                        onClick={onAddApplication}
                        className="rounded-md focus:bg-primary/10 focus:text-primary"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une carte
                    </ContextMenuItem>

                    <ContextMenuSub>
                        <ContextMenuSubTrigger className="rounded-md focus:bg-primary/10 focus:text-primary">
                            <SortAsc className="mr-2 h-4 w-4" />
                            Trier par...
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1">
                            <ContextMenuCheckboxItem
                                checked={sortOption === "date_desc"}
                                onCheckedChange={() =>
                                    onSortChange("date_desc")
                                }
                                className="rounded-md focus:bg-primary/10 focus:text-primary"
                            >
                                Date d&apos;ajout (Récent)
                            </ContextMenuCheckboxItem>
                            <ContextMenuCheckboxItem
                                checked={sortOption === "date_asc"}
                                onCheckedChange={() => onSortChange("date_asc")}
                                className="rounded-md focus:bg-primary/10 focus:text-primary"
                            >
                                Date d&apos;ajout (Ancien)
                            </ContextMenuCheckboxItem>
                            <ContextMenuCheckboxItem
                                checked={sortOption === "name_asc"}
                                onCheckedChange={() => onSortChange("name_asc")}
                                className="rounded-md focus:bg-primary/10 focus:text-primary"
                            >
                                Nom (A-Z)
                            </ContextMenuCheckboxItem>
                        </ContextMenuSubContent>
                    </ContextMenuSub>

                    <ContextMenuSeparator className="bg-border/50" />

                    <ContextMenuSub>
                        <ContextMenuSubTrigger className="rounded-md focus:bg-primary/10 focus:text-primary">
                            <Palette className="mr-2 h-4 w-4" />
                            Apparence
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1">
                            <ContextMenuCheckboxItem
                                checked={viewMode === "normal"}
                                onCheckedChange={() =>
                                    onViewModeChange("normal")
                                }
                                className="rounded-md focus:bg-primary/10 focus:text-primary"
                            >
                                Mode Normal
                            </ContextMenuCheckboxItem>
                            <ContextMenuCheckboxItem
                                checked={viewMode === "compact"}
                                onCheckedChange={() =>
                                    onViewModeChange("compact")
                                }
                                className="rounded-md focus:bg-primary/10 focus:text-primary"
                            >
                                Mode Compact
                            </ContextMenuCheckboxItem>
                        </ContextMenuSubContent>
                    </ContextMenuSub>

                    <ContextMenuItem
                        onClick={() => window.location.reload()}
                        className="rounded-md focus:bg-primary/10 focus:text-primary"
                    >
                        <RotateCw className="mr-2 h-4 w-4" />
                        Rafraîchir la liste
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
}

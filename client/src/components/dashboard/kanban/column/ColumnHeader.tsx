"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOption } from "@/lib/kanban-utils";
import { cn } from "@/lib/utils";
import {
    MoreHorizontal,
    Move,
    Palette,
    PlusCircle,
    RotateCw,
    SortAsc,
} from "lucide-react";

interface ColumnHeaderProps {
    label: string;
    count: number;
    badgeColor: string;
    sortOption: SortOption;
    onSortChange: (opt: SortOption) => void;
    viewMode: "normal" | "compact";
    onViewModeChange: (mode: "normal" | "compact") => void;
    onAdd: () => void;
    onRefresh: () => void;
}

export function ColumnHeader({
    label,
    count,
    badgeColor,
    sortOption,
    onSortChange,
    viewMode,
    onViewModeChange,
    onAdd,
    onRefresh,
}: ColumnHeaderProps) {
    return (
        <div className="flex items-center justify-between px-3 mb-3">
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground/80 tracking-tight">
                    {label}
                </h3>
                <span
                    className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm",
                        badgeColor
                    )}
                >
                    {count}
                </span>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Options de colonne</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une carte
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <SortAsc className="mr-2 h-4 w-4" />
                            Trier par...
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuCheckboxItem
                                checked={sortOption === "manual"}
                                onCheckedChange={() => onSortChange("manual")}
                            >
                                <Move className="mr-2 h-3 w-3" />
                                Manuel (Drag & Drop)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={sortOption === "date_desc"}
                                onCheckedChange={() =>
                                    onSortChange("date_desc")
                                }
                            >
                                Date d&apos;ajout (Récent)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={sortOption === "date_asc"}
                                onCheckedChange={() => onSortChange("date_asc")}
                            >
                                Date d&apos;ajout (Ancien)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={sortOption === "name_asc"}
                                onCheckedChange={() => onSortChange("name_asc")}
                            >
                                Nom (A-Z)
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Palette className="mr-2 h-4 w-4" />
                            Apparence
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuCheckboxItem
                                checked={viewMode === "normal"}
                                onCheckedChange={() =>
                                    onViewModeChange("normal")
                                }
                            >
                                Mode Normal
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={viewMode === "compact"}
                                onCheckedChange={() =>
                                    onViewModeChange("compact")
                                }
                            >
                                Mode Compact
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={onRefresh}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        Rafraîchir la liste
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

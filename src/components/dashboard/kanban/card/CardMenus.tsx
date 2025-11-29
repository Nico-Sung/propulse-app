"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TAG_COLORS, useKanbanTags } from "@/hooks/useKanbanTags";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Check,
    Copy,
    Edit,
    ExternalLink,
    MoreHorizontal,
    Plus,
    Tag as TagIcon,
    Trash2,
    X,
} from "lucide-react";
import { useState } from "react";
import { COLUMN_LABELS } from "../../../../hooks/useApplicationActions";

import {
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuProps {
    applicationId: string;
    status: string;
    jobUrl: string;
    onCardClick: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: any;
    tagsData: ReturnType<typeof useKanbanTags>;
    openDeleteDialog: () => void;
}

const MenuItems = ({
    applicationId,
    status,
    jobUrl,
    onCardClick,
    actions,
    tagsData,
    openDeleteDialog,
    isContext = false,
}: MenuProps & { isContext?: boolean }) => {
    const { allTags, getAppTags, toggleTagForApp, createTag, deleteTag } =
        tagsData;
    const appTags = getAppTags(applicationId);

    const [newTagLabel, setNewTagLabel] = useState("");
    const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);
    const [isCreatingTag, setIsCreatingTag] = useState(false);

    const handleCreateTag = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!newTagLabel.trim()) return;
        createTag(newTagLabel, newTagColor);
        setNewTagLabel("");
        setIsCreatingTag(false);
    };

    const Item = isContext ? ContextMenuItem : DropdownMenuItem;
    const Sub = isContext ? ContextMenuSub : DropdownMenuSub;
    const SubTrigger = isContext
        ? ContextMenuSubTrigger
        : DropdownMenuSubTrigger;
    const SubContent = isContext
        ? ContextMenuSubContent
        : DropdownMenuSubContent;
    const RadioGroup = isContext
        ? ContextMenuRadioGroup
        : DropdownMenuRadioGroup;
    const RadioItem = isContext ? ContextMenuRadioItem : DropdownMenuRadioItem;
    const Separator = isContext ? ContextMenuSeparator : DropdownMenuSeparator;

    return (
        <>
            <Item
                onClick={(e) => {
                    e.stopPropagation();
                    onCardClick();
                }}
                className="font-medium rounded-md focus:bg-primary/10 focus:text-primary"
            >
                <Edit className="mr-2 h-4 w-4" /> Ouvrir la carte
            </Item>

            <Separator className="bg-border/50" />

            <Sub>
                <SubTrigger className="rounded-md focus:bg-primary/10 focus:text-primary z-50">
                    <TagIcon className="mr-2 h-4 w-4" /> Étiquettes
                </SubTrigger>
                <SubContent className="w-64 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl z-[60]">
                    <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
                        Sélectionner des étiquettes
                    </div>

                    {allTags.map((tag) => (
                        <div
                            key={tag.id}
                            className="flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded-md cursor-pointer group/item transition-colors z-50"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleTagForApp(applicationId, tag.id);
                            }}
                        >
                            <div
                                className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                    appTags.some((t) => t.id === tag.id)
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-input"
                                )}
                            >
                                {appTags.some((t) => t.id === tag.id) && (
                                    <Check className="w-3 h-3" />
                                )}
                            </div>
                            <div
                                className={cn(
                                    "w-3 h-3 rounded-full shadow-sm",
                                    tag.color
                                )}
                            />
                            <span className="text-sm flex-1">{tag.label}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTag(tag.id);
                                }}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}

                    <Separator className="my-2 bg-border/50" />

                    <div className="p-1 space-y-2">
                        {!isCreatingTag ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-7 hover:bg-muted/50"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsCreatingTag(true);
                                }}
                            >
                                <Plus className="w-3 h-3 mr-2" /> Créer une
                                étiquette
                            </Button>
                        ) : (
                            <div
                                className="space-y-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Input
                                    placeholder="Nom"
                                    className="h-8 text-xs bg-background/50"
                                    value={newTagLabel}
                                    onChange={(e) =>
                                        setNewTagLabel(e.target.value)
                                    }
                                    autoFocus
                                    onKeyDown={(e) => e.stopPropagation()}
                                />
                                <div className="flex gap-1 flex-wrap">
                                    {TAG_COLORS.map((c) => (
                                        <div
                                            key={c.value}
                                            className={cn(
                                                "w-4 h-4 rounded-full cursor-pointer transition-transform",
                                                c.value,
                                                newTagColor === c.value
                                                    ? "ring-2 ring-foreground scale-110"
                                                    : "hover:scale-110"
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNewTagColor(c.value);
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="h-7 text-xs w-full"
                                        onClick={handleCreateTag}
                                    >
                                        Créer
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsCreatingTag(false);
                                        }}
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </SubContent>
            </Sub>

            <Sub>
                <SubTrigger className="rounded-md focus:bg-primary/10 focus:text-primary">
                    <ArrowRight className="mr-2 h-4 w-4" /> Déplacer vers...
                </SubTrigger>
                <SubContent className="w-48 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1">
                    <RadioGroup value={status}>
                        {Object.entries(COLUMN_LABELS).map(([key, label]) => (
                            <RadioItem
                                key={key}
                                value={key}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    actions.handleMove(key);
                                }}
                                className="rounded-md focus:bg-primary/10 focus:text-primary"
                            >
                                {label}
                            </RadioItem>
                        ))}
                    </RadioGroup>
                </SubContent>
            </Sub>

            <Separator className="bg-border/50" />

            <Item
                onClick={(e) => {
                    e.stopPropagation();
                    actions.handleDuplicate();
                }}
                className="rounded-md focus:bg-primary/10 focus:text-primary"
            >
                <Copy className="mr-2 h-4 w-4" /> Dupliquer
            </Item>

            <Item
                onClick={(e) => {
                    e.stopPropagation();
                    actions.copyToClipboard(jobUrl);
                }}
                className="rounded-md focus:bg-primary/10 focus:text-primary"
            >
                <ExternalLink className="mr-2 h-4 w-4" /> Copier le lien
            </Item>

            <Separator className="bg-border/50" />

            <Item
                onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog();
                }}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-md"
            >
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </Item>
        </>
    );
};

export function CardDropdownMenu(props: MenuProps) {
    return (
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
            <DropdownMenuContent
                align="end"
                className="w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1 z-50"
            >
                <MenuItems {...props} isContext={false} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function CardContextMenuContentWrapper(props: MenuProps) {
    return (
        <ContextMenuContent className="w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1 z-50">
            <MenuItems {...props} isContext={true} />
        </ContextMenuContent>
    );
}

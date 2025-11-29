"use client";

import ConfirmationDialog from "@/components/design-system/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TAG_COLORS, useKanbanTags } from "@/hooks/useKanbanTags";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ArrowRight,
    Building2,
    CalendarClock,
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
import { toast } from "sonner";

type Application = Database["public"]["Tables"]["applications"]["Row"];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"];

const COLUMN_LABELS = {
    to_apply: "À postuler",
    applied: "Candidature envoyée",
    waiting: "En attente",
    interview: "Entretien",
    offer: "Offre",
    rejected: "Refusé",
};

export function ApplicationCard({
    application,
    onCardClick,
    compact = false,
    tagsData,
}: {
    application: Application;
    onCardClick: () => void;
    compact?: boolean;
    tagsData: ReturnType<typeof useKanbanTags>;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: application.id });

    const { allTags, getAppTags, toggleTagForApp, createTag, deleteTag } =
        tagsData;
    const appTags = getAppTags(application.id);

    const [newTagLabel, setNewTagLabel] = useState("");
    const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);
    const [isCreatingTag, setIsCreatingTag] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const [showDialog, setShowDialog] = useState(false);

    const handleDelete = async () => {
        const { error } = await supabase
            .from("applications")
            .delete()
            .eq("id", application.id);
        if (error) {
            toast.error("Erreur lors de la suppression");
            return;
        }
        toast.success("Candidature supprimée");
        window.location.reload();
    };

    const handleDuplicate = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from("applications").insert({
            user_id: application.user_id,
            company_name: application.company_name,
            position_title: `${application.position_title} (Copie)`,
            job_description: application.job_description,
            status: application.status,
            application_date: application.application_date,
            last_contact_date: application.last_contact_date,
            notes: application.notes,
            job_url: application.job_url,
            contract_type: application.contract_type,
            deadline: application.deadline,
            interview_date: application.interview_date,
            salary_range: application.salary_range,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        if (error) {
            console.error(error);
            toast.error("Erreur lors de la duplication");
        } else {
            toast.success("Candidature dupliquée");
            window.location.reload();
        }
    };

    const handleMove = async (status: string) => {
        if (status === application.status) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("applications")
            .update({
                status: status,
                updated_at: new Date().toISOString(),
            })
            .eq("id", application.id);

        if (error) {
            toast.error("Erreur lors du déplacement");
        } else {
            toast.success(
                `Déplacé vers ${
                    COLUMN_LABELS[status as keyof typeof COLUMN_LABELS]
                }`
            );
            window.location.reload();
        }
    };

    const handleCreateTag = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!newTagLabel.trim()) return;
        createTag(newTagLabel, newTagColor);
        setNewTagLabel("");
        setIsCreatingTag(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papier");
    };

    const getDeadlineText = () => {
        if (!application.deadline) return null;
        const diff =
            new Date(application.deadline).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        if (days < 0) return "Expiré";
        if (days === 0) return "Aujourd'hui";
        return `${days}j restants`;
    };

    const deadlineText = getDeadlineText();

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="touch-none"
            >
                <ContextMenu>
                    <ContextMenuTrigger>
                        <div
                            className={cn(
                                "group relative flex flex-col gap-2 rounded-xl transition-all duration-300",
                                "glass-card",
                                isDragging &&
                                    "shadow-2xl scale-105 ring-2 ring-primary/50 rotate-2 z-50 cursor-grabbing bg-white/90 dark:bg-black/80",
                                compact ? "p-3" : "p-4"
                            )}
                            onClick={onCardClick}
                        >
                            {appTags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-1">
                                    {appTags.map((tag) => (
                                        <div
                                            key={tag.id}
                                            className={cn(
                                                "h-1.5 rounded-full shadow-sm",
                                                tag.color,
                                                compact
                                                    ? "w-4"
                                                    : "px-2 h-5 flex items-center"
                                            )}
                                            title={tag.label}
                                        >
                                            {!compact && (
                                                <span className="text-[10px] font-bold text-white px-1 truncate max-w-[100px] drop-shadow-sm">
                                                    {tag.label}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 min-w-0">
                                    {!compact && (
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 backdrop-blur-sm">
                                            <Building2 className="h-4 w-4" />
                                        </div>
                                    )}
                                    <span
                                        className={cn(
                                            "font-medium text-muted-foreground uppercase tracking-wider truncate",
                                            compact ? "text-[10px]" : "text-xs"
                                        )}
                                    >
                                        {application.company_name}
                                    </span>
                                </div>

                                {!compact && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                align="end"
                                                className="w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1"
                                            >
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onCardClick();
                                                    }}
                                                    className="font-medium rounded-md focus:bg-primary/10 focus:text-primary"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Ouvrir la carte
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator className="bg-border/50" />

                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="rounded-md focus:bg-primary/10 focus:text-primary">
                                                        <TagIcon className="mr-2 h-4 w-4" />
                                                        Étiquettes
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent className="w-64 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl">
                                                        <DropdownMenuLabel>
                                                            Sélectionner des
                                                            étiquettes
                                                        </DropdownMenuLabel>
                                                        {allTags.map((tag) => (
                                                            <div
                                                                key={tag.id}
                                                                className="flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded-md cursor-pointer group/item transition-colors"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    toggleTagForApp(
                                                                        application.id,
                                                                        tag.id
                                                                    );
                                                                }}
                                                            >
                                                                <div
                                                                    className={cn(
                                                                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                                        appTags.some(
                                                                            (
                                                                                t
                                                                            ) =>
                                                                                t.id ===
                                                                                tag.id
                                                                        )
                                                                            ? "bg-primary border-primary text-primary-foreground"
                                                                            : "border-input"
                                                                    )}
                                                                >
                                                                    {appTags.some(
                                                                        (t) =>
                                                                            t.id ===
                                                                            tag.id
                                                                    ) && (
                                                                        <Check className="w-3 h-3" />
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className={cn(
                                                                        "w-3 h-3 rounded-full shadow-sm",
                                                                        tag.color
                                                                    )}
                                                                />
                                                                <span className="text-sm flex-1">
                                                                    {tag.label}
                                                                </span>
                                                            </div>
                                                        ))}

                                                        <DropdownMenuSeparator className="my-2 bg-border/50" />

                                                        <div className="p-1 space-y-2">
                                                            {!isCreatingTag && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="w-full justify-start text-xs h-7 hover:bg-muted/50"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setIsCreatingTag(
                                                                            true
                                                                        );
                                                                    }}
                                                                >
                                                                    <Plus className="w-3 h-3 mr-2" />
                                                                    Créer une
                                                                    étiquette
                                                                </Button>
                                                            )}
                                                            {isCreatingTag && (
                                                                <div className="space-y-2">
                                                                    <Input
                                                                        placeholder="Nom"
                                                                        className="h-8 text-xs"
                                                                        value={
                                                                            newTagLabel
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setNewTagLabel(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            e.stopPropagation()
                                                                        }
                                                                    />
                                                                    <div className="flex gap-1 flex-wrap">
                                                                        {TAG_COLORS.map(
                                                                            (
                                                                                c
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        c.value
                                                                                    }
                                                                                    className={cn(
                                                                                        "w-4 h-4 rounded-full cursor-pointer",
                                                                                        c.value,
                                                                                        newTagColor ===
                                                                                            c.value &&
                                                                                            "ring-2 ring-foreground"
                                                                                    )}
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        e.stopPropagation();
                                                                                        setNewTagColor(
                                                                                            c.value
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    <Button
                                                                        size="sm"
                                                                        className="h-7 text-xs w-full"
                                                                        onClick={
                                                                            handleCreateTag
                                                                        }
                                                                    >
                                                                        Créer
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>

                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="rounded-md focus:bg-primary/10 focus:text-primary">
                                                        <ArrowRight className="mr-2 h-4 w-4" />
                                                        Déplacer vers...
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent className="w-48 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1">
                                                        <DropdownMenuRadioGroup
                                                            value={
                                                                application.status
                                                            }
                                                        >
                                                            {Object.entries(
                                                                COLUMN_LABELS
                                                            ).map(
                                                                ([
                                                                    key,
                                                                    label,
                                                                ]) => (
                                                                    <DropdownMenuRadioItem
                                                                        key={
                                                                            key
                                                                        }
                                                                        value={
                                                                            key
                                                                        }
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleMove(
                                                                                key
                                                                            );
                                                                        }}
                                                                        className="rounded-md focus:bg-primary/10 focus:text-primary"
                                                                    >
                                                                        {label}
                                                                    </DropdownMenuRadioItem>
                                                                )
                                                            )}
                                                        </DropdownMenuRadioGroup>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>

                                                <DropdownMenuSeparator className="bg-border/50" />

                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDuplicate();
                                                    }}
                                                    className="rounded-md focus:bg-primary/10 focus:text-primary"
                                                >
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Dupliquer
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyToClipboard(
                                                            application.job_url
                                                        );
                                                    }}
                                                    className="rounded-md focus:bg-primary/10 focus:text-primary"
                                                >
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Copier le lien
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator className="bg-border/50" />

                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowDialog(true);
                                                    }}
                                                    className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-md"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3
                                    className={cn(
                                        "font-bold text-foreground leading-tight line-clamp-2",
                                        compact
                                            ? "text-sm mb-0"
                                            : "text-base mb-1"
                                    )}
                                >
                                    {application.position_title}
                                </h3>
                                {!compact && (
                                    <p className="text-sm text-muted-foreground font-medium truncate">
                                        {application.contract_type || "Contrat"}
                                    </p>
                                )}
                            </div>

                            {!compact && (
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {deadlineText && (
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "text-[10px] px-1.5 h-5 font-medium gap-1 border-0 shadow-sm",
                                                deadlineText === "Expiré"
                                                    ? "bg-destructive/10 text-destructive"
                                                    : deadlineText ===
                                                      "Aujourd'hui"
                                                    ? "bg-warning/10 text-warning"
                                                    : "bg-secondary text-secondary-foreground"
                                            )}
                                        >
                                            <CalendarClock className="w-3 h-3" />
                                            {deadlineText}
                                        </Badge>
                                    )}

                                    {application.salary_range && (
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] px-1.5 h-5 border-border/50 text-muted-foreground font-normal bg-secondary backdrop-blur-sm"
                                        >
                                            {application.salary_range}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    </ContextMenuTrigger>

                    <ContextMenuContent className="w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1">
                        <ContextMenuItem
                            onClick={onCardClick}
                            className="font-medium rounded-md focus:bg-primary/10 focus:text-primary"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Ouvrir la carte
                        </ContextMenuItem>

                        <ContextMenuSeparator className="bg-border/50" />

                        <ContextMenuSub>
                            <ContextMenuSubTrigger className="rounded-md focus:bg-primary/10 focus:text-primary">
                                <TagIcon className="mr-2 h-4 w-4" />
                                Étiquettes
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent className="w-64 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl">
                                <ContextMenuLabel>
                                    Sélectionner des étiquettes
                                </ContextMenuLabel>
                                {allTags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded-md cursor-pointer group/item transition-colors"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleTagForApp(
                                                application.id,
                                                tag.id
                                            );
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                appTags.some(
                                                    (t) => t.id === tag.id
                                                )
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : "border-input"
                                            )}
                                        >
                                            {appTags.some(
                                                (t) => t.id === tag.id
                                            ) && <Check className="w-3 h-3" />}
                                        </div>
                                        <div
                                            className={cn(
                                                "w-3 h-3 rounded-full shadow-sm",
                                                tag.color
                                            )}
                                        />
                                        <span className="text-sm flex-1">
                                            {tag.label}
                                        </span>
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

                                <ContextMenuSeparator className="my-2 bg-border/50" />

                                {isCreatingTag ? (
                                    <div className="p-1 space-y-2 animate-in slide-in-from-top-1">
                                        <Input
                                            placeholder="Nom de l'étiquette"
                                            className="h-8 text-xs bg-background/50 border-border/50"
                                            value={newTagLabel}
                                            onChange={(e) =>
                                                setNewTagLabel(e.target.value)
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                        />
                                        <div className="flex gap-1 flex-wrap">
                                            {TAG_COLORS.map((c) => (
                                                <div
                                                    key={c.value}
                                                    className={cn(
                                                        "w-4 h-4 rounded-full cursor-pointer ring-offset-1 ring-offset-background transition-all shadow-sm",
                                                        c.value,
                                                        newTagColor === c.value
                                                            ? "ring-2 ring-foreground scale-110"
                                                            : "hover:scale-110"
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNewTagColor(c.value);
                                                    }}
                                                    title={c.name}
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
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-xs h-7 hover:bg-muted/50"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsCreatingTag(true);
                                        }}
                                    >
                                        <Plus className="w-3 h-3 mr-2" />
                                        Créer une étiquette
                                    </Button>
                                )}
                            </ContextMenuSubContent>
                        </ContextMenuSub>

                        <ContextMenuSub>
                            <ContextMenuSubTrigger className="rounded-md focus:bg-primary/10 focus:text-primary">
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Déplacer vers...
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent className="w-48 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-xl p-1">
                                <ContextMenuRadioGroup
                                    value={application.status}
                                >
                                    {Object.entries(COLUMN_LABELS).map(
                                        ([key, label]) => (
                                            <ContextMenuRadioItem
                                                key={key}
                                                value={key}
                                                onClick={() => handleMove(key)}
                                                className="rounded-md focus:bg-primary/10 focus:text-primary"
                                            >
                                                {label}
                                            </ContextMenuRadioItem>
                                        )
                                    )}
                                </ContextMenuRadioGroup>
                            </ContextMenuSubContent>
                        </ContextMenuSub>

                        <ContextMenuSeparator className="bg-border/50" />

                        <ContextMenuItem
                            onClick={handleDuplicate}
                            className="rounded-md focus:bg-primary/10 focus:text-primary"
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Dupliquer
                        </ContextMenuItem>

                        <ContextMenuItem
                            onClick={() => copyToClipboard(application.job_url)}
                            className="rounded-md focus:bg-primary/10 focus:text-primary"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Copier le lien
                        </ContextMenuItem>

                        <ContextMenuSeparator className="bg-border/50" />

                        <ContextMenuItem
                            onClick={() => setShowDialog(true)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-md"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            </div>

            <ConfirmationDialog
                title="Supprimer la candidature ?"
                description="Cette action est irréversible."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                open={showDialog}
                onOpenChange={setShowDialog}
                onConfirm={handleDelete}
            />
        </>
    );
}

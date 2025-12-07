"use client";

import { Badge } from "@/components/ui/badge";
import { Tag } from "@/hooks/useKanbanTags";
import { cn } from "@/lib/utils";
import { Building2, CalendarClock } from "lucide-react";

export function CardTags({ tags, compact }: { tags: Tag[]; compact: boolean }) {
    if (tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1 mb-1">
            {tags.map((tag) => (
                <div
                    key={tag.id}
                    className={cn(
                        "h-1.5 rounded-full shadow-sm",
                        tag.color,
                        compact ? "w-4" : "px-2 h-5 flex items-center"
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
    );
}

export function CardHeader({
    companyName,
    compact,
    menu,
}: {
    companyName: string;
    compact: boolean;
    menu?: React.ReactNode;
}) {
    return (
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
                    {companyName}
                </span>
            </div>

            {!compact && menu && (
                <div
                    className="transition-opacity -mr-2 -mt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 relative z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {menu}
                </div>
            )}
        </div>
    );
}

export function CardMainInfo({
    title,
    contract,
    compact,
}: {
    title: string;
    contract: string | null;
    compact: boolean;
}) {
    return (
        <div>
            <h3
                className={cn(
                    "font-bold text-foreground leading-tight line-clamp-2",
                    compact ? "text-sm mb-0" : "text-base mb-1"
                )}
            >
                {title}
            </h3>
            {!compact && (
                <p className="text-sm text-muted-foreground font-medium truncate">
                    {contract || "Contrat"}
                </p>
            )}
        </div>
    );
}

export function CardFooter({
    deadline,
    salaryRange,
    compact,
}: {
    deadline: string | null;
    salaryRange: string | null;
    compact: boolean;
}) {
    if (compact) return null;

    const getDeadlineText = () => {
        if (!deadline) return null;
        const diff = new Date(deadline).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        if (days < 0) return "Expiré";
        if (days === 0) return "Aujourd'hui";
        return `${days}j restants`;
    };

    const deadlineText = getDeadlineText();

    return (
        <div className="flex items-center gap-2 mt-1 flex-wrap">
            {deadlineText && (
                <Badge
                    variant="secondary"
                    className={cn(
                        "text-[10px] px-1.5 h-5 font-medium gap-1 border-0 shadow-sm",
                        deadlineText === "Expiré"
                            ? "bg-destructive/10 text-destructive"
                            : deadlineText === "Aujourd'hui"
                            ? "bg-warning/10 text-warning"
                            : "bg-secondary text-secondary-foreground"
                    )}
                >
                    <CalendarClock className="w-3 h-3" />
                    {deadlineText}
                </Badge>
            )}

            {salaryRange && (
                <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 h-5 border-border/50 text-muted-foreground font-normal bg-secondary backdrop-blur-sm"
                >
                    {salaryRange}
                </Badge>
            )}
        </div>
    );
}

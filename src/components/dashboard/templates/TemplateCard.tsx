"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import {
    Copy,
    Edit2,
    Mail,
    MessageCircle,
    MoreHorizontal,
    Share2,
    Trash2,
} from "lucide-react";

type Template = Database["public"]["Tables"]["templates"]["Row"];

interface TemplateCardProps {
    template: Template;
    onEdit: (template: Template) => void;
    onDelete: (id: string) => void;
    onCopy: (text: string) => void;
}

export const getCategoryBadge = (cat: string) => {
    switch (cat) {
        case "linkedin":
            return {
                style: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                icon: Share2,
                label: "LinkedIn",
            };
        case "sms":
            return {
                style: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                icon: MessageCircle,
                label: "SMS",
            };
        case "email":
            return {
                style: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                icon: Mail,
                label: "Email",
            };
        default:
            return {
                style: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                icon: MoreHorizontal,
                label: "Autre",
            };
    }
};

export function TemplateCard({
    template,
    onEdit,
    onDelete,
    onCopy,
}: TemplateCardProps) {
    const categoryStyle = getCategoryBadge(template.category);
    const Icon = categoryStyle.icon;

    return (
        <Card className="glass-card group flex flex-col h-full hover:shadow-lg transition-all border-l-4 border-l-primary/20 ">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div
                            className={cn(
                                "flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit",
                                categoryStyle.style
                            )}
                        >
                            <Icon className="w-3 h-3" />
                            {categoryStyle.label}
                        </div>
                        <CardTitle className="text-lg">
                            {template.title}
                        </CardTitle>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => onEdit(template)}
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onDelete(template.id)}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground italic flex-1 whitespace-pre-wrap border border-black/5 dark:border-white/5 font-mono leading-relaxed">
                    {template.content}
                </div>
                <Button
                    variant="secondary"
                    className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => onCopy(template.content)}
                >
                    <Copy className="w-4 h-4" /> Copier le texte
                </Button>
            </CardContent>
        </Card>
    );
}

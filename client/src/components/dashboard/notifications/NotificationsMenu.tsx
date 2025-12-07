"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    Bell,
    Calendar,
    Check,
    Inbox,
    Info,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export function NotificationsMenu() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    useEffect(() => {
        if (!user) return;

        const loadNotifications = async () => {
            const { data } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(20);

            if (data) setNotifications(data);
        };

        loadNotifications();

        const channel = supabase
            .channel("notifications-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setNotifications((prev) => [
                            payload.new as Notification,
                            ...prev,
                        ]);
                        toast.info("Nouvelle notification reçue");
                    } else if (payload.eventType === "UPDATE") {
                        setNotifications((prev) =>
                            prev.map((n) =>
                                n.id === payload.new.id
                                    ? (payload.new as Notification)
                                    : n
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const markAsRead = async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );

        await supabase
            .from("notifications")
            // @ts-expect-error TS ne reconnaît pas bien le type ici
            .update({ is_read: true })
            .eq("id", id);
    };

    const markAllAsRead = async () => {
        const unreadIds = notifications
            .filter((n) => !n.is_read)
            .map((n) => n.id);
        if (unreadIds.length === 0) return;

        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

        await supabase
            .from("notifications")
            // @ts-expect-error TS ne reconnaît pas bien le type ici
            .update({ is_read: true })
            .in("id", unreadIds);

        toast.success("Tout marqué comme lu");
    };

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        await supabase.from("notifications").delete().eq("id", id);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "interview":
                return <Calendar className="w-4 h-4 text-purple-600" />;
            case "reminder":
                return <AlertCircle className="w-4 h-4 text-amber-600" />;
            default:
                return <Info className="w-4 h-4 text-blue-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case "interview":
                return "bg-purple-500/10";
            case "reminder":
                return "bg-amber-500/10";
            default:
                return "bg-blue-500/10";
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full h-9 w-9 hover:bg-black/5 dark:hover:bg-white/10"
                >
                    <Bell
                        className={cn(
                            "h-5 w-5 transition-colors",
                            unreadCount > 0
                                ? "text-foreground"
                                : "text-muted-foreground"
                        )}
                    />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background animate-bounce" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 p-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                    <DropdownMenuLabel className="p-0 text-sm font-semibold flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                {unreadCount}
                            </span>
                        )}
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] px-2 text-muted-foreground hover:text-primary"
                            onClick={markAllAsRead}
                        >
                            Tout lire
                        </Button>
                    )}
                </div>

                <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground px-4">
                            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                                <Inbox className="w-6 h-6 opacity-40" />
                            </div>
                            <p className="text-sm font-medium text-foreground">
                                Rien pour le moment
                            </p>
                            <p className="text-xs opacity-70 mt-1 max-w-[200px]">
                                Vous êtes à jour ! Profitez de votre journée.
                            </p>
                        </div>
                    ) : (
                        <div className="py-1">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "group relative flex gap-3 px-4 py-3 transition-all border-b border-border/30 last:border-0 hover:bg-muted/40 cursor-default",
                                        !notif.is_read &&
                                            "bg-primary/5 hover:bg-primary/10"
                                    )}
                                    onClick={() =>
                                        !notif.is_read && markAsRead(notif.id)
                                    }
                                >
                                    <div
                                        className={cn(
                                            "p-2 rounded-full shrink-0 h-fit mt-0.5",
                                            getBgColor(notif.type)
                                        )}
                                    >
                                        {getIcon(notif.type)}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <p
                                                className={cn(
                                                    "text-sm leading-tight",
                                                    !notif.is_read
                                                        ? "font-semibold text-foreground"
                                                        : "font-medium text-muted-foreground"
                                                )}
                                            >
                                                {notif.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                                                {new Date(
                                                    notif.created_at
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                    }
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </div>

                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
                                        {!notif.is_read && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 rounded-md hover:text-primary hover:bg-primary/10"
                                                title="Marquer comme lu"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notif.id);
                                                }}
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 rounded-md hover:text-destructive hover:bg-destructive/10"
                                            title="Supprimer"
                                            onClick={(e) =>
                                                deleteNotification(notif.id, e)
                                            }
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

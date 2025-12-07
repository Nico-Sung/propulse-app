"use client";

import ThemeToggle from "@/components/design-system/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    Calendar,
    CheckSquare,
    FileText,
    LayoutDashboard,
    LogOut,
    MessageSquareQuote,
    Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NotificationsMenu } from "../notifications/NotificationsMenu";

const menuItems = [
    { id: "dashboard", label: "Pipeline", icon: LayoutDashboard },
    { id: "actions", label: "Focus", icon: CheckSquare },
    { id: "calendar", label: "Agenda", icon: Calendar },
    { id: "documents", label: "Docs", icon: FileText },
    { id: "templates", label: "Modèles", icon: MessageSquareQuote },
    { id: "analytics", label: "Stats", icon: BarChart3 },
];

interface Props {
    tab: string;
    pathname: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    signOut: () => Promise<void>;
    handleNavigate: (value: string) => void;
    setIsSettingsOpen: (open: boolean) => void;
}

export function DesktopHeader({
    tab,
    pathname,
    user,
    signOut,
    handleNavigate,
    setIsSettingsOpen,
}: Props) {
    return (
        <header className="hidden md:block sticky top-0 z-50 w-full border-b border-white/10 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300">
            <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-fit">
                    <Link
                        href="/dashboard"
                        className="group flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/20">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={18}
                                height={18}
                                className="object-contain brightness-0 invert"
                            />
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Propulse
                        </span>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center max-w-2xl mx-4">
                    <nav className="flex items-center p-1 bg-black/5 dark:bg-white/5 rounded-full backdrop-blur-md border border-white/10 dark:border-white/5 shadow-inner overflow-x-auto no-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = pathname.includes("/settings")
                                ? false
                                : tab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigate(item.id)}
                                    className={cn(
                                        "relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 outline-none whitespace-nowrap",
                                        "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5",
                                        isActive &&
                                            "text-foreground shadow-sm data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full shadow-sm -z-10 animate-in fade-in zoom-in-95 duration-200" />
                                    )}
                                    <item.icon
                                        className={cn(
                                            "w-3.5 h-3.5 transition-colors",
                                            isActive
                                                ? "text-primary"
                                                : "text-muted-foreground group-hover:text-foreground"
                                        )}
                                    />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-3 min-w-fit">
                    <NotificationsMenu />

                    <ThemeToggle className="hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors h-9 w-9" />

                    <div className="h-4 w-px bg-foreground/10 mx-1" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all p-0 overflow-hidden"
                            >
                                <Avatar className="h-full w-full">
                                    <AvatarImage src="" alt="Avatar" />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white text-xs font-bold">
                                        {user?.email
                                            ? user.email.charAt(0).toUpperCase()
                                            : "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-56 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 shadow-2xl p-1 rounded-xl mt-2"
                            align="end"
                            forceMount
                        >
                            <DropdownMenuLabel className="font-normal px-2 py-2">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none truncate">
                                        {user?.email}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Compte Gratuit
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-foreground/5" />

                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer"
                                    onClick={() => setIsSettingsOpen(true)}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Paramètres</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator className="bg-foreground/5" />

                            <DropdownMenuItem
                                onClick={signOut}
                                className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Déconnexion</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

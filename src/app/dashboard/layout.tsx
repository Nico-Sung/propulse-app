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
import Spinner from "@/components/ui/Spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
    DashboardTabProvider,
    useDashboardTab,
} from "@/contexts/DashboardTabContext";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    Calendar,
    CheckSquare,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type TabValue =
    | "dashboard"
    | "actions"
    | "calendar"
    | "analytics"
    | "documents";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <Spinner size={48} />
            </div>
        );
    }

    return (
        <DashboardTabProvider>
            <ShellLayout>{children}</ShellLayout>
        </DashboardTabProvider>
    );
}

function ShellLayout({ children }: { children: React.ReactNode }) {
    const { tab, setTab } = useDashboardTab();
    const { user, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const lastSegment = pathname.split("/").pop();
        const active = (lastSegment || "dashboard") as TabValue;

        const supportedTabs: TabValue[] = [
            "dashboard",
            "actions",
            "calendar",
            "analytics",
            "documents",
        ];

        if (active && supportedTabs.includes(active) && active !== tab) {
            setTab(active);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, setTab]);

    const handleNavigate = (value: string) => {
        setTab(value as TabValue);
        if (pathname !== "/dashboard") {
            router.push("/dashboard");
        }
    };

    const menuItems = [
        { id: "dashboard", label: "Pipeline", icon: LayoutDashboard },
        { id: "actions", label: "Focus", icon: CheckSquare },
        { id: "calendar", label: "Agenda", icon: Calendar },
        { id: "documents", label: "Docs", icon: FileText },
        { id: "analytics", label: "Stats", icon: BarChart3 },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 pb-20 md:pb-0">
            <header className="hidden md:block sticky top-0 z-50 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-xl backdrop-saturate-150 shadow-sm transition-all duration-300">
                <div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-fit">
                        <Link
                            href="/dashboard"
                            className="group flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/20">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={20}
                                    height={20}
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                Propulse
                            </span>
                        </Link>
                    </div>

                    <div className="flex-1 flex justify-center max-w-2xl mx-4">
                        <Tabs
                            value={pathname.includes("/settings") ? "" : tab}
                            onValueChange={handleNavigate}
                            className="w-full max-w-fit"
                        >
                            <TabsList className="bg-black/5 dark:bg-white/10 p-1 rounded-full border border-black/5 dark:border-white/5 h-10 shadow-inner">
                                {menuItems.map((item) => (
                                    <TabsTrigger
                                        key={item.id}
                                        value={item.id}
                                        className={cn(
                                            "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300",
                                            "data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                                            "hover:bg-white/50 dark:hover:bg-white/10 hover:text-foreground",
                                            "text-muted-foreground"
                                        )}
                                    >
                                        <item.icon className="w-3.5 h-3.5 mr-2 opacity-70" />
                                        {item.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex items-center gap-3 min-w-fit">
                        <ThemeToggle className="hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors" />

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
                                                ? user.email
                                                      .charAt(0)
                                                      .toUpperCase()
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
                                        asChild
                                        className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer"
                                    >
                                        <Link
                                            href="/dashboard/settings"
                                            className="w-full flex items-center"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer"
                                    >
                                        <Link
                                            href="/dashboard/settings"
                                            className="w-full flex items-center"
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Paramètres</span>
                                        </Link>
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

            <header className="md:hidden sticky top-0 z-40 w-full border-b border-white/10 bg-white/80 dark:bg-black/70 backdrop-blur-lg p-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={18}
                            height={18}
                            className="object-contain brightness-0 invert"
                        />
                    </div>
                    <span className="font-bold text-base tracking-tight">
                        Propulse
                    </span>
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle className="h-8 w-8 rounded-full" />
                    <Link href="/dashboard/settings">
                        <Avatar className="h-8 w-8 border-2 border-white/20">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white text-[10px]">
                                {user?.email?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </header>

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-white/85 dark:bg-black/85 backdrop-blur-xl pb-safe pt-1 px-2">
                <nav className="flex justify-around items-center h-16">
                    {menuItems.map((item) => {
                        const isActive =
                            tab === item.id && !pathname.includes("/settings");
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigate(item.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div
                                    className={cn(
                                        "p-1.5 rounded-xl transition-all",
                                        isActive
                                            ? "bg-primary/10"
                                            : "bg-transparent"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "w-5 h-5",
                                            isActive && "fill-current"
                                        )}
                                    />
                                </div>
                                <span className="text-[10px] font-medium">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <main className="flex-1 w-full max-w-[1800px] mx-auto overflow-hidden relative z-0">
                {children}
            </main>
        </div>
    );
}

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
    BarChart3,
    Briefcase,
    Calendar,
    CheckSquare,
    LayoutDashboard,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DashboardTabProvider,
    useDashboardTab,
} from "@/contexts/DashboardTabContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Spinner from "@/components/ui/Spinner";
import ThemeToggle from "@/components/design-system/theme-toggle";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
            <div className="min-h-screen flex items-center justify-center bg-background">
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
        const active = (pathname.split("/").pop() as any) || "dashboard";
        if (active && active !== tab) {
            setTab(active);
        }
    }, [pathname]);

    const handleNavigate = (value: string) => {
        setTab(value as any);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
            {/* Header Sticky avec effet Glass */}
            <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Logo avec un léger glow */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                            <div className="relative bg-background rounded-xl p-1.5 border border-border">
                                <Image
                                    src="/logo.png"
                                    alt="Propulse"
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-lg font-bold text-foreground tracking-tight">
                                Propulse
                            </h1>
                        </div>

                        {/* Navigation */}
                        <div className="hidden md:flex ml-8">
                            <Tabs
                                value={tab}
                                onValueChange={handleNavigate}
                                className="bg-transparent"
                            >
                                <TabsList className="bg-transparent h-9 p-0 gap-1 border-0">
                                    {[
                                        {
                                            id: "dashboard",
                                            label: "Pipeline",
                                            icon: LayoutDashboard,
                                        },
                                        {
                                            id: "actions",
                                            label: "Focus",
                                            icon: CheckSquare,
                                        },
                                        {
                                            id: "calendar",
                                            label: "Agenda",
                                            icon: Calendar,
                                        },
                                        {
                                            id: "analytics",
                                            label: "Données",
                                            icon: BarChart3,
                                        },
                                    ].map((item) => (
                                        <TabsTrigger
                                            key={item.id}
                                            value={item.id}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md transition-all hover:text-foreground hover:bg-muted/50 data-[state=active]:text-primary data-[state=active]:bg-primary/10 data-[state=active]:shadow-none border-0 h-auto"
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle className="hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" />

                        <div className="h-6 w-px bg-border/60 mx-1" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-border transition-all p-0 overflow-hidden"
                                >
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src="" alt="Avatar" />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
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
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.email ?? "Utilisateur"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Compte Gratuit
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={signOut}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Déconnexion</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden px-4 pb-3 overflow-x-auto no-scrollbar">
                    <Tabs
                        value={tab}
                        onValueChange={handleNavigate}
                        className="w-full"
                    >
                        <TabsList className="bg-muted/50 w-full justify-start border-0">
                            <TabsTrigger value="dashboard">
                                Pipeline
                            </TabsTrigger>
                            <TabsTrigger value="actions">Focus</TabsTrigger>
                            <TabsTrigger value="calendar">Agenda</TabsTrigger>
                            <TabsTrigger value="analytics">Données</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1600px] mx-auto overflow-hidden">
                {children}
            </main>
        </div>
    );
}

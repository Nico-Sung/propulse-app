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

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
        <div className=" flex flex-col bg-surface">
            <header className="bg-surface border-b border-default px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-xl p-2">
                            <Image
                                src="/logo.png"
                                alt="Propulse"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">
                                Propulse
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Votre copilote de carrière
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="" alt="Avatar" />
                                        <AvatarFallback>
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
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={signOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Déconnexion</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <nav className="bg-none border-b border-default px-6">
                <Tabs value={tab} onValueChange={handleNavigate}>
                    <TabsList className="bg-none-important no-scrollbar">
                        <TabsTrigger value="dashboard">
                            <LayoutDashboard /> Pipeline
                        </TabsTrigger>
                        <TabsTrigger value="actions">
                            <CheckSquare />
                            Actions du jour
                        </TabsTrigger>
                        <TabsTrigger value="calendar">
                            <Calendar />
                            Calendrier
                        </TabsTrigger>
                        <TabsTrigger value="analytics">
                            <BarChart3 />
                            Analyse
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </nav>

            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}

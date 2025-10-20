"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
    BarChart2,
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {/* ajouter Spinner de chargement */}
            </div>
        );
    }

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    const activeTabValue = pathname.split("/").pop() || "dashboard";

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <header className="bg-white border-b border-slate-200 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary rounded-xl p-2">
                            <Briefcase className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                Propulse
                            </h1>
                            <p className="text-xs text-slate-600">
                                Votre copilote de carrière
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-8 w-8 rounded-full"
                            >
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="" alt="Avatar" />
                                    <AvatarFallback>
                                        {user.email?.charAt(0).toUpperCase()}
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
                                        {user.email}
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
            </header>

            <nav className="bg-none border-b border-slate-200 px-6 ">
                <Tabs value={activeTabValue} onValueChange={handleNavigate}>
                    <TabsList className="bg-none-important">
                        <TabsTrigger value="dashboard">
                            <LayoutDashboard /> Pipeline
                        </TabsTrigger>
                        <TabsTrigger value="actions" disabled>
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

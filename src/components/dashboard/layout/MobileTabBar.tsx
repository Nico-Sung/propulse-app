"use client";

import { cn } from "@/lib/utils";
import {
    BarChart3,
    Calendar,
    CheckSquare,
    FileText,
    LayoutDashboard,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
    tab: string;
    handleNavigate: (value: string) => void;
}

const menuItems = [
    { id: "dashboard", label: "Pipeline", icon: LayoutDashboard },
    { id: "actions", label: "Focus", icon: CheckSquare },
    { id: "calendar", label: "Agenda", icon: Calendar },
    { id: "documents", label: "Docs", icon: FileText },
    { id: "analytics", label: "Stats", icon: BarChart3 },
];

export function MobileTabBar({ tab, handleNavigate }: Props) {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav className="pointer-events-auto flex items-center justify-around w-full max-w-sm bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full p-2 ring-1 ring-black/5 dark:ring-white/5">
                {menuItems.map((item) => {
                    const isActive =
                        (tab === item.id && !pathname.includes("/settings")) ||
                        (pathname.includes("/settings") &&
                            item.id === "dashboard" &&
                            tab === "dashboard");

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 relative group",
                                isActive
                                    ? "text-white bg-black dark:text-black dark:bg-white shadow-lg transform -translate-y-2 scale-110"
                                    : "text-muted-foreground hover:text-foreground active:scale-95"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-transform duration-300",
                                    isActive && "fill-current"
                                )}
                            />
                            <span className="sr-only">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

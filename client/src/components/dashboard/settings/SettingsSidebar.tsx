"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
    Bell,
    HelpCircle,
    LogOut,
    LucideIcon,
    Monitor,
    Shield,
    Target,
    User,
} from "lucide-react";
import { SettingsTab } from "./SettingsModal";

interface SettingsSidebarProps {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
    onClose: () => void;
}

export function SettingsSidebar({
    activeTab,
    setActiveTab,
    onClose,
}: SettingsSidebarProps) {
    const { user, signOut } = useAuth();

    const menuItems: { id: SettingsTab; label: string; icon: LucideIcon }[] = [
        { id: "profile", label: "Profil", icon: User },
        { id: "appearance", label: "Apparence", icon: Monitor },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "goals", label: "Objectifs", icon: Target },
        { id: "security", label: "Confidentialité", icon: Shield },
    ];

    return (
        <div className="w-full md:w-56 bg-muted/30 border-b md:border-b-0 md:border-r border-border/40 p-4 flex flex-col gap-4 md:gap-1 shrink-0">
            <div className="flex items-center gap-3 px-2 md:mb-6">
                <Avatar className="h-8 w-8 md:h-9 md:w-9 ring-1 ring-border/50 shadow-sm">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white text-xs font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden flex-1">
                    <p className="text-sm font-medium truncate text-foreground">
                        {user?.email?.split("@")[0]}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate hidden md:block">
                        {user?.email}
                    </p>
                </div>
            </div>

            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                <h2 className="hidden md:block text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-2 px-2 mt-2">
                    Paramètres
                </h2>
                {menuItems.map((item) => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "justify-start h-9 text-sm px-3 md:px-2 transition-all whitespace-nowrap rounded-full md:rounded-md flex-shrink-0",
                            activeTab === item.id
                                ? "bg-white/80 dark:bg-white/10 shadow-sm text-primary font-medium ring-1 ring-black/5"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/5"
                        )}
                    >
                        <item.icon
                            className={cn(
                                "w-4 h-4 mr-2",
                                activeTab === item.id
                                    ? "opacity-100"
                                    : "opacity-70"
                            )}
                        />
                        {item.label}
                    </Button>
                ))}

                <Button
                    variant="ghost"
                    className="md:hidden justify-start h-9 text-sm px-3 transition-all whitespace-nowrap rounded-full flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                        onClose();
                        signOut();
                    }}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                </Button>
            </div>

            <div className="hidden md:block mt-auto pt-4 border-t border-border/40 space-y-1">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground h-8 px-2 text-xs"
                    onClick={() => window.open("mailto:support@propulse.app")}
                >
                    <HelpCircle className="w-3.5 h-3.5 mr-2" />
                    Aide & Support
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2 text-xs"
                    onClick={() => {
                        onClose();
                        signOut();
                    }}
                >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Déconnexion
                </Button>
            </div>
        </div>
    );
}

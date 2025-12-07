"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { SettingsSidebar } from "./SettingsSidebar";
import { AppearanceTab } from "./tabs/AppearanceTab";
import { GoalsTab } from "./tabs/GoalsTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { SecurityTab } from "./tabs/SecurityTab";

interface SettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export type SettingsTab =
    | "profile"
    | "appearance"
    | "notifications"
    | "goals"
    | "security";

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-full max-w-[95vw] md:max-w-[800px] h-[90vh] md:h-[600px] glass-heavy border-0 ring-1 ring-white/20 shadow-2xl p-0 overflow-hidden gap-0 flex flex-col md:block"
                aria-describedby={undefined}
            >
                <DialogTitle className="sr-only">Paramètres</DialogTitle>

                <div className="flex flex-col md:flex-row h-full">
                    <SettingsSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onClose={() => onOpenChange(false)}
                    />

                    <div className="flex-1 bg-white/40 dark:bg-black/20 backdrop-blur-sm overflow-y-auto relative">
                        <div className="p-4 md:p-8 max-w-2xl mx-auto pb-20 md:pb-8">
                            {activeTab === "profile" && <ProfileTab />}
                            {activeTab === "appearance" && <AppearanceTab />}
                            {activeTab === "notifications" && (
                                <NotificationsTab />
                            )}
                            {activeTab === "goals" && <GoalsTab />}
                            {activeTab === "security" && <SecurityTab />}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

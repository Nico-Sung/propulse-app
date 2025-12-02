"use client";

import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/useSettings";
import { Bell, Mail } from "lucide-react";

export function NotificationsTab() {
    const {
        emailDigest,
        setEmailDigest,
        interviewReminders,
        setInterviewReminders,
    } = useSettings();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h3 className="text-xl font-semibold text-foreground">
                    Notifications
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Choisissez comment vous souhaitez être informé.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 transition-all hover:bg-white/80 dark:hover:bg-white/10">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg shrink-0">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="interview-toggle"
                                className="text-base font-medium cursor-pointer"
                            >
                                Rappels d&apos;entretien
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Recevoir un email 24h avant un entretien
                                planifié.
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            id="interview-toggle"
                            type="checkbox"
                            className="sr-only peer"
                            checked={interviewReminders}
                            onChange={(e) =>
                                setInterviewReminders(e.target.checked)
                            }
                        />
                        <div className="w-11 h-6 bg-muted/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 transition-all hover:bg-white/80 dark:hover:bg-white/10">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg shrink-0">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="digest-toggle"
                                className="text-base font-medium cursor-pointer"
                            >
                                Résumé hebdomadaire
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Un bilan de vos candidatures et tâches chaque
                                lundi matin.
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            id="digest-toggle"
                            type="checkbox"
                            className="sr-only peer"
                            checked={emailDigest}
                            onChange={(e) => setEmailDigest(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-muted/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}

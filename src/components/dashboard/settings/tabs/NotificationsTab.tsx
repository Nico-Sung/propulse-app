"use client";

import { Label } from "@/components/ui/label";
import { useState } from "react";

export function NotificationsTab() {
    const [notifications, setNotifications] = useState({
        emailDigest: true,
        interviewReminders: true,
    });

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
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20">
                    <div className="space-y-0.5">
                        <Label className="text-base">
                            Rappels d&apos;entretien
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Recevoir un email 24h avant un entretien.
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={notifications.interviewReminders}
                        onChange={() =>
                            setNotifications({
                                ...notifications,
                                interviewReminders:
                                    !notifications.interviewReminders,
                            })
                        }
                    />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20">
                    <div className="space-y-0.5">
                        <Label className="text-base">Résumé hebdomadaire</Label>
                        <p className="text-xs text-muted-foreground">
                            Un bilan de vos candidatures chaque lundi.
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={notifications.emailDigest}
                        onChange={() =>
                            setNotifications({
                                ...notifications,
                                emailDigest: !notifications.emailDigest,
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, History } from "lucide-react";
import { useState } from "react";
import CalendarDay from "./CalendarDay";
import { CalendarEvent } from "./CalendarEventItem";

export default function CalendarList({
    grouped,
}: {
    grouped: Record<string, CalendarEvent[]>;
}) {
    const [showPast, setShowPast] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    
    const sortedKeys = Object.keys(grouped)
        .filter((dateKey) => {
            if (showPast) return true;

            const [day, month, year] = dateKey.split("/").map(Number);
            const eventDate = new Date(year, month - 1, day);

            return eventDate >= today;
        })
        .sort((a, b) => {
            const [dayA, monthA, yearA] = a.split("/").map(Number);
            const [dayB, monthB, yearB] = b.split("/").map(Number);
            return (
                new Date(yearA, monthA - 1, dayA).getTime() -
                new Date(yearB, monthB - 1, dayB).getTime()
            );
        });

    const totalEvents = Object.keys(grouped).length;
    const visibleEvents = sortedKeys.length;
    const hiddenCount = totalEvents - visibleEvents;

    return (
        <div className="max-w-3xl mx-auto py-6 space-y-6">
            <div className="flex items-center justify-end px-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPast(!showPast)}
                    className={cn(
                        "text-xs font-medium gap-2 transition-all",
                        showPast
                            ? "text-primary bg-primary/10 hover:bg-primary/20"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {showPast ? (
                        <History className="w-4 h-4" />
                    ) : (
                        <Clock className="w-4 h-4" />
                    )}
                    {showPast ? "Masquer le passé" : "Voir l'historique"}
                    {!showPast && hiddenCount > 0 && (
                        <span className="ml-1 bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-[10px]">
                            {hiddenCount}
                        </span>
                    )}
                </Button>
            </div>

            {sortedKeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                    <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                        {showPast ? "Aucun événement" : "Rien à venir"}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        {showPast
                            ? "Votre agenda est vide."
                            : 'Aucun entretien ou date limite à venir. Cliquez sur "Voir l\'historique" pour consulter le passé.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {sortedKeys.map((dateKey) => (
                        <CalendarDay key={dateKey} events={grouped[dateKey]} />
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

import { cn } from "@/lib/utils";
import CalendarEventItem, { CalendarEvent } from "./CalendarEventItem";

interface CalendarDayProps {
    events: CalendarEvent[];
}

export default function CalendarDay({ events }: CalendarDayProps) {
    if (!events || events.length === 0) return null;

    const date = events[0].date;
    const today = new Date().toDateString() === date.toDateString();
    const isPast = date < new Date() && !today;

    return (
        <div className="relative pl-4 md:pl-0">
            <div className="sticky top-[70px] z-10 mb-6 pb-2 pt-4 backdrop-blur-xl bg-background/30 border-b border-white/10 dark:border-white/5 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none md:border-none md:static md:mb-4 md:pt-0">
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "flex flex-col items-center justify-center h-14 w-14 rounded-2xl shadow-sm border border-white/20 dark:border-white/10 backdrop-blur-md",
                            today
                                ? "bg-primary text-primary-foreground shadow-primary/20 shadow-lg border-none"
                                : "bg-white/60 dark:bg-black/40",
                            isPast && "opacity-60"
                        )}
                    >
                        <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                            {date
                                .toLocaleDateString("fr-FR", { month: "short" })
                                .replace(".", "")}
                        </span>
                        <span className="text-xl font-bold leading-none">
                            {date.getDate()}
                        </span>
                    </div>

                    <div>
                        <h3
                            className={cn(
                                "text-lg font-bold capitalize",
                                today ? "text-primary" : "text-foreground",
                                isPast && "text-muted-foreground"
                            )}
                        >
                            {today
                                ? "Aujourd'hui"
                                : date.toLocaleDateString("fr-FR", {
                                      weekday: "long",
                                  })}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {events.length} événement
                            {events.length > 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative ml-7 md:ml-7 space-y-4 border-l-2 border-dashed border-border/50 pl-8 pb-8 last:pb-0 last:border-transparent">
                {events.map((event) => (
                    <div key={event.id} className="relative">
                        <div
                            className={cn(
                                "absolute -left-[37px] top-6 h-3 w-3 rounded-full border-2 border-background ring-1",
                                event.type === "interview"
                                    ? "bg-primary ring-primary/30"
                                    : "bg-amber-500 ring-amber-500/30"
                            )}
                        />
                        <CalendarEventItem event={event} />
                    </div>
                ))}
            </div>
        </div>
    );
}

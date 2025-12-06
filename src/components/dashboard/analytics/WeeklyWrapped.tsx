"use client";

import { Database } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import {
    Briefcase,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Trophy,
    Zap,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

type Application = Database["public"]["Tables"]["applications"]["Row"];

const getWeekStats = (applications: Application[], weekOffset: number) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentDayAdjusted = dayOfWeek === 0 ? 7 : dayOfWeek;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(
        now.getDate() - currentDayAdjusted + 1 - weekOffset * 7
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const created = applications.filter((app) => {
        const date = new Date(app.created_at);
        return date >= startOfWeek && date <= endOfWeek;
    });

    const interviews = applications.filter((app) => {
        if (!app.interview_date) return false;
        const date = new Date(app.interview_date);
        return date >= startOfWeek && date <= endOfWeek;
    });

    const wins = applications.filter(
        (app) =>
            (app.status === "interview" || app.status === "offer") &&
            new Date(app.updated_at) >= startOfWeek &&
            new Date(app.updated_at) <= endOfWeek
    );

    let title = "";
    if (weekOffset === 0) title = "Cette semaine";
    else if (weekOffset === 1) title = "Semaine dernière";
    else title = "Il y a 2 semaines";

    return {
        title,
        offset: weekOffset,
        range: {
            start: startOfWeek.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
            }),
            end: endOfWeek.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
            }),
        },
        applied: created.length,
        interviews: interviews.length,
        wins: wins.length,
        hasActivity:
            created.length > 0 || interviews.length > 0 || wins.length > 0,
    };
};

export function WeeklyWrapped({
    applications,
}: {
    applications: Application[];
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const isDragging = useRef(false);
    const startX = useRef(0);

    const slides = useMemo(() => {
        return [
            getWeekStats(applications, 0),
            getWeekStats(applications, 1),
            getWeekStats(applications, 2),
        ];
    }, [applications]);

    const handleStart = (clientX: number) => {
        isDragging.current = true;
        startX.current = clientX;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging.current) return;
        const diff = clientX - startX.current;
        setDragOffset(diff);
    };

    const handleEnd = () => {
        isDragging.current = false;
        const threshold = 50;

        if (dragOffset > threshold && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        } else if (
            dragOffset < -threshold &&
            currentIndex < slides.length - 1
        ) {
            setCurrentIndex((prev) => prev + 1);
        }

        setDragOffset(0);
    };

    const onTouchStart = (e: React.TouchEvent) =>
        handleStart(e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) =>
        handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleEnd();

    const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
    const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onMouseLeave = () => {
        if (isDragging.current) handleEnd();
    };

    const currentStats = slides[currentIndex];

    return (
        <div
            className="relative overflow-hidden rounded-[2rem] p-[1px] animate-in fade-in slide-in-from-bottom-6 duration-700 mb-8 mt-8 shadow-sm group hover:shadow-md transition-shadow select-none cursor-grab active:cursor-grabbing"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-violet-500/20 to-secondary/30 dark:from-primary/50 dark:via-violet-500/40 dark:to-secondary/50 rounded-[2rem] pointer-events-none opacity-60 dark:opacity-80" />

            <div
                className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 dark:bg-primary/30 blur-[100px] pointer-events-none opacity-60 dark:opacity-70 animate-pulse"
                style={{ animationDuration: "8s" }}
            />
            <div
                className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-500/20 dark:bg-violet-500/30 blur-[100px] pointer-events-none opacity-60 dark:opacity-70 animate-pulse"
                style={{ animationDuration: "10s" }}
            />

            <div className="glass relative rounded-[1.9rem] overflow-hidden bg-white/40 dark:bg-black/30">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-20" />

                <div className="relative z-30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-4 px-6 pt-6 md:px-8 md:pt-8">
                    <div className="flex-1 w-full">
                        <div className="flex items-center justify-between w-full">
                            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md shadow-sm">
                                <Zap className="h-3.5 w-3.5" />
                                {currentStats.title}
                            </div>

                            <div className="hidden md:flex gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentIndex(
                                            Math.max(0, currentIndex - 1)
                                        )
                                    }
                                    disabled={currentIndex === 0}
                                    className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentIndex(
                                            Math.min(
                                                slides.length - 1,
                                                currentIndex + 1
                                            )
                                        )
                                    }
                                    disabled={
                                        currentIndex === slides.length - 1
                                    }
                                    className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-3">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-white/80 transition-all duration-300">
                                {currentStats.title}
                            </h2>
                            <p className="text-muted-foreground text-sm font-medium transition-all duration-300">
                                Du {currentStats.range.start} au{" "}
                                {currentStats.range.end}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="flex transition-transform duration-500 ease-out will-change-transform"
                    style={{
                        transform: `translateX(calc(-${
                            currentIndex * 100
                        }% + ${dragOffset}px))`,
                        transition: isDragging.current
                            ? "none"
                            : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                >
                    {slides.map((slide, idx) => (
                        <div key={idx} className="min-w-full px-6 pb-8 md:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="glass-card group/card relative overflow-hidden rounded-2xl p-5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-white/40 dark:border-white/10 dark:bg-white/5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20 shadow-inner">
                                            <Briefcase className="h-5 w-5" />
                                        </div>
                                        <span className="font-semibold text-foreground/80 text-sm">
                                            Candidatures
                                        </span>
                                    </div>
                                    <div className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                                        {slide.applied}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                                        Envoyées
                                    </p>
                                </div>

                                <div className="glass-card group/card relative overflow-hidden rounded-2xl p-5 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 transition-colors border-white/40 dark:border-white/10 dark:bg-white/5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20 shadow-inner">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <span className="font-semibold text-foreground/80 text-sm">
                                            Entretiens
                                        </span>
                                    </div>
                                    <div className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                                        {slide.interviews}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                                        Planifiés ou passés
                                    </p>
                                </div>

                                <div className="glass-card group/card relative overflow-hidden rounded-2xl p-5 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition-colors border-white/40 dark:border-white/10 bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-500/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20 shadow-inner">
                                            <Trophy className="h-5 w-5" />
                                        </div>
                                        <span className="font-semibold text-foreground/80 text-sm">
                                            Progression
                                        </span>
                                    </div>
                                    <div className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                                        {slide.wins}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                                        Étapes franchies
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-80">
                                <p className="text-xs text-muted-foreground/80 italic font-medium text-center sm:text-left">
                                    {slide.hasActivity
                                        ? "“Chaque action est une victoire.”"
                                        : "“Aucune activité enregistrée pour cette période.”"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(idx);
                            }}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-sm",
                                currentIndex === idx
                                    ? "w-6 bg-primary"
                                    : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                            )}
                            aria-label={`Voir la semaine ${
                                idx === 0
                                    ? "courante"
                                    : idx === 1
                                    ? "dernière"
                                    : "d'avant"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

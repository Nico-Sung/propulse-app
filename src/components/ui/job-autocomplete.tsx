"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Briefcase, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Job {
    label: string;
    romeId: string;
}

interface JobAutocompleteProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string;
    onChange: (value: string) => void;
}

export function JobAutocomplete({
    value,
    onChange,
    className,
    ...props
}: JobAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            if (!value || value.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `/api/jobs/search?title=${encodeURIComponent(value)}`
                );

                if (!response.ok) {
                    console.warn(`Erreur API (${response.status})`);
                    setSuggestions([]);
                    return;
                }

                const data = await response.json();

                const jobs = (data.labelsAndRomes || []).slice(0, 10);

                setSuggestions(jobs);
            } catch (error) {
                console.error("Erreur technique:", error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchJobs, 500);
        return () => clearTimeout(timeoutId);
    }, [value]);

    const handleSelect = (jobLabel: string) => {
        onChange(jobLabel);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setIsOpen(true);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <Input
                    {...props}
                    value={value}
                    onChange={handleInputChange}
                    className={cn(className, "pr-8")}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Ex: Développeur Web..."
                    autoComplete="off"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border border-border shadow-md animate-in fade-in-0 zoom-in-95 overflow-hidden max-h-[250px] overflow-y-auto">
                    <ul className="py-1">
                        {suggestions.map((job, index) => (
                            <li
                                key={`${job.romeId}-${index}`}
                                onClick={() => handleSelect(job.label)}
                                className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border/50 last:border-0 flex items-center gap-2"
                            >
                                <Briefcase className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span className="text-sm truncate">
                                    {job.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-muted/30 px-2 py-1 text-[10px] text-center text-muted-foreground border-t border-border/50 sticky bottom-0 backdrop-blur-sm">
                        Source : France Travail (ROME)
                    </div>
                </div>
            )}
        </div>
    );
}

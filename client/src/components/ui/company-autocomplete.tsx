"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Building2, Loader2, MapPin } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Company {
    nom_complet: string;
    siren: string;
    siege: {
        libelle_commune: string;
    };
}

interface CompanyAutocompleteProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string;
    onChange: (value: string) => void;
}

export function CompanyAutocomplete({
    value,
    onChange,
    className,
    ...props
}: CompanyAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<Company[]>([]);
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
        const fetchCompanies = async () => {
            if (!value || value.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(
                        value
                    )}&per_page=5`
                );
                const data = await response.json();
                setSuggestions(data.results || []);
            } catch (error) {
                console.error("Erreur API Entreprise", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchCompanies, 300);
        return () => clearTimeout(timeoutId);
    }, [value]);

    const handleSelect = (company: Company) => {
        onChange(company.nom_complet);
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
                    placeholder="Tapez pour rechercher une entreprise..."
                    autoComplete="off"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border border-border shadow-md animate-in fade-in-0 zoom-in-95 overflow-hidden">
                    <ul className="max-h-[250px] overflow-auto py-1">
                        {suggestions.map((company) => (
                            <li
                                key={company.siren}
                                onClick={() => handleSelect(company)}
                                className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border/50 last:border-0"
                            >
                                <div className="font-medium text-sm flex items-center gap-2">
                                    <Building2 className="w-3 h-3 text-muted-foreground" />
                                    {company.nom_complet}
                                </div>
                                {company.siege?.libelle_commune && (
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 ml-5">
                                        <MapPin className="w-3 h-3" />
                                        {company.siege.libelle_commune}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="bg-muted/30 px-2 py-1 text-[10px] text-center text-muted-foreground border-t border-border/50">
                        Source : API Recherche Entreprises
                    </div>
                </div>
            )}
        </div>
    );
}

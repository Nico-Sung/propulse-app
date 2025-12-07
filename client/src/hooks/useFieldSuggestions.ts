"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export function useFieldSuggestions(
    table: string,
    column: string,
    query: string
) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query || query.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select(column)
                    .ilike(column, `%${query}%`)
                    .limit(20);

                if (error) throw error;

                if (data) {
                    const values = data
                        //eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .map((item: any) => item[column])
                        .filter(
                            (val): val is string =>
                                typeof val === "string" && val.length > 0
                        );

                    const uniqueValues = Array.from(new Set(values));

                    const filtered = uniqueValues.filter(
                        (v) => v.toLowerCase() !== query.toLowerCase()
                    );

                    setSuggestions(filtered);
                }
            } catch (err) {
                console.error("Erreur suggestions:", err);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 500);

        return () => clearTimeout(timeoutId);
    }, [table, column, query]);

    return { suggestions, loading };
}

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/database.types";
import { toast } from "sonner";

export type Tag = Database["public"]["Tables"]["tags"]["Row"];
type ApplicationTag = Database["public"]["Tables"]["application_tags"]["Row"];

export const TAG_COLORS = [
    { name: "Rouge", value: "bg-red-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Jaune", value: "bg-yellow-500" },
    { name: "Vert", value: "bg-green-500" },
    { name: "Bleu", value: "bg-blue-500" },
    { name: "Violet", value: "bg-purple-500" },
    { name: "Rose", value: "bg-pink-500" },
    { name: "Gris", value: "bg-slate-500" },
    { name: "Noir", value: "bg-zinc-800" },
];

export function useKanbanTags() {
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [assignments, setAssignments] = useState<Record<string, string[]>>(
        {}
    );
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const { data: tagsData, error: tagsError } = await supabase
                .from("tags")
                .select("*")
                .order("created_at", { ascending: true });

            if (tagsError) throw tagsError;

            const { data: assignData, error: assignError } = await supabase
                .from("application_tags")
                .select("*");

            if (assignError) throw assignError;

            if (tagsData) setAllTags(tagsData);

            if (assignData) {
                const newAssignments: Record<string, string[]> = {};
                (assignData as ApplicationTag[]).forEach((item) => {
                    if (!newAssignments[item.application_id]) {
                        newAssignments[item.application_id] = [];
                    }
                    newAssignments[item.application_id].push(item.tag_id);
                });
                setAssignments(newAssignments);
            }
        } catch (error) {
            console.error("Erreur chargement tags:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();

        const channel = supabase
            .channel("tags_updates")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "tags" },
                load
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "application_tags" },
                load
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const createTag = async (label: string, color: string) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from("tags").insert({
            user_id: user.id,
            label,
            color,
        });

        if (error) {
            console.error(error);
            toast.error("Erreur lors de la création de l'étiquette");
        } else {
            toast.success("Étiquette créée");
            load();
        }
    };

    const deleteTag = async (tagId: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("tags")
            .delete()
            .eq("id", tagId);

        if (error) {
            toast.error("Impossible de supprimer l'étiquette");
        } else {
            toast.success("Étiquette supprimée");
            setAllTags((prev) => prev.filter((t) => t.id !== tagId));
            const newAssign = { ...assignments };
            Object.keys(newAssign).forEach((key) => {
                newAssign[key] = newAssign[key].filter((id) => id !== tagId);
            });
            setAssignments(newAssign);
        }
    };

    const toggleTagForApp = async (appId: string, tagId: string) => {
        const currentTags = assignments[appId] || [];
        const isAssigned = currentTags.includes(tagId);

        let newAppTags;
        if (isAssigned) {
            newAppTags = currentTags.filter((id) => id !== tagId);
        } else {
            newAppTags = [...currentTags, tagId];
        }
        setAssignments({ ...assignments, [appId]: newAppTags });

        if (isAssigned) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from("application_tags")
                .delete()
                .eq("application_id", appId)
                .eq("tag_id", tagId);

            if (error) {
                console.error(error);
                toast.error("Erreur lors du retrait");

                load();
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from("application_tags")
                .insert({ application_id: appId, tag_id: tagId });

            if (error) {
                console.error(error);
                toast.error("Erreur lors de l'ajout");
                load();
            }
        }
    };

    const getAppTags = (appId: string) => {
        const tagIds = assignments[appId] || [];
        return tagIds
            .map((id) => allTags.find((t) => t.id === id))
            .filter(Boolean) as Tag[];
    };

    return {
        allTags,
        createTag,
        deleteTag,
        toggleTagForApp,
        getAppTags,
        loading,
        TAG_COLORS,
    };
}

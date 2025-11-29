"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Target } from "lucide-react";
import { useState } from "react";

export function GoalsTab() {
    const [weeklyGoal, setWeeklyGoal] = useState("5");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h3 className="text-xl font-semibold text-foreground">
                    Objectifs
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Définissez votre rythme de croisière.
                </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary rounded-full text-white shadow-lg shadow-primary/30">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">
                            Objectif Hebdomadaire
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Combien de candidatures visez-vous par semaine ?
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Select value={weeklyGoal} onValueChange={setWeeklyGoal}>
                        <SelectTrigger className="w-[180px] bg-white/80 dark:bg-black/20 backdrop-blur-sm">
                            <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="3">3 candidatures</SelectItem>
                            <SelectItem value="5">
                                5 candidatures (Recommandé)
                            </SelectItem>
                            <SelectItem value="10">10 candidatures</SelectItem>
                            <SelectItem value="20">
                                20 candidatures (Intensif)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                        actuellement sélectionné
                    </span>
                </div>
            </div>
        </div>
    );
}

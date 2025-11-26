"use client";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function AuthHeader() {
    return (
        <CardHeader className="items-center text-center">
            <div className="bg-primary rounded-lg p-3 w-fit mb-4">
                <Briefcase className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold">Propulse</CardTitle>
            <CardDescription>Votre copilote de carrière</CardDescription>
        </CardHeader>
    );
}

"use client";

import { Briefcase } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

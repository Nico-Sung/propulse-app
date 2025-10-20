"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DailyActions({
    onOpen,
}: {
    onOpen?: (id: string) => void;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Actions du jour</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-muted">Aucune action pour aujourd'hui</div>
                <div className="mt-3">
                    <Button size="sm" onClick={() => onOpen?.("")}>
                        Voir
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

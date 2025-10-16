// components/dashboard/kanban/EditApplicationSheet.tsx

"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Database } from "@/lib/database.types";

type Application = Database["public"]["Tables"]["applications"]["Row"];

interface Props {
    application: Application | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditApplicationSheet({ application, isOpen, onClose }: Props) {
    if (!application) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{application.position_title}</SheetTitle>
                    <SheetDescription>
                        {application.company_name}
                    </SheetDescription>
                </SheetHeader>
                <div className="py-8">
                    {/*
                        composant "EditApplicationForm" qui prendrait `application` en prop pour pré-remplir les champs.
                    */}
                    <p>Formulaire d'édition à venir ici.</p>
                </div>
            </SheetContent>
        </Sheet>
    );
}

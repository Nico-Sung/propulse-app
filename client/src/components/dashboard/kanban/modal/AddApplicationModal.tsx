"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddApplicationForm from "./AddApplicationForm";

interface AddApplicationDialogProps {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    defaultStatus?: string;
}

export function AddApplicationDialog({
    open: controlledOpen,
    setOpen: setControlledOpen,
    defaultStatus = "to_apply",
}: AddApplicationDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button className="fixed bottom-8 right-8 rounded-full h-14 shadow-lg z-50">
                        <Plus className="w-6 h-6 mr-2" /> Nouvelle candidature
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Ajouter une Candidature</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Remplissez les informations ci-dessous pour suivre une
                        nouvelle offre d&apos;emploi.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <AddApplicationForm
                        setOpen={setOpen}
                        defaultStatus={defaultStatus}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

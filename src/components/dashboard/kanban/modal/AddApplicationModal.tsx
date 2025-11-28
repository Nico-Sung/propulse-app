"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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

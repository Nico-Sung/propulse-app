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

export function AddApplicationDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="fixed bottom-8 right-8 rounded-full h-14 shadow-lg">
                    <Plus className="w-6 h-6 mr-2" /> Nouvelle candidature
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Ajouter une Candidature</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <AddApplicationForm setOpen={setOpen} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

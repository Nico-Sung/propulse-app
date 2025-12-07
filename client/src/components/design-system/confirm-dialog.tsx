import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import React from "react";

export default function ConfirmationDialog({
    title,
    description,
    confirmLabel,
    cancelLabel,
    onConfirm,
    open,
    onOpenChange,
    children,
}: {
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void | Promise<void>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange?.(false)}
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async (e) => {
                                e.preventDefault();
                                await onConfirm();
                            }}
                        >
                            {confirmLabel}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

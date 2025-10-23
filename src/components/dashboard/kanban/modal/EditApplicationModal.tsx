"use client";

import { useState } from "react";
import { Database } from "@/lib/database.types";
import { FileText, CheckSquare, Clock, User } from "lucide-react";
import { TasksTab } from "../details/TasksTab";
import { HistoryTab } from "../details/HistoryTab";
import { ContactsTab } from "../details/ContactsTab";
import { InfoTab } from "../details/InfoTab";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";

type Application = Database["public"]["Tables"]["applications"]["Row"];

interface Props {
    application: Application | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

type Tab = "info" | "tasks" | "history" | "contacts";

export function EditApplicationSheet({
    application,
    isOpen,
    onClose,
    onUpdate,
}: Props) {
    if (!application || !isOpen) return null;

    const [activeTab, setActiveTab] = useState<Tab>("info");

    const tabs = [
        { id: "info" as Tab, label: "Informations", icon: FileText },
        { id: "tasks" as Tab, label: "Tâches", icon: CheckSquare },
        { id: "history" as Tab, label: "Historique", icon: Clock },
        { id: "contacts" as Tab, label: "Contacts", icon: User },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full sm:max-w-3xl flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{application.position_title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        {application.company_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2 border-b border-default -mb-px px-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <Button
                                key={tab.id}
                                variant="ghost"
                                className={`flex items-center gap-2 px-4 py-2 font-medium rounded-none border-b-2 transition-none hover:bg-transparent hover:text-current focus:bg-transparent ${
                                    activeTab === tab.id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground"
                                }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </Button>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "info" && (
                        <InfoTab
                            application={application}
                            onUpdate={onUpdate}
                        />
                    )}

                    {activeTab === "tasks" && (
                        <TasksTab applicationId={application.id} />
                    )}
                    {activeTab === "history" && (
                        <HistoryTab applicationId={application.id} />
                    )}
                    {activeTab === "contacts" && (
                        <ContactsTab applicationId={application.id} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

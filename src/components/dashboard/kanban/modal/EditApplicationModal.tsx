"use client";

import { useState } from "react";
import { Database } from "@/lib/database.types";
import { FileText, CheckSquare, Clock, User, Paperclip } from "lucide-react";
import { TasksTab } from "../details/TasksTab";
import { HistoryTab } from "../details/HistoryTab";
import { ContactsTab } from "../details/ContactsTab";
import { InfoTab } from "../details/InfoTab";
import { DocumentsTab } from "../details/DocumentsTab";
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

type Tab = "info" | "tasks" | "history" | "contacts" | "documents";

export function EditApplicationSheet({
    application,
    isOpen,
    onClose,
    onUpdate,
}: Props) {
    if (!application || !isOpen) return null;

    const [activeTab, setActiveTab] = useState<Tab>("info");

    const tabs = [
        { id: "info" as Tab, label: "Infos", icon: FileText },
        { id: "tasks" as Tab, label: "Tâches", icon: CheckSquare },
        { id: "documents" as Tab, label: "Docs", icon: Paperclip },
        { id: "contacts" as Tab, label: "Contacts", icon: User },
        { id: "history" as Tab, label: "Historique", icon: Clock },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full sm:max-w-4xl flex flex-col max-h-[90vh] h-[800px] p-0 gap-0 bg-background">
                <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
                    <DialogTitle className="text-xl">
                        {application.position_title}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        {application.company_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex border-b border-border bg-muted/30 px-6 flex-shrink-0 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <Button
                                key={tab.id}
                                variant="ghost"
                                className={`flex items-center gap-2 px-4 py-3 font-medium rounded-none border-b-2 transition-all h-auto focus:ring-0 ${
                                    activeTab === tab.id
                                        ? "border-primary text-primary bg-primary/5"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </Button>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-background/50">
                    {activeTab === "info" && (
                        <InfoTab
                            application={application}
                            onUpdate={onUpdate}
                        />
                    )}

                    {activeTab === "tasks" && (
                        <TasksTab applicationId={application.id} />
                    )}

                    {activeTab === "documents" && (
                        <DocumentsTab applicationId={application.id} />
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

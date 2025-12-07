"use client";

import { DesktopHeader } from "@/components/dashboard/layout/DesktopHeader";
import { MobileHeader } from "@/components/dashboard/layout/MobileHeader";
import { MobileTabBar } from "@/components/dashboard/layout/MobileTabBar";
import { SettingsModal } from "@/components/dashboard/settings/SettingsModal";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import {
    DashboardTabProvider,
    useDashboardTab,
} from "@/contexts/DashboardTabContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TabValue =
    | "dashboard"
    | "actions"
    | "calendar"
    | "analytics"
    | "documents";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <Spinner size={48} />
            </div>
        );
    }

    return (
        <DashboardTabProvider>
            <ShellLayout>{children}</ShellLayout>
        </DashboardTabProvider>
    );
}

function ShellLayout({ children }: { children: React.ReactNode }) {
    const { tab, setTab } = useDashboardTab();
    const { user, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const lastSegment = pathname.split("/").pop();
        const active = (lastSegment || "dashboard") as TabValue;

        const supportedTabs: TabValue[] = [
            "dashboard",
            "actions",
            "calendar",
            "analytics",
            "documents",
        ];

        if (active && supportedTabs.includes(active) && active !== tab) {
            setTab(active);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, setTab]);

    const handleNavigate = (value: string) => {
        setTab(value as TabValue);
        if (pathname !== "/dashboard") {
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 pb-28 md:pb-0">
            <DesktopHeader
                tab={tab}
                pathname={pathname}
                user={user}
                signOut={signOut}
                handleNavigate={handleNavigate}
                setIsSettingsOpen={setIsSettingsOpen}
            />

            <MobileHeader user={user} setIsSettingsOpen={setIsSettingsOpen} />

            <MobileTabBar tab={tab} handleNavigate={handleNavigate} />

            <main className="flex-1 w-full max-w-[1800px] mx-auto overflow-hidden relative z-0">
                {children}
            </main>

            <SettingsModal
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
            />
        </div>
    );
}

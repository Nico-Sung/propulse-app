"use client";

import React, { createContext, useContext, useState } from "react";

type TabValue =
    | "dashboard"
    | "actions"
    | "calendar"
    | "analytics"
    | "documents";

type DashboardTabContextType = {
    tab: TabValue;
    setTab: (v: TabValue) => void;
};

const DashboardTabContext = createContext<DashboardTabContextType | undefined>(
    undefined
);

export function DashboardTabProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [tab, setTab] = useState<TabValue>("dashboard");

    return (
        <DashboardTabContext.Provider value={{ tab, setTab }}>
            {children}
        </DashboardTabContext.Provider>
    );
}

export function useDashboardTab() {
    const ctx = useContext(DashboardTabContext);
    if (!ctx) {
        throw new Error(
            "useDashboardTab must be used within DashboardTabProvider"
        );
    }
    return ctx;
}

export default DashboardTabContext;

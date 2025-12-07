"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function Spinner({
    size = 12,
    className = "",
}: {
    size?: number;
    className?: string;
}) {
    const px = `${size}px`;
    return (
        <Loader2
            className={`${className} animate-spin text-primary`}
            style={{ width: px, height: px }}
        />
    );
}

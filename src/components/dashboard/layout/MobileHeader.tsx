"use client";

import ThemeToggle from "@/components/design-system/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    setIsSettingsOpen: (open: boolean) => void;
}

export function MobileHeader({ user, setIsSettingsOpen }: Props) {
    return (
        <header className="md:hidden sticky top-0 z-40 w-full border-b border-white/10 bg-white/80 dark:bg-black/70 backdrop-blur-lg p-4 flex items-center justify-between transition-all duration-300">
            <Link href="/dashboard" className="flex items-center gap-2">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={18}
                        height={18}
                        className="object-contain brightness-0 invert"
                    />
                </div>
                <span className="font-bold text-base tracking-tight">
                    Propulse
                </span>
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle className="h-8 w-8 rounded-full bg-transparent hover:bg-black/5" />
                <button onClick={() => setIsSettingsOpen(true)}>
                    <Avatar className="h-8 w-8 border-2 border-white/20 shadow-sm">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white text-[10px]">
                            {user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </div>
        </header>
    );
}

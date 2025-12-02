import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Propulse",
    description: "Votre copilote de carrière",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className={`${fontSans.className} antialiased`}>
                <AuthProvider>
                    <SettingsProvider>
                        {children}
                        <Toaster
                            position="bottom-right"
                            theme="system"
                            className="toaster group"
                            toastOptions={{
                                classNames: {
                                    toast: "group toast group-[.toaster]:bg-white/90 group-[.toaster]:dark:bg-zinc-900/90 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-xl",
                                    description:
                                        "group-[.toast]:text-muted-foreground",
                                    actionButton:
                                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                                    cancelButton:
                                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                                },
                            }}
                        />
                    </SettingsProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

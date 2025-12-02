"use client";

export default function Footer() {
    return (
        <footer className="py-12 border-t border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Propulse by Nicolas. Fait avec
                    ❤️ pour les chercheurs d&apos;emploi.
                </div>

                <div className="flex gap-8 text-sm font-medium text-muted-foreground">
                    <a
                        href="#"
                        className="hover:text-foreground transition-colors"
                    >
                        Confidentialité
                    </a>
                    <a
                        href="#"
                        className="hover:text-foreground transition-colors"
                    >
                        Conditions
                    </a>
                    <a
                        href="#"
                        className="hover:text-foreground transition-colors"
                    >
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
}

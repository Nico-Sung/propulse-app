"use client";

export default function AuthFooter() {
    return (
        <div className="w-full text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Propulse — Tous droits réservés.</p>
        </div>
    );
}

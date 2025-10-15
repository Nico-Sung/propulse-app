import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FinalCTASection() {
    return (
        <section className="text-center py-20 px-4 bg-gray-50">
            <h2 className="text-4xl font-bold mb-4">
                Prêt à propulser votre carrière ?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Rejoignez des centaines de candidats qui organisent leur succès.
            </p>
            <Link href="/auth">
                <Button size="lg" className="text-lg">
                    Créer mon compte
                </Button>
            </Link>
        </section>
    );
}

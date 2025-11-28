import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="text-center py-20 px-4 bg-gray-50">
            <h1 className="text-5xl font-bold mb-4">
                Reprenez le contrôle de votre recherche d&apos;emploi.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Propulse transforme le chaos de la recherche d&apos;emploi en un
                plan d&apos;action clair et motivant.
            </p>
            <Link href="/auth">
                <Button size="lg" className="text-lg">
                    Commencer Gratuitement
                </Button>
            </Link>
            <div className="mt-12">
                <div className="w-full max-w-4xl mx-auto h-96 bg-gray-200 rounded-lg shadow-lg">
                    <p className="pt-4 text-gray-400">
                        [Aperçu visuel de l&apos;application Propulse]
                    </p>
                </div>
            </div>
        </section>
    );
}

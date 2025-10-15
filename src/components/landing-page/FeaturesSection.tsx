import { FileText, Target, BarChart2 } from "lucide-react";
import FeatureCard from "../design-system/feature-card";

export default function FeaturesSection() {
    return (
        <section className="py-20 px-4">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold">
                    Passez au niveau supérieur
                </h2>
                <p className="text-lg text-gray-600 mt-2">
                    Tout ce dont vous avez besoin pour une recherche d'emploi
                    organisée et efficace.
                </p>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<FileText className="w-10 h-10 text-blue-500" />}
                    title="Visualisez votre progression"
                    description="Suivez chaque candidature d'un seul coup d'œil grâce à un tableau de bord Kanban intuitif. Fini les tableurs complexes."
                />
                <FeatureCard
                    icon={<Target className="w-10 h-10 text-blue-500" />}
                    title="Optimisez vos candidatures"
                    description="Notre analyseur compare votre CV à l'offre et vous donne des suggestions concrètes pour maximiser vos chances."
                />
                <FeatureCard
                    icon={<BarChart2 className="w-10 h-10 text-blue-500" />}
                    title="Apprenez de vos actions"
                    description="Comprenez ce qui fonctionne grâce à des bilans de performance. Identifiez vos points forts et ajustez votre stratégie."
                />
            </div>
        </section>
    );
}

import HeroSection from "@/components/landing-page/HeroSection";
import FeaturesSection from "@/components/landing-page/FeaturesSection";
import FinalCTASection from "@/components/landing-page/FinalCTASection";
import Footer from "@/components/landing-page/Footer";

export default function LandingPage() {
    return (
        <div className="bg-surface text-foreground">
            <HeroSection />
            <FeaturesSection />
            <FinalCTASection />
            <Footer />
        </div>
    );
}

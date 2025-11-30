"use client";

import FeaturesSection from "@/components/landing-page/FeaturesSection";
import FinalCTASection from "@/components/landing-page/FinalCTASection";
import Footer from "@/components/landing-page/Footer";
import HeroSection from "@/components/landing-page/HeroSection";
import LandingHeader from "@/components/landing-page/LandingHeader";
import PricingSection from "@/components/landing-page/PricingSection";

export default function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-background relative overflow-hidden selection:bg-primary/20">
            <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-500/15 rounded-full blur-[120px] animate-pulse -z-10" />
            <div className="fixed top-[40%] right-[-20%] w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[100px] animate-pulse delay-1000 -z-10" />
            <div className="fixed bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-2000 -z-10" />

            <LandingHeader />

            <main>
                <HeroSection />
                <FeaturesSection />
                <PricingSection />
                <FinalCTASection />
            </main>

            <Footer />
        </div>
    );
}

"use client";

import FeaturesSection from "@/components/landing-page/FeaturesSection";
import FinalCTASection from "@/components/landing-page/FinalCTASection";
import Footer from "@/components/landing-page/Footer";
import HeroSection from "@/components/landing-page/HeroSection";
import LandingHeader from "@/components/landing-page/LandingHeader";
import PricingSection from "@/components/landing-page/PricingSection";
import MouseGradientTrail from "@/components/ui/mouse-gradient-trail";
import Noise from "@/components/ui/noise";
import ParallaxBlob from "@/components/ui/parallax-blob";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";

export default function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-background relative overflow-hidden selection:bg-primary/20">
            <Noise />

            <MouseGradientTrail />

            <ParallaxBlob
                speed={0.2}
                className="top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] opacity-60"
            />

            <ParallaxBlob
                speed={-0.15}
                className="top-[30%] right-[-15%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[90px] opacity-50"
            />

            <ParallaxBlob
                speed={0.1}
                className="bottom-[10%] left-[10%] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[120px] opacity-40"
            />

            <ParallaxBlob
                speed={-0.05}
                className="bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] opacity-30"
            />

            <LandingHeader />

            <main className="relative z-10">
                <RevealOnScroll>
                    <HeroSection />
                </RevealOnScroll>

                <RevealOnScroll delay={100}>
                    <FeaturesSection />
                </RevealOnScroll>

                <RevealOnScroll delay={100}>
                    <PricingSection />
                </RevealOnScroll>

                <RevealOnScroll delay={100}>
                    <FinalCTASection />
                </RevealOnScroll>
            </main>

            <Footer />
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ValuePropSection } from "@/components/landing/ValuePropSection";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { AllianceSection } from "@/components/landing/AllianceSection";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export default function LandingPage() {
  return (
    <main className="noise-bg selection:bg-accent/30 selection:text-foreground">
      <Navbar />
      
      <HeroSection />
      
      <ProblemSection />
      
      <ShowcaseSection />
      
      <ValuePropSection />
      
      <AllianceSection />

      {/* Final CTA Section */}
      <section className="py-32 px-6 bg-background text-center border-t arch-border border-l-0 border-r-0 border-b-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="arch-container space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
            Understand Your Codebase Faster.
          </h2>
          
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Join the elite teams of developers who visualize their complexity instead of getting lost in it.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/interface">
              <button className="arch-btn-primary w-full sm:w-auto arch-shadow">
                Launch CodeLore
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

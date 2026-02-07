"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ValuePropSection } from "@/components/landing/ValuePropSection";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { AllianceSection } from "@/components/landing/AllianceSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="noise-bg selection:bg-brutal-blue selection:text-brutal-white font-[var(--font-comic-neue)]">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-brutal-blue z-[100] origin-left"
        style={{ scaleX }}
      />

      <HeroSection />
      
      <ProblemSection />
      
      <ValuePropSection />
      
      <ShowcaseSection />
      
      <AllianceSection />

      {/* Final Statement */}
      <section className="py-40 px-6 bg-brutal-white text-center border-b-8 border-brutal-black">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <h2 className="text-6xl lg:text-9xl font-[var(--font-bangers)] leading-tight text-brutal-black uppercase italic">
            INTERFACES SHOULD RESPOND.<br />
            NOT INSTRUCT.
          </h2>
          
          <Link href="/interface" className="inline-block">
            <button className="brutal-btn-cyan text-3xl px-12 h-20 uppercase tracking-widest">
              Join The Interface
            </button>
          </Link>
          <div className="flex justify-center gap-4 mt-8">
             <button className="brutal-btn-pink-square shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M10.8425 24V0H13.1575V24H10.8425ZM0 13.1664V10.8336H24V13.1664H0Z" fill="black"/>
                </svg>
             </button>
             <button className="brutal-btn-cyan">
                Documentation
             </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

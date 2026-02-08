"use client";

import { motion } from "framer-motion";
import { Github, MessageSquare, Compass } from "lucide-react";

const STEPS = [
  {
    icon: Github,
    title: "Connect GitHub",
    description: "Provide a repository URL. CodeLore clones and analyzes the structure in real-time.",
  },
  {
    icon: MessageSquare,
    title: "Ask Questions",
    description: "Inquire about architecture, logic flows, or specific files using natural language.",
  },
  {
    icon: Compass,
    title: "Visualize Results",
    description: "Instead of text explanations, CodeLore renders interactive, high-fidelity maps.",
  }
];

export function ValuePropSection() {
  return (
    <section id="how-it-works" className="py-32 px-6 bg-background border-b arch-border border-l-0 border-r-0 border-t-0">
      <div className="arch-container">
        <div className="max-w-3xl mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary"
          >
            Engineered for Precision.
          </motion.h2>
          <p className="mt-6 text-lg text-text-secondary">
            Our multi-step analysis process ensures that your visual mental model perfectly matches the underlying source code.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Subtle line connectors for desktop */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-border border-dashed border-t -z-0" />
          
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative z-10 flex flex-col items-start gap-6 bg-background"
            >
              <div className="w-14 h-14 rounded-full bg-surface border arch-border flex items-center justify-center text-accent arch-shadow">
                <step.icon className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-accent px-2 py-0.5 border border-accent/20 rounded-full">0{idx + 1}</span>
                  <h3 className="text-xl font-bold tracking-tight text-text-primary">{step.title}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

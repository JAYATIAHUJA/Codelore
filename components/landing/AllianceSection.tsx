"use client";

import { motion } from "framer-motion";

const TECH_BADGES = [
  { name: "Built with Tambo", color: "bg-background" },
  { name: "React 19", color: "bg-background" },
  { name: "Next.js 15", color: "bg-background" },
  { name: "GitHub API", color: "bg-background" },
  { name: "Framer Motion", color: "bg-background" },
  { name: "Tailwind CSS", color: "bg-background" }
];

export function AllianceSection() {
  return (
    <section className="py-24 px-6 bg-surface border-b arch-border border-l-0 border-r-0 border-t-0 overflow-hidden">
      <div className="arch-container text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">Tech Stack</span>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Built on the Modern Web.</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {TECH_BADGES.map((tech) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="px-6 py-3 border arch-border bg-background arch-shadow text-xs font-mono font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition-colors cursor-default rounded-sm"
            >
              {tech.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

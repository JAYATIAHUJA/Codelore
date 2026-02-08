"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageSquare, Layout, Share2, Zap } from "lucide-react";

const SCENARIOS = [
  {
    query: "Show auth flow",
    responseTitle: "FlowDiagram",
    description: "CodeLore identifies the authentication logic and renders a step-by-step sequence map.",
    icon: Layout,
  },
  {
    query: "Explain backend",
    responseTitle: "ModuleCards",
    description: "The interface reorganizes to highlight core service layers and system entry points.",
    icon: Zap,
  },
  {
    query: "Trace file-service.ts",
    responseTitle: "CodeFlowGraph",
    description: "Generates a detailed code-level trace across multiple functions and files.",
    icon: Share2,
  }
];

export function ShowcaseSection() {
  const [active, setActive] = useState(0);
  const ActiveIcon = SCENARIOS[active].icon;

  return (
    <section id="demo" className="py-32 px-6 bg-surface border-b arch-border border-l-0 border-r-0 border-t-0">
      <div className="arch-container">
        <div className="max-w-3xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary"
          >
            An Interface That Adapts To You.
          </motion.h2>
          <p className="mt-6 text-lg text-text-secondary">
            CodeLore doesn't just give answers; it constructs the perfect visual tool for the specific problem you're solving.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-4">
            {SCENARIOS.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`w-full text-left p-6 transition-all duration-300 flex items-start gap-4 border rounded-sm ${
                  active === idx 
                  ? "bg-background arch-border arch-shadow ring-1 ring-accent/20" 
                  : "bg-background/40 border-transparent hover:border-border/50 text-text-secondary"
                }`}
              >
                <div className={`mt-1 p-2 rounded-sm border arch-border ${active === idx ? "bg-accent text-[#000000]" : "bg-surface text-text-secondary opacity-50"}`}>
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className={`text-xs font-mono font-bold uppercase tracking-widest ${active === idx ? "text-accent" : "text-text-secondary/60"}`}>User Query</p>
                  <p className={`text-xl font-bold ${active === idx ? "text-text-primary" : "text-text-secondary"}`}>"{scenario.query}"</p>
                  {active === idx && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-sm text-text-secondary mt-4 pt-4 border-t border-border/10"
                    >
                      {scenario.description}
                    </motion.p>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-text-primary/5 border arch-border -rotate-1 rounded-sm" />
            <div className="relative h-full w-full bg-surface border arch-border arch-shadow flex flex-col p-8 items-center justify-center text-center overflow-hidden rounded-sm">
               <div className="absolute top-0 inset-x-0 h-10 border-b arch-border bg-text-primary/5 flex items-center px-4 gap-2">
                 <div className="w-2 h-2 rounded-full bg-text-secondary/20" />
                 <div className="w-2 h-2 rounded-full bg-text-secondary/20" />
                 <div className="w-2 h-2 rounded-full bg-text-secondary/20" />
                 <span className="text-[10px] font-mono text-text-secondary/40 ml-2">GEN_PROCESS_ACTIVE</span>
               </div>

               <AnimatePresence mode="wait">
                 <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8 w-full"
                 >
                   <div className="w-20 h-20 mx-auto bg-accent/5 border arch-border flex items-center justify-center text-accent rounded-sm">
                      <ActiveIcon className="w-10 h-10" />
                   </div>
                   
                   <div className="space-y-4">
                      <h3 className="text-2xl font-bold tracking-tight uppercase text-text-primary">{SCENARIOS[active].responseTitle}</h3>
                      <div className="flex flex-col gap-2 max-w-[240px] mx-auto">
                        <div className="h-1.5 bg-text-secondary/20 rounded-full w-full" />
                        <div className="h-1.5 bg-text-secondary/20 rounded-full w-5/6 mx-auto" />
                        <div className="h-1.5 bg-text-secondary/20 rounded-full w-4/6 mx-auto" />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3 mt-8">
                     <div className="aspect-video bg-text-primary/5 arch-border border-dashed p-2">
                        <div className="h-full w-full bg-background/50" />
                     </div>
                     <div className="aspect-video bg-text-primary/5 arch-border border-dashed p-2">
                        <div className="h-full w-full bg-background/50" />
                     </div>
                   </div>
                 </motion.div>
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

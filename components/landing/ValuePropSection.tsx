"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Layout, MessageSquare } from "lucide-react";

export function ValuePropSection() {
  const steps = [
    { icon: <Layout className="w-8 h-8" />, title: "Register", desc: "Define your React components and their schemas." },
    { icon: <MessageSquare className="w-8 h-8" />, title: "Intent", desc: "User expresses what they want in natural language." },
    { icon: <Cpu className="w-8 h-8" />, title: "AI Decision", desc: "Tambo SDK selects the best component for the context." },
    { icon: <Zap className="w-8 h-8" />, title: "Reshape", desc: "UI morphs instantly to satisfy user needs." },
  ];

  return (
    <section className="py-32 px-6 lg:px-20 bg-brutal-white">
      <div className="max-w-6xl mx-auto space-y-24">
        <div className="text-center space-y-6">
          <h2 className="text-6xl lg:text-8xl font-[var(--font-bangers)] text-brutal-black">
            REGISTER COMPONENTS.<br />LET AI DECIDE.
          </h2>
          <div className="max-w-2xl mx-auto h-2 bg-brutal-blue" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white brutal-border brutal-shadow hover:brutal-shadow-blue transition-all p-8 space-y-4 group"
            >
              <div className="w-16 h-16 bg-brutal-black text-brutal-white flex items-center justify-center brutal-border group-hover:bg-brutal-blue transition-colors">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tighter">{step.title}</h3>
              <p className="font-medium text-zinc-600 leading-snug">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative bg-brutal-blue p-12 lg:p-20 brutal-border-thick text-brutal-white overflow-hidden"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h3 className="text-5xl font-[var(--font-bangers)]">NO HARD-CODED ROUTES.</h3>
              <p className="text-xl font-bold italic uppercase">The AI is your UI architect now.</p>
              <p className="text-lg font-medium opacity-90">
                Instead of fixed paths like <code className="bg-black/20 px-1">/overview</code> or <code className="bg-black/20 px-1">/auth</code>, 
                CodeLore dynamically rebuilds the layout based on what you need to see. 
                One conversation. Infinite variations.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-sm aspect-square bg-brutal-black brutal-border rotate-3 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-6xl">🤖</div>
                  <div className="font-[var(--font-bangers)] text-3xl text-brutal-yellow">TAMBO ENGINE</div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative lines */}
          <div className="absolute top-0 right-0 w-32 h-full bg-black/10 -skew-x-12 translate-x-16" />
        </motion.div>
      </div>
    </section>
  );
}

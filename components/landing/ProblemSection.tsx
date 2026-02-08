"use client";

import { motion } from "framer-motion";
import { FolderSearch, LayoutPanelLeft, LineChart } from "lucide-react";

const PROBLEMS = [
  {
    title: "Manual file exploration",
    description: "Digging through nested directories one by one is a 20th-century bottleneck.",
    icon: FolderSearch,
  },
  {
    title: "Fragmented architecture",
    description: "Codebase logic often exists in silos. Connecting the dots manually is error-prone.",
    icon: LayoutPanelLeft,
  },
  {
    title: "Static dashboards",
    description: "Most tools offer fixed views. They don't adapt to the specific question you're asking.",
    icon: LineChart,
  },
];

export function ProblemSection() {
  return (
    <section className="bg-surface py-32 px-6 border-b arch-border border-l-0 border-r-0 border-t-0">
      <div className="arch-container">
        <div className="max-w-3xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary"
          >
            Understanding Large Repositories Is Slow.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-text-secondary"
          >
            Modern development moves fast, but our mental models of the codebase move at the speed of manual exploration.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PROBLEMS.map((problem, idx) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 arch-border bg-background arch-shadow flex flex-col gap-6 rounded-sm"
            >
              <div className="w-12 h-12 rounded-sm bg-accent/5 flex items-center justify-center border arch-border border-accent/20">
                <problem.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold tracking-tight text-text-primary">{problem.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

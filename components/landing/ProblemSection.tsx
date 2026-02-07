"use client";

import { motion } from "framer-motion";

export function ProblemSection() {
  return (
    <section className="bg-brutal-black py-32 px-6 lg:px-20 text-brutal-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="flex flex-col lg:flex-row gap-12 items-end">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-6xl lg:text-8xl font-[var(--font-bangers)] leading-tight">
              APPS MAKE USERS LEARN THE INTERFACE.
            </h2>
          </motion.div>
          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {["Clicking Folders", "Searching Files", "Endless Docs", "Manual Exploration"].map((text) => (
                <div key={text} className="border-2 border-brutal-white p-4 font-bold text-lg uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-brutal-red" /> {text}
                </div>
              ))}
            </div>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed">
              Most tools give you summaries or static trees. <br /><br />
              <span className="text-brutal-white">CodeLore does something different.</span> It's not just an answer — it's a dynamic rebuild of the UI based on your intent.
            </p>
          </div>
        </div>

        <div className="h-1 bg-brutal-white w-full" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-7xl lg:text-[10rem] font-[var(--font-bangers)] text-brutal-yellow tracking-widest italic">
            GENERATIVE UI CHANGES THAT.
          </h2>
        </motion.div>
      </div>

      {/* Decorative background text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20rem] font-bold text-white/5 whitespace-nowrap pointer-events-none select-none">
        PROBLEM PROBLEM PROBLEM
      </div>
    </section>
  );
}

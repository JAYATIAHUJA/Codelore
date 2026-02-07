"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FLOWS = [
  {
    input: "Explain this project",
    component: "ModuleCards",
    content: "Shows high-level architecture: Auth, API, DB, Frontend",
    color: "bg-brutal-yellow",
    icon: "🗺️"
  },
  {
    input: "Focus on backend",
    component: "BackendTree",
    content: "Frontend disappears. Only core logic remains.",
    color: "bg-brutal-blue",
    icon: "⚙️"
  },
  {
    input: "Only auth flow",
    component: "FlowDiagram",
    content: "Login → Middleware → Controller → Database",
    color: "bg-brutal-red",
    icon: "🔐"
  }
];

export function ShowcaseSection() {
  const [activeFlow, setActiveFlow] = useState(0);

  return (
    <section className="py-32 px-6 lg:px-20 bg-brutal-black text-brutal-white">
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
          <h2 className="text-6xl lg:text-9xl font-[var(--font-bangers)]">BUILT WITH TAMBO.</h2>
          <p className="text-xl font-bold uppercase text-brutal-yellow italic max-w-sm">
            Magical results, logical execution.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {FLOWS.map((flow, i) => (
              <button
                key={i}
                onClick={() => setActiveFlow(i)}
                className={`w-full text-left p-6 brutal-border transition-all flex items-center justify-between group ${
                  activeFlow === i ? "bg-brutal-blue translate-x-4" : "bg-zinc-900 border-zinc-700 hover:border-brutal-blue"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold font-mono opacity-50 uppercase tracking-widest">User Query</span>
                  <p className="text-2xl font-bold">"{flow.input}"</p>
                </div>
                <div className={`w-12 h-12 brutal-border flex items-center justify-center text-2xl transition-transform group-hover:rotate-12 ${
                  activeFlow === i ? "bg-white" : "bg-black"
                }`}>
                  {flow.icon}
                </div>
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="brutal-border-thick brutal-shadow bg-zinc-800 aspect-square flex flex-col overflow-hidden">
               <div className="h-10 bg-black flex items-center px-4 gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500" />
                 <div className="w-2 h-2 rounded-full bg-yellow-500" />
                 <div className="w-2 h-2 rounded-full bg-green-500" />
                 <span className="text-[10px] font-mono text-zinc-500 ml-2">TAMBO_RUNTIME_V0.74</span>
               </div>
               
               <div className="flex-1 p-8 flex flex-col justify-center items-center text-center">
                 <AnimatePresence mode="wait">
                   <motion.div
                    key={activeFlow}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="space-y-6"
                   >
                     <div className={`w-32 h-32 mx-auto brutal-border-thick ${FLOWS[activeFlow].color} flex items-center justify-center text-6xl rotate-3 shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)]`}>
                        {FLOWS[activeFlow].icon}
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-3xl font-[var(--font-bangers)] tracking-wide">{FLOWS[activeFlow].component}</h3>
                        <p className="font-mono text-zinc-400 text-sm">{FLOWS[activeFlow].content}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-2 max-w-[200px] mx-auto opacity-50">
                        {[1,2,3,4].map(j => <div key={j} className="h-2 bg-zinc-600 rounded-full" />)}
                     </div>
                   </motion.div>
                 </AnimatePresence>
               </div>
            </div>
            {/* Absolute element behind */}
            <div className="absolute -z-10 top-8 left-8 w-full h-full brutal-border-thick border-brutal-blue" />
          </div>
        </div>
      </div>
    </section>
  );
}

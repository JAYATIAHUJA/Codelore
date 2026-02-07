"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function AllianceSection() {
  return (
    <section className="py-32 px-6 lg:px-20 bg-brutal-yellow relative border-y-8 border-brutal-black overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-12 text-center relative z-10">
        <h2 className="text-7xl lg:text-[9rem] font-[var(--font-bangers)] leading-[0.85] text-brutal-black uppercase italic">
          JOIN THE REBEL ALLIANCE.
        </h2>
        
        <div className="space-y-6">
          <p className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-brutal-black">
            Stop building rigid dashboards.<br />
            Stop forcing users to learn your interface.<br />
            Build systems that listen.
          </p>
          <p className="text-lg font-medium text-brutal-black max-w-2xl mx-auto opacity-80">
            Tambo makes generative UI simple. CodeLore proves it works. 
            The age of the static UI is over.
          </p>
        </div>

        <Link href="/interface" className="inline-block">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="brutal-btn-cyan text-3xl px-12 h-20 uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            Build Adaptive UIs
          </motion.button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { icon: "🚀", title: "New Devs", desc: "Instantly onboard into massive repos." },
          { icon: "😵‍💫", title: "Interns", desc: "No more drowning in folder chaos." },
          { icon: "🏆", title: "Hackathons", desc: "Let judges explore your logic fast." },
          { icon: "🧠", title: "Senior Devs", desc: "Skip the noise in unfamiliar code." }
        ].map((item) => (
          <div key={item.title} className="bg-white brutal-border p-6 space-y-2">
            <span className="text-4xl">{item.icon}</span>
            <h4 className="text-xl font-bold uppercase">{item.title}</h4>
            <p className="font-medium text-sm leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Background Graphic elements */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-8 border-black opacity-10"
      />
      <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-9xl font-bold opacity-5 select-none pointer-events-none">
        REBEL REBEL REBEL REBEL
      </div>
    </section>
  );
}

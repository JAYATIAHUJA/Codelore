"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

const MOCKUP_STATES = [
  { id: "all", label: "Project Overview", color: "bg-brutal-yellow" },
  { id: "auth", label: "Auth Flow", color: "bg-brutal-red" },
  { id: "backend", label: "Backend Structure", color: "bg-brutal-blue" },
];

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const targetTexts = ["Only auth flow", "Show project structure", "Explain backend"];

  useEffect(() => {
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex <= targetTexts[index % targetTexts.length].length) {
        setTypedText(targetTexts[index % targetTexts.length].slice(0, charIndex));
        charIndex++;
      } else {
        setTimeout(() => {
          setIndex((prev) => prev + 1);
          charIndex = 0;
        }, 2000);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center p-6 lg:p-20 overflow-hidden bg-brutal-white">
      {/* Background Graphic Element */}
      <div className="absolute top-(-10%) right-(-10%) w-96 h-96 bg-brutal-blue opacity-10 rotate-12 brutal-border -z-10" />
      
      <div className="flex-1 z-10 space-y-8">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-2"
        >
          <span className="bg-brutal-black text-brutal-white px-3 py-1 font-bold text-sm tracking-widest uppercase">
            Powered by Tambo
          </span>
          <h1 className="text-8xl lg:text-[12rem] font-[var(--font-bangers)] leading-[0.85] tracking-tighter text-brutal-black">
            CODE<br />LORE
          </h1>
          <p className="text-3xl lg:text-5xl font-bold italic text-brutal-black uppercase">
            Talk To Your Codebase.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-xl text-xl font-medium leading-relaxed"
        >
          Stop clicking folders. Stop searching files. <br />
          Experience a UI that dynamically rebuilds itself based on your intent. 
          The actual layout changes while you chat.
        </motion.p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <Link href="/interface">
            <button className="brutal-btn text-xl flex items-center gap-2 group">
              Enter The Interface <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <button className="brutal-btn-cyan px-8">
            Meet Tambo
          </button>
          <button className="brutal-btn-pink-square">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.8425 24V0H13.1575V24H10.8425ZM0 13.1664V10.8336H24V13.1664H0Z" fill="black"/>
            </svg>
          </button>
        </motion.div>
      </div>

      <div className="flex-1 w-full lg:w-1/2 mt-20 lg:mt-0 relative">
        <motion.div
          initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative bg-white brutal-border-thick brutal-shadow w-full aspect-[4/3] flex flex-col overflow-hidden"
        >
          {/* Mockup Toolbar */}
          <div className="h-12 border-b-4 border-black bg-zinc-100 flex items-center px-4 justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-brutal-red brutal-border" />
              <div className="w-3 h-3 rounded-full bg-brutal-yellow brutal-border" />
              <div className="w-3 h-3 rounded-full bg-brutal-blue brutal-border" />
            </div>
            <div className="bg-white border-2 border-black px-2 py-0.5 text-xs font-mono font-bold">
              localhost:3000/codelore
            </div>
          </div>

          {/* Mockup Content */}
          <div className="flex-1 p-6 relative flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={index % MOCKUP_STATES.length}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 space-y-4"
              >
                <div className={`h-8 w-48 brutal-border-thick ${MOCKUP_STATES[index % MOCKUP_STATES.length].color}`} />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 brutal-border bg-zinc-50 p-3 flex flex-col justify-end">
                      <div className="h-2 w-1/2 bg-zinc-300" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Simulated Input */}
            <div className="mt-auto relative">
              <div className="brutal-border-thick bg-white p-3 flex items-center gap-3">
                <Terminal size={20} className="text-zinc-400" />
                <span className="font-mono text-lg font-bold">
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-6 bg-brutal-black ml-1 align-middle"
                  />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Floating Accents */}
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-brutal-yellow brutal-border rotate-12 -z-10" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-brutal-red brutal-border -rotate-6 -z-10" />
      </div>
    </section>
  );
}

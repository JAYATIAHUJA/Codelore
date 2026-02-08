"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-48 pb-20 px-6 bg-background overflow-hidden">
      {/* Decorative architectural grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="arch-container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border arch-border bg-surface-elevated/50 text-[10px] font-bold tracking-widest uppercase text-text-secondary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Architecture Intelligence
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-text-primary leading-[1.1] md:leading-[0.95]">
            Talk To Your <br />
            <span className="text-accent italic font-light tracking-tight">Codebase.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary font-medium leading-relaxed">
            CodeLore connects to your GitHub repository and transforms complex architectures into visual, interactive intelligence maps powered by generative UI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link href="/interface">
              <button className="brand-btn-primary group">
                <span className="text-[13px] font-bold uppercase tracking-[0.2em] font-mono">Get Started For Free</span>
                <div className="brand-btn-icon">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </Link>
            <Link href="#demo">
              <button className="btn-expand h-14 px-8 flex items-center justify-center">
                View Demo
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Elegant UI Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 w-full max-w-5xl arch-border bg-surface arch-shadow p-2 rounded-sm overflow-hidden"
        >
          <div className="bg-text-primary/5 arch-border border-l-0 border-r-0 border-t-0 p-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-text-secondary/20" />
              <div className="w-3 h-3 rounded-full bg-text-secondary/20" />
              <div className="w-3 h-3 rounded-full bg-text-secondary/20" />
            </div>
            <div className="ml-4 px-3 py-1 bg-surface-elevated border arch-border rounded text-[10px] font-mono text-text-secondary flex-1 max-w-xs text-left">
              codelore.ai/workspace/repo-analysis
            </div>
          </div>
          
          <div className="aspect-[16/9] bg-background flex">
            {/* Mock Sidebar */}
            <div className="w-16 md:w-48 border-r arch-border h-full p-4 hidden md:flex flex-col gap-6">
              <div className="h-4 w-24 bg-text-primary/10 rounded" />
              <div className="space-y-3">
                <div className="h-3 w-32 bg-text-primary/5 rounded" />
                <div className="h-3 w-28 bg-text-primary/5 rounded" />
                <div className="h-3 w-36 bg-text-primary/5 rounded" />
              </div>
            </div>
            
            {/* Mock Canvas Area */}
            <div className="flex-1 p-8 overflow-hidden relative">
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              
              <div className="relative grid grid-cols-2 gap-8 h-full">
                <div className="arch-border bg-card-bg p-4 h-3/4 flex flex-col gap-3">
                  <div className="h-4 w-20 bg-accent/20 rounded" />
                  <div className="h-2 w-full bg-text-secondary/10 rounded" />
                  <div className="h-2 w-full bg-text-secondary/10 rounded" />
                  <div className="h-2 w-2/3 bg-text-secondary/10 rounded" />
                  <div className="mt-auto h-24 w-full bg-text-secondary/5 rounded border arch-border border-dashed" />
                </div>
                <div className="arch-border bg-card-bg p-4 h-full flex flex-col gap-3 translate-y-8">
                  <div className="h-4 w-24 bg-text-secondary/20 rounded" />
                  <div className="h-2 w-full bg-text-secondary/10 rounded" />
                  <div className="h-2 w-3/4 bg-text-secondary/10 rounded" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="h-12 bg-text-secondary/5 rounded border arch-border" />
                    <div className="h-12 bg-text-secondary/5 rounded border arch-border" />
                  </div>
                </div>
              </div>

              {/* Chat Dock Mockup Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-14 bg-surface arch-border arch-shadow flex items-center px-4 gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">CL</div>
                <div className="text-xs text-text-secondary font-mono whitespace-nowrap overflow-hidden">"Explain the entry point flow..."</div>
                <div className="ml-auto w-6 h-6 bg-text-secondary/10 rounded" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

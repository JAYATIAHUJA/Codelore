"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  return (
    <div className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6">
      <nav className="w-full max-w-5xl glass-nav border rounded-full h-14 flex items-center justify-between px-8 arch-shadow">
        {/* Left Links */}
        <div className="flex items-center gap-8">
          <Link href="/docs" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors">
            Docs <ArrowUpRight size={12} className="opacity-60" />
          </Link>
          <Link href="/blog" className="text-[11px] font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors">
            Blog
          </Link>
        </div>

        {/* Center: Brand */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group">
          <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform duration-300">
             <div className="w-2.5 h-2.5 bg-white dark:bg-[#000000] rounded-full" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-text-primary uppercase group-hover:tracking-normal transition-all duration-300">CodeLore</span>
        </Link>

        {/* Right Links */}
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex items-center gap-8 mr-4">
            <Link href="#pricing" className="text-[11px] font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors">
              Pricing
            </Link>
            <Link href="#contact" className="text-[11px] font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors">
              Contact Us
            </Link>
          </div>
          
          <div className="flex items-center gap-4 text-text-primary">
            <ThemeToggle />
            <Link href="/interface">
              <button className="btn-expand h-10 flex items-center justify-center">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

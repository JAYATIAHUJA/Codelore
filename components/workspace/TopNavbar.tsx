"use client";

import { motion } from "framer-motion";
import { Github, Search, Share, Settings, ChevronDown, Command } from "lucide-react";

export function TopNavbar() {
  return (
    <nav className="h-14 border-b-2 border-brutal-black bg-white flex items-center justify-between px-4 z-50 sticky top-0">
      {/* Left: Branding & Repo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brutal-black flex items-center justify-center brutal-border-thick rotate-3 shadow-[2px_2px_0px_black]">
             <span className="text-white font-[var(--font-bangers)] text-sm tracking-tight">CL</span>
          </div>
          <h1 className="font-[var(--font-bangers)] text-xl tracking-wider">CODELORE</h1>
        </div>

        <div className="h-6 w-[2px] bg-zinc-200" />

        <div className="flex items-center gap-3 group cursor-pointer hover:bg-zinc-50 px-2 py-1 rounded transition-colors">
          <Github size={18} className="text-zinc-600" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-400 leading-none">Repository</span>
            <div className="flex items-center gap-1">
               <span className="text-sm font-bold font-mono">acme-corp / phoenix-web</span>
               <ChevronDown size={14} className="text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Center: Command Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="w-full h-9 brutal-border bg-emerald-50/50 flex items-center px-3 gap-3 cursor-pointer hover:bg-white transition-all group">
          <Search size={16} className="text-zinc-400 group-hover:text-brutal-black" />
          <span className="text-sm font-medium text-zinc-400 flex-1">Search files, functions, flows...</span>
          <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-300 px-1.5 py-0.5 rounded shadow-[1px_1px_0px_black]">
            <Command size={10} />
            <span className="text-[10px] font-bold">K</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="brutal-btn-cyan h-9 px-4 text-xs font-bold uppercase flex items-center gap-2">
          Connect GitHub
        </button>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-zinc-50 transition-all rounded shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
            <Share size={16} />
          </button>
          <button className="w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-zinc-50 transition-all rounded shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

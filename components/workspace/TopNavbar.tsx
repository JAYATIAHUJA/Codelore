"use client";

import { motion } from "framer-motion";
import { Github, Search, Share, Settings, ChevronDown, Command, Unplug } from "lucide-react";
import { useRepo } from "@/components/providers/RepoProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";

export function TopNavbar() {
  const { repoData, setRepoData } = useRepo();

  return (
    <nav className="h-16 border-b arch-border bg-surface flex items-center justify-between px-6 z-50 sticky top-0">
      {/* Left: Branding & Repo */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-5 h-5 bg-accent rounded-sm flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform duration-300">
             <div className="w-2 h-2 bg-[#000000] rounded-full" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-text-primary uppercase group-hover:tracking-normal transition-all duration-300">CodeLore</span>
        </Link>

        <div className="h-6 w-[1px] bg-border" />

        {repoData ? (
          <div className="flex items-center gap-3 group px-2 py-1 transition-colors animate-in slide-in-from-left-2">
            <div className="w-8 h-8 rounded-sm bg-accent/10 flex items-center justify-center text-accent arch-border">
              <Github size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-text-secondary leading-none tracking-widest">Active Repository</span>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-bold font-mono text-text-primary">{repoData.repo.owner} / {repoData.repo.name}</span>
                 <button 
                  onClick={() => setRepoData(null)}
                  className="p-1 hover:bg-accent/10 hover:text-accent rounded transition-colors text-text-secondary"
                  title="Disconnect Repository"
                 >
                    <Unplug size={12} />
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3 py-1 bg-background border arch-border rounded-sm">
             <div className="w-2 h-2 rounded-full bg-text-secondary/20 animate-pulse" />
             <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Waiting for Connection</span>
          </div>
        )}
      </div>

      {/* Center: Command Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="w-full h-10 border arch-border bg-background flex items-center px-4 gap-3 cursor-pointer hover:border-accent/40 transition-all group rounded-sm">
          <Search size={16} className="text-text-secondary group-hover:text-accent" />
          <span className="text-sm font-medium text-text-secondary flex-1">Search architecture...</span>
          <div className="flex items-center gap-1 bg-surface border arch-border px-1.5 py-0.5 rounded text-[10px] font-mono text-text-secondary">
            <Command size={10} />
            <span className="font-bold">K</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-[1px] h-6 bg-border" />
          <div className="flex items-center gap-2">
            <button 
              title="Share Workspace"
              className="w-10 h-10 border arch-border bg-surface flex items-center justify-center hover:bg-background transition-all rounded-sm text-text-secondary hover:text-accent arch-shadow"
            >
              <Share size={16} />
            </button>
            <button 
              title="Settings"
              className="w-10 h-10 border arch-border bg-surface flex items-center justify-center hover:bg-background transition-all rounded-sm text-text-secondary hover:text-accent arch-shadow"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
        
        {!repoData && (
          <button 
            onClick={() => document.querySelector("input")?.focus()}
            className="arch-btn-primary h-10 px-4 text-xs font-bold uppercase"
          >
            Connect GitHub
          </button>
        )}
      </div>
    </nav>
  );
}

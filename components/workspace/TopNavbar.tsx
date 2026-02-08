"use client";

import { motion } from "framer-motion";
import { Github, Search, Share, Settings, Command, Unplug, Plus, X } from "lucide-react";
import { useRepo } from "@/components/providers/RepoProvider";
import { useWorkspaceTabs } from "@/components/providers/WorkspaceTabsProvider";

export function TopNavbar() {
  const { repoData, setRepoData } = useRepo();
  const { tabs, activeTabId, addTab, removeTab, switchTab } = useWorkspaceTabs();

  return (
    <nav className="h-14 border-b-2 border-brutal-black bg-white flex items-center justify-between px-4 z-50 sticky top-0">
      {/* Left: Branding & Tabs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brutal-black flex items-center justify-center brutal-border-thick rotate-3 shadow-[2px_2px_0px_black]">
             <span className="text-white font-[var(--font-bangers)] text-sm tracking-tight">CL</span>
          </div>
          <h1 className="font-[var(--font-bangers)] text-xl tracking-wider">CODELORE</h1>
        </div>

        <div className="h-6 w-[2px] bg-zinc-200" />

        {/* Workspace Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`group flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-2 rounded transition-all ${
                tab.id === activeTabId
                  ? "border-black bg-brutal-black text-white shadow-[2px_2px_0px_black]"
                  : "border-zinc-300 bg-white text-zinc-500 hover:border-black hover:text-black"
              }`}
            >
              {tab.repoData ? (
                <span className="flex items-center gap-1">
                  <Github size={10} />
                  {tab.repoData.repo.name}
                </span>
              ) : (
                <span>Empty</span>
              )}
              {tabs.length > 1 && (
                <span
                  onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }}
                  className={`ml-1 rounded-full p-0.5 transition-colors ${
                    tab.id === activeTabId 
                      ? "hover:bg-white/20" 
                      : "hover:bg-zinc-200 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <X size={8} />
                </span>
              )}
            </button>
          ))}

          {/* Add Tab Button */}
          <button
            onClick={addTab}
            className="w-7 h-7 border-2 border-dashed border-zinc-300 flex items-center justify-center hover:border-black hover:bg-zinc-50 transition-all rounded text-zinc-400 hover:text-black"
            title="Open new workspace"
          >
            <Plus size={14} />
          </button>
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
        {!repoData && (
          <button 
            onClick={() => document.querySelector("input")?.focus()}
            className="brutal-btn-cyan h-9 px-4 text-xs font-bold uppercase flex items-center gap-2"
          >
            Connect GitHub
          </button>
        )}
        <div className="flex items-center gap-2">
          <button 
            title="Share Workspace"
            className="w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-zinc-50 transition-all rounded shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Share size={16} />
          </button>
          <button 
            title="Settings"
            className="w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-zinc-50 transition-all rounded shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

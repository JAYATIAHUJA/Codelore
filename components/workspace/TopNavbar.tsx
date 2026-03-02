"use client";

import { motion } from "framer-motion";
import { Github, Search, Share, Settings, Command, Unplug, Plus, X, LogOut, User } from "lucide-react";
import { useRepo } from "@/components/providers/RepoProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useWorkspaceTabs } from "@/components/providers/WorkspaceTabsProvider";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function TopNavbar() {
  const { repoData, setRepoData } = useRepo();
  const { user, isAuthenticated, isLoading: isAuthLoading, login, logout } = useAuth();
  const { tabs, activeTabId, addTab, removeTab, switchTab } = useWorkspaceTabs();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="h-16 border-b arch-border bg-navbar-bg backdrop-blur-xl flex items-center justify-between px-6 z-50 sticky top-0">
      {/* Left: Branding & Tabs */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-5 h-5 bg-accent rounded-sm flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform duration-300">
             <div className="w-2 h-2 bg-white dark:bg-[#000000] rounded-full" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-text-primary uppercase group-hover:tracking-normal transition-all duration-300">CodeLore</span>
        </Link>

        <div className="h-6 w-[1px] bg-border" />

        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`group flex items-center gap-2 h-9 px-4 rounded-sm border transition-all cursor-pointer ${
                tab.id === activeTabId
                  ? "arch-border bg-background text-accent"
                  : "border-transparent text-text-secondary hover:bg-text-primary/5 hover:text-text-primary"
              }`}
              onClick={() => switchTab(tab.id)}
            >
              <Github size={12} className={tab.id === activeTabId ? "text-accent" : "text-text-secondary"} />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                {tab.repoData ? tab.repoData.repo.name : "New Workspace"}
              </span>
              
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className={`ml-1 p-0.5 rounded-sm transition-colors ${
                    tab.id === activeTabId
                      ? "hover:bg-accent/10 text-accent"
                      : "hover:bg-text-primary/10 text-text-secondary/40 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addTab}
            className="w-9 h-9 border border-dashed arch-border flex items-center justify-center hover:bg-text-primary/5 transition-all rounded-sm text-text-secondary hover:text-accent"
            title="Open new workspace"
          >
            <Plus size={14} />
          </button>
        </div>
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
        
        {/* Auth Section */}
        {isAuthLoading ? (
          <div className="w-10 h-10 border arch-border bg-surface rounded-sm animate-pulse" />
        ) : isAuthenticated && user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 h-10 px-2 border arch-border bg-surface hover:bg-background transition-all rounded-sm arch-shadow"
              title={user.login}
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-primary hidden lg:inline">
                {user.login}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 bg-surface border arch-border arch-shadow rounded-sm z-50 overflow-hidden">
                <div className="px-4 py-3 border-b arch-border">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-xs font-bold text-text-primary">{user.name || user.login}</p>
                      <p className="text-[10px] text-text-secondary">@{user.login}</p>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:bg-text-primary/5 hover:text-text-primary rounded-sm transition-colors"
                  >
                    <User size={12} />
                    GitHub Profile
                  </a>
                  <button
                    onClick={async () => {
                      await logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 rounded-sm transition-colors"
                  >
                    <LogOut size={12} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={login}
            className="arch-btn-primary h-10 px-4 text-xs font-bold uppercase flex items-center gap-2"
          >
            <Github size={14} />
            Connect GitHub
          </button>
        )}
      </div>
    </nav>
  );
}

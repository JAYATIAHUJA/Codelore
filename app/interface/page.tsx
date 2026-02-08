"use client";

import React, { useEffect } from "react";
import { TopNavbar } from "@/components/workspace/TopNavbar";
import { Sidebar } from "@/components/workspace/Sidebar";
import { WorkspaceContent } from "@/components/workspace/WorkspaceContent";
import { GitHubInput } from "@/components/workspace/GitHubInput";
import { useRepo } from "@/components/providers/RepoProvider";
import { useWorkspaceTabs } from "@/components/providers/WorkspaceTabsProvider";

export default function WorkspaceInterface() {
  const { repoData, setRepoData, setIsLoading, setError } = useRepo();
  const { activeTab, updateTab, activeTabId } = useWorkspaceTabs();

  // Sync: when switching tabs, load that tab's repo data into the RepoProvider
  useEffect(() => {
    setRepoData(activeTab.repoData);
    setIsLoading(activeTab.isLoading);
    setError(activeTab.error);
  }, [activeTabId]);

  // Sync: when repo data changes (e.g. connecting a new repo), save it to the active tab
  useEffect(() => {
    updateTab(activeTabId, { repoData });
  }, [repoData]);

  const isRepoConnected = !!repoData;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-brutal-black selection:bg-brutal-blue selection:text-white">
      <TopNavbar />

      <main className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        {/* key={activeTabId} forces remount → each tab gets a fresh TamboThreadProvider */}
        <WorkspaceContent key={activeTabId} tabId={activeTabId}>
          {/* Initial State Overlay: GitHub Connect */}
          {!isRepoConnected && (
            <div className="absolute inset-0 flex items-center justify-center p-8 z-20 bg-white/60 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-auto">
              <div className="max-w-xl w-full space-y-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-5xl font-[var(--font-bangers)] uppercase tracking-widest italic outline-text">Initialize Workspace</h2>
                  <p className="font-mono text-sm uppercase font-bold text-zinc-500">Connect a public codebase to manifest its topology on the infinite canvas.</p>
                </div>
                <GitHubInput />
                <div className="flex justify-center gap-12 pt-8 opacity-20 filter grayscale">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 brutal-border bg-emerald-100" />
                    <span className="text-[10px] font-bold">SIDEBAR TREE</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 brutal-border bg-blue-100" />
                    <span className="text-[10px] font-bold">AI ANALYSIS</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 brutal-border bg-pink-100" />
                    <span className="text-[10px] font-bold">SPATIAL NODES</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </WorkspaceContent>
      </main>
    </div>
  );
}

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
    <div className="flex flex-col h-screen overflow-hidden bg-background text-text-primary">
      <TopNavbar />

      <main className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <WorkspaceContent key={activeTabId} tabId={activeTabId}>
          {/* Initial State Overlay: GitHub Connect */}
          {!isRepoConnected && (
            <div className="absolute inset-0 flex items-center justify-center p-8 z-20 bg-background/60 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-auto">
              <div className="max-w-xl w-full space-y-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border arch-border bg-surface-elevated/50 text-[10px] font-bold tracking-widest uppercase text-text-secondary">
                    Initialization Phase
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">Connect Your <br /> Architecture.</h2>
                  <p className="text-text-secondary text-sm max-w-sm mx-auto">Connect a public GitHub repository to manifest its topology on the professional infinite canvas.</p>
                </div>
                <div className="p-8 bg-surface arch-border arch-shadow rounded-sm">
                  <GitHubInput />
                </div>
                <div className="flex justify-center gap-12 pt-8 opacity-40">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 arch-border bg-text-primary/5 rounded-sm" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Tree View</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 arch-border bg-accent/10 rounded-sm" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">AI Scan</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 arch-border bg-text-primary/5 rounded-sm" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Spatial</span>
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

"use client";

import React from "react";
import { TopNavbar } from "@/components/workspace/TopNavbar";
import { Sidebar } from "@/components/workspace/Sidebar";
import { ChatDock } from "@/components/workspace/ChatDock";
import { InfiniteCanvas } from "@/components/workspace/InfiniteCanvas";
import { GitHubInput } from "@/components/workspace/GitHubInput";
import { useRepo } from "@/components/providers/RepoProvider";

export default function WorkspaceInterface() {
  const { repoData } = useRepo();
  const isRepoConnected = !!repoData;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-text-primary">
      <TopNavbar />

      <main className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <div className="flex-1 relative overflow-hidden flex flex-col">
          <InfiniteCanvas>
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
          </InfiniteCanvas>
        </div>

        <ChatDock />
      </main>
    </div>
  );
}

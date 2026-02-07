"use client";

import React, { useState, useEffect } from "react";
import { useTamboThread } from "@tambo-ai/react";
import { TopNavbar } from "@/components/workspace/TopNavbar";
import { Sidebar } from "@/components/workspace/Sidebar";
import { ChatDock } from "@/components/workspace/ChatDock";
import { Canvas, CanvasNode } from "@/components/workspace/Canvas";
import { GitHubInput } from "@/components/workspace/GitHubInput";
import { useRepo } from "@/components/providers/RepoProvider";

interface WorkspaceNode {
  id: string;
  component: React.ReactNode;
  x: number;
  y: number;
}

export default function WorkspaceInterface() {
  const { thread, sendThreadMessage, isIdle } = useTamboThread();
  const { repoData } = useRepo();
  const [nodes, setNodes] = useState<WorkspaceNode[]>([]);
  const [nodeCount, setNodeCount] = useState(0);

  const isLoading = !isIdle;
  const messages = thread?.messages ?? [];
  const isRepoConnected = !!repoData;

  // Watch for new rendered components to add to canvas
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && lastMessage.renderedComponent) {
      // Check if this component is already added (by message ID)
      setNodes(prev => {
        const id = lastMessage.id;
        if (prev.some(n => n.id === id)) return prev;
        
        // Arrange new nodes in a slight cascade or grid
        const spacing = 480;
        const x = (nodeCount % 3) * spacing + 100;
        const y = Math.floor(nodeCount / 3) * spacing + 20;
        
        setNodeCount(c => c + 1);
        return [...prev, { id, component: lastMessage.renderedComponent, x, y }];
      });
    }
  }, [messages, nodeCount]);

  const handleSend = async (text: string) => {
    try {
      await sendThreadMessage(text);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-brutal-black selection:bg-brutal-blue selection:text-white">
      <TopNavbar />
      
      <main className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <Canvas>
            {/* Welcome Hint on Canvas */}
            {isRepoConnected && nodes.length === 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-4 opacity-20 pointer-events-none">
                  <div className="text-9xl grayscale">🌌</div>
                  <h2 className="text-4xl font-[var(--font-bangers)] uppercase tracking-widest italic">Canvas Ready</h2>
                  <p className="font-mono text-sm max-w-xs uppercase font-bold">Chat with the repo to manifest architecture nodes here.</p>
              </div>
            )}

            {/* AI Manifested Nodes */}
            {nodes.map((node) => (
              <CanvasNode key={node.id} id={node.id} initialX={node.x} initialY={node.y}>
                  <div className="w-[450px] overflow-hidden">
                    {node.component}
                  </div>
              </CanvasNode>
            ))}
          </Canvas>

          {/* Initial State Overlay: GitHub Connect */}
          {!isRepoConnected && (
            <div className="absolute inset-0 flex items-center justify-center p-8 z-20 bg-white/60 backdrop-blur-sm animate-in fade-in duration-500">
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
        </div>

        <ChatDock 
          messages={messages} 
          onSend={handleSend} 
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
}

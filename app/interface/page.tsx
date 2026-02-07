"use client";

import React, { useState, useEffect } from "react";
import { useTamboThread } from "@tambo-ai/react";
import { TopNavbar } from "@/components/workspace/TopNavbar";
import { Sidebar } from "@/components/workspace/Sidebar";
import { ChatDock } from "@/components/workspace/ChatDock";
import { Canvas, CanvasNode } from "@/components/workspace/Canvas";

interface WorkspaceNode {
  id: string;
  component: React.ReactNode;
  x: number;
  y: number;
}

export default function WorkspaceInterface() {
  const { thread, sendThreadMessage, isIdle } = useTamboThread();
  const [nodes, setNodes] = useState<WorkspaceNode[]>([]);
  const [nodeCount, setNodeCount] = useState(0);

  const isLoading = !isIdle;
  const messages = thread?.messages ?? [];

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
        
        <Canvas>
           {/* Welcome Hint on Canvas */}
           {nodes.length === 0 && (
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

        <ChatDock 
          messages={messages} 
          onSend={handleSend} 
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
}

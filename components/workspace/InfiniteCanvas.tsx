"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { useTamboThread } from "@tambo-ai/react";

interface CanvasProps {
  children?: React.ReactNode;
}

interface WorkspaceNode {
  id: string;
  component: React.ReactNode;
  x: number;
  y: number;
}

export function InfiniteCanvas({ children }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Manual Node Management Logic
  const { thread } = useTamboThread();
  const messages = thread?.messages ?? [];
  const [nodes, setNodes] = useState<WorkspaceNode[]>([]);
  const [nodeCount, setNodeCount] = useState(0);

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

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom((prev) =>
          Math.min(Math.max(prev - e.deltaY * 0.001, 0.4), 2)
        );
      }
    };
    const div = canvasRef.current;
    div?.addEventListener("wheel", handleWheel, { passive: false });
    return () => div?.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={canvasRef}
      className="flex-1 bg-zinc-50 overflow-hidden relative"
      style={{
        backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    >
      {/* YOUR TRANSFORM LAYER */}
      <motion.div
        className="w-[5000px] h-[5000px] relative pointer-events-none"
        style={{
          scale: zoom,
          x: pan.x,
          y: pan.y,
        }}
      >
        {/* Rendered Nodes */}
        <div className="absolute inset-0 pointer-events-auto">
          {nodes.map((node) => (
            <CanvasNode key={node.id} id={node.id} initialX={node.x} initialY={node.y}>
              <div className="w-[450px] overflow-hidden">
                {node.component}
              </div>
            </CanvasNode>
          ))}
        </div>
      </motion.div>

      {/* Children Layer (for Overlays) */}
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>

      {/* HUD stays unchanged */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 z-10 pointer-events-auto">
        <div className="bg-white border-2 border-black flex gap-1 p-1 shadow-[4px_4px_0px_black]">
          <ControlButton
            icon={<RotateCcw size={14} />}
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          />
          <div className="w-[1px] bg-zinc-200 mx-1" />
          <ControlButton
            icon={<Minimize2 size={14} />}
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.4))}
          />
          <span className="text-[10px] font-bold w-10 text-center flex items-center justify-center">
            {Math.round(zoom * 100)}%
          </span>
          <ControlButton
            icon={<Maximize2 size={14} />}
            onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
          />
        </div>

        <div className="bg-brutal-black text-white px-3 py-1.5 border-2 border-black font-bold text-[10px] tracking-widest uppercase shadow-[4px_4px_0px_white]">
          Infinite AI Canvas V1.0
        </div>
      </div>
    </div>
  );
}

function ControlButton({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 transition-colors active:translate-y-[1px]"
    >
      {icon}
    </button>
  );
}

// Wrapper for elements placed on canvas
export function CanvasNode({ id, initialX, initialY, children }: { id: string; initialX: number; initialY: number; children: React.ReactNode }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute p-2 bg-transparent pointer-events-auto"
      style={{ zIndex: 1 }}
    >
      <div className="group relative">
        {/* Drag Handle Top Bar */}
        <div className="h-4 bg-zinc-100 border-x-2 border-t-2 border-brutal-black cursor-grab active:cursor-grabbing flex items-center px-1">
          <div className="flex gap-0.5 opacity-30">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-0.5 h-0.5 bg-black rounded-full" />)}
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

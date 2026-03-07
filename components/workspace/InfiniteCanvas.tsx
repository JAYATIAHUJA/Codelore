"use client";

import { useChat, RenderedComponent } from "@/hooks/useChat";
import { CodeFlowGraph } from "@/components/generative/CodeFlowGraph";
import { FileSummary } from "@/components/generative/FileSummary";
import { FlowDiagram } from "@/components/generative/FlowDiagram";
import { GenerativeTable } from "@/components/generative/GenerativeTable";
import { GuidanceCard } from "@/components/generative/GuidanceCard";
import { ModuleCards } from "@/components/generative/ModuleCards";
import { ProjectGraph } from "@/components/generative/ProjectGraph";
import { TreeView } from "@/components/generative/TreeView";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Component Map ────────────────────────────────────────────────────────────

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  ProjectGraph,
  CodeFlowGraph,
  ModuleCards,
  TreeView,
  FileSummary,
  FlowDiagram,
  GenerativeTable,
  GuidanceCard,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface CanvasProps {
  children?: React.ReactNode;
}

interface WorkspaceNode {
  id: string;
  component: React.ReactNode;
  x: number;
  y: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InfiniteCanvas({ children }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const { renderedComponents } = useChat();
  const [nodes, setNodes] = useState<WorkspaceNode[]>([]);
  const processedIds = useRef(new Set<string>());

  // Watch for new rendered components from the chat system
  useEffect(() => {
    for (const rc of renderedComponents) {
      if (processedIds.current.has(rc.id)) continue;
      processedIds.current.add(rc.id);

      const Component = COMPONENT_MAP[rc.component];
      if (!Component) {
        console.warn(`Unknown component: ${rc.component}`);
        continue;
      }

      // Arrange new nodes in a grid
      const spacing = 480;
      const count = processedIds.current.size - 1;
      const x = (count % 3) * spacing + 100;
      const y = Math.floor(count / 3) * spacing + 20;

      setNodes((prev) => [
        ...prev,
        {
          id: rc.id,
          component: <Component {...rc.props} />,
          x,
          y,
        },
      ]);
    }
  }, [renderedComponents]);

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
      className="flex-1 bg-background overflow-hidden relative"
      style={{
        backgroundImage: `radial-gradient(circle, var(--text-primary) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        backgroundPosition: "center",
        opacity: 0.8
      }}
    >
      {/* Transform Layer */}
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

      {/* HUD */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3 z-10 pointer-events-auto">
        <div className="bg-surface border arch-border flex gap-1 p-1 arch-shadow rounded-sm">
          <ControlButton
            icon={<RotateCcw size={14} />}
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          />
          <div className="w-[1px] bg-border mx-1" />
          <ControlButton
            icon={<Minimize2 size={14} />}
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.4))}
          />
          <span className="text-[10px] font-bold w-12 text-center flex items-center justify-center text-text-primary">
            {Math.round(zoom * 100)}%
          </span>
          <ControlButton
            icon={<Maximize2 size={14} />}
            onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
          />
        </div>

        <div className="bg-text-primary text-background px-3 py-1.5 border arch-border font-bold text-[9px] tracking-[0.2em] uppercase arch-shadow rounded-sm">
          Topology Matrix V2.0
        </div>
      </div>
    </div>
  );
}

function ControlButton({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center hover:bg-background transition-colors text-text-secondary hover:text-accent"
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
        <div className="h-6 bg-surface border arch-border border-b-0 cursor-grab active:cursor-grabbing flex items-center px-3 gap-2 rounded-t-sm">
          <div className="flex gap-1.5 grayscale opacity-30">
            <div className="w-1.5 h-1.5 rounded-full bg-text-secondary" />
            <div className="w-1.5 h-1.5 rounded-full bg-text-secondary" />
            <div className="w-1.5 h-1.5 rounded-full bg-text-secondary" />
          </div>
          <span className="text-[8px] font-mono text-text-secondary/40 uppercase tracking-widest ml-auto">Visual_Manifest_v.{id.slice(0, 4)}</span>
        </div>

        {/* Content */}
        <div className="arch-border bg-surface arch-shadow rounded-b-sm overflow-hidden">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

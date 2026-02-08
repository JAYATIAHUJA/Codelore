"use client";

import { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";

interface GraphNode {
  id: string;
  label: string;
  group?: string;
  type?: string;
  description?: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

interface GraphComponentProps {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  repoUrl?: string;
}

const GROUP_COLORS: Record<string, { background: string; border: string; fontColor: string }> = {
  core: { background: "#6366f1", border: "#4f46e5", fontColor: "#ffffff" },
  ui: { background: "#8b5cf6", border: "#7c3aed", fontColor: "#ffffff" },
  data: { background: "#06b6d4", border: "#0891b2", fontColor: "#ffffff" },
  config: { background: "#f59e0b", border: "#d97706", fontColor: "#000000" },
  service: { background: "#10b981", border: "#059669", fontColor: "#ffffff" },
  entry: { background: "#ef4444", border: "#dc2626", fontColor: "#ffffff" },
  external: { background: "#64748b", border: "#475569", fontColor: "#ffffff" },
  test: { background: "#a855f7", border: "#9333ea", fontColor: "#ffffff" },
  build: { background: "#f97316", border: "#ea580c", fontColor: "#ffffff" },
};

export default function GraphComponent({ nodes = [], edges = [], repoUrl = "" }: GraphComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || !nodes || nodes.length === 0) return;

    if (networkRef.current) {
      networkRef.current.destroy();
      networkRef.current = null;
    }

    // Validate edges — only keep edges where both node IDs exist
    const nodeIds = new Set(nodes.map((n) => n.id));
    const validEdges = (edges || []).filter(
      (e) => e && e.from && e.to && nodeIds.has(e.from) && nodeIds.has(e.to)
    );

    const visNodes = new DataSet(
      nodes.map((node) => {
        const group = node.group || node.type || "core";
        const colors = GROUP_COLORS[group] || GROUP_COLORS.core;
        return {
          id: node.id,
          label: node.label || node.id,
          title: node.description || node.label || node.id,
          color: {
            background: colors.background,
            border: colors.border,
            highlight: { background: colors.border, border: colors.background },
          },
          font: {
            color: colors.fontColor,
            size: 14,
            face: "Inter, system-ui, sans-serif",
          },
          shape: "box",
          borderWidth: 2,
          margin: { top: 10, bottom: 10, left: 15, right: 15 },
          shadow: { enabled: true, color: "rgba(0,0,0,0.2)", size: 5, x: 2, y: 2 },
        };
      })
    );

    const visEdges = new DataSet(
      validEdges.map((edge, index) => ({
        id: `edge-${index}`,
        from: edge.from,
        to: edge.to,
        label: edge.label || "",
        arrows: { to: { enabled: true, scaleFactor: 0.8 } },
        color: { color: "#94a3b8", highlight: "#6366f1", opacity: 0.8 },
        font: { size: 10, color: "#94a3b8", strokeWidth: 3, strokeColor: "#0f172a" },
        smooth: { enabled: true, type: "cubicBezier", roundness: 0.4 },
        width: 1.5,
      }))
    );

    const options = {
      physics: {
        enabled: true,
        solver: "forceAtlas2Based" as const,
        forceAtlas2Based: {
          gravitationalConstant: -40,
          centralGravity: 0.005,
          springLength: 180,
          springConstant: 0.04,
          damping: 0.4,
          avoidOverlap: 0.8,
        },
        stabilization: { enabled: true, iterations: 200, updateInterval: 25 },
      },
      interaction: { hover: true, tooltipDelay: 200, zoomView: true, dragView: true },
      layout: { improvedLayout: true, randomSeed: 42 },
    };

    const network = new Network(containerRef.current, { nodes: visNodes, edges: visEdges }, options);
    networkRef.current = network;

    network.once("stabilizationIterationsDone", () => {
      network.fit({ animation: { duration: 500, easingFunction: "easeInOutQuad" } });
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [nodes, edges]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-muted-foreground border rounded-lg">
        No graph data available
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-muted-foreground">
          {nodes.length} nodes · {(edges || []).length} connections
        </span>
        {repoUrl && (
          <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
            View on GitHub ↗
          </a>
        )}
      </div>
      <div className="flex flex-wrap gap-2 px-2">
        {Object.entries(GROUP_COLORS)
          .filter(([group]) => nodes.some((n) => (n.group || n.type) === group))
          .map(([group, colors]) => (
            <div key={group} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.background }} />
              <span className="text-xs text-muted-foreground capitalize">{group}</span>
            </div>
          ))}
      </div>
      <div ref={containerRef} className="w-full h-[500px] border rounded-lg bg-slate-950" />
    </div>
  );
}

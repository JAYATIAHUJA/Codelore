"use client";

import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useRepo } from "@/components/providers/RepoProvider";
import {
  Code,
  Database,
  GitBranch,
  Globe,
  Layers,
  Package,
  Server,
  Settings,
  Shield,
  Star,
  TestTube,
  Zap,
  FileText,
  Cloud,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   ICON + COLOUR CONFIG
   ═══════════════════════════════════════════════════════════════════ */
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; color?: string }>> = {
  frontend: Globe,
  backend: Server,
  database: Database,
  api: Zap,
  config: Settings,
  tests: TestTube,
  entry: Star,
  utils: Code,
  services: Cloud,
  routes: GitBranch,
  controllers: Package,
  middleware: Shield,
  data: FileText,
  external: Layers,
};

// Dark-theme palette — node bg is dark, accent is a glow tint
const palette: Record<string, { bg: string; border: string; glow: string; icon: string }> = {
  frontend:    { bg: "#1a2332", border: "#3b82f6", glow: "#3b82f620", icon: "#60a5fa" },
  entry:       { bg: "#1a2332", border: "#3b82f6", glow: "#3b82f620", icon: "#60a5fa" },
  backend:     { bg: "#1a2b25", border: "#10b981", glow: "#10b98120", icon: "#34d399" },
  database:    { bg: "#1e1a2e", border: "#8b5cf6", glow: "#8b5cf620", icon: "#a78bfa" },
  api:         { bg: "#2a2518", border: "#f59e0b", glow: "#f59e0b20", icon: "#fbbf24" },
  config:      { bg: "#1e2124", border: "#6b7280", glow: "#6b728020", icon: "#9ca3af" },
  tests:       { bg: "#182520", border: "#22c55e", glow: "#22c55e20", icon: "#4ade80" },
  utils:       { bg: "#231a2e", border: "#a855f7", glow: "#a855f720", icon: "#c084fc" },
  services:    { bg: "#1a2332", border: "#06b6d4", glow: "#06b6d420", icon: "#22d3ee" },
  routes:      { bg: "#1a2b28", border: "#14b8a6", glow: "#14b8a620", icon: "#2dd4bf" },
  controllers: { bg: "#2a1f18", border: "#f97316", glow: "#f9731620", icon: "#fb923c" },
  middleware:  { bg: "#1e1a2e", border: "#818cf8", glow: "#818cf820", icon: "#a5b4fc" },
  data:        { bg: "#1a2332", border: "#38bdf8", glow: "#38bdf820", icon: "#7dd3fc" },
  external:    { bg: "#2a2518", border: "#fbbf24", glow: "#fbbf2420", icon: "#fde68a" },
};

// Edge colours — bright on dark
const EDGE_COLOR = "#2dd4bf"; // default teal
const edgeColors: Record<string, string> = {
  import: "#38bdf8",
  "data-flow": "#34d399",
  "api-call": "#fbbf24",
  dependency: "#64748b",
  "API Request": "#2dd4bf",
  "Database Query": "#a78bfa",
  "API Call": "#fbbf24",
  Configuration: "#9ca3af",
  Validation: "#38bdf8",
};

/* ═══════════════════════════════════════════════════════════════════
   INTERFACES
   ═══════════════════════════════════════════════════════════════════ */
interface GraphNode {
  id: string;
  label: string;
  type: string;
  description?: string;
  files?: string[];
  importance?: string;
  position?: { x: number; y: number };
  style?: { color?: string; icon?: string; size?: string };
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
  style?: { color?: string; width?: number; dashArray?: string };
}

interface ProjectGraphProps {
  title?: string;
  initialNodes?: GraphNode[];
  initialEdges?: GraphEdge[];
  layout?: { direction?: string; spacing?: number; algorithm?: string };
  style?: { theme?: string; background?: string; animations?: boolean };
  nodes?: any[];
  edges?: any[];
}

/* ═══════════════════════════════════════════════════════════════════
   LAYOUT HELPERS
   ═══════════════════════════════════════════════════════════════════ */
const NODE_W = 170;
const NODE_H = 80;
const COL_GAP = 200;
const ROW_GAP = 100;
const PAD_X = 60;
const PAD_Y = 60;

const typeRank: Record<string, number> = {
  frontend: 0, entry: 0,
  routes: 1, api: 1, middleware: 1,
  controllers: 2,
  services: 3, utils: 3, backend: 3, config: 3,
  database: 4, tests: 4, data: 4, external: 4,
};

function detectType(mod: any): string {
  const n = (mod.name || "").toLowerCase();
  const d = (mod.description || "").toLowerCase();
  if (n.includes("frontend") || n.includes("react") || n.includes("next") || n.includes("ui")) return "frontend";
  if (n.includes("entry") || n.includes("main") || n.includes("server") || n.includes("app")) return "entry";
  if (n.includes("middleware")) return "middleware";
  if (n.includes("config") || n.includes("settings") || n.includes("env")) return "config";
  if (n.includes("route") || n.includes("api") || n.includes("endpoint")) return "routes";
  if (n.includes("controller")) return "controllers";
  if (n.includes("service") || n.includes("external")) return "services";
  if (n.includes("util") || n.includes("helper") || n.includes("lib")) return "utils";
  if (n.includes("database") || n.includes("model") || n.includes("prisma") || n.includes("schema") || n.includes("supabase")) return "database";
  if (n.includes("test") || n.includes("spec")) return "tests";
  if (n.includes("data") || n.includes("seed") || n.includes("coordinates")) return "data";
  if (d.includes("frontend") || d.includes("ui") || d.includes("component")) return "frontend";
  if (d.includes("database") || d.includes("data")) return "database";
  if (d.includes("external") || d.includes("third-party") || d.includes("weather")) return "external";
  return "backend";
}

/* ═══════════════════════════════════════════════════════════════════
   POSITIONED LAYOUT — assign x/y to each node
   ═══════════════════════════════════════════════════════════════════ */
function computeLayout(nodes: GraphNode[]) {
  // Group by column rank
  const groups: Record<number, GraphNode[]> = {};
  nodes.forEach((n) => {
    const rank = typeRank[n.type] ?? 2;
    if (!groups[rank]) groups[rank] = [];
    groups[rank].push(n);
  });

  const sortedRanks = Object.keys(groups).sort((a, b) => +a - +b).map(Number);
  const positions: Record<string, { x: number; y: number }> = {};

  // Find max column height for vertical centering
  const maxInCol = Math.max(...sortedRanks.map((r) => groups[r].length));

  sortedRanks.forEach((rank, colIdx) => {
    const col = groups[rank];
    const colHeight = col.length * NODE_H + (col.length - 1) * ROW_GAP;
    const maxHeight = maxInCol * NODE_H + (maxInCol - 1) * ROW_GAP;
    const offsetY = (maxHeight - colHeight) / 2;

    col.forEach((node, rowIdx) => {
      positions[node.id] = {
        x: PAD_X + colIdx * (NODE_W + COL_GAP),
        y: PAD_Y + offsetY + rowIdx * (NODE_H + ROW_GAP),
      };
    });
  });

  const totalW = PAD_X * 2 + sortedRanks.length * NODE_W + (sortedRanks.length - 1) * COL_GAP;
  const totalH = PAD_Y * 2 + maxInCol * NODE_H + (maxInCol - 1) * ROW_GAP;

  return { positions, totalW, totalH };
}

/* ═══════════════════════════════════════════════════════════════════
   EDGE PATH — thick smooth bezier with connection dots
   ═══════════════════════════════════════════════════════════════════ */
function EdgePath({ edge, positions }: { edge: GraphEdge; positions: Record<string, { x: number; y: number }> }) {
  const src = positions[edge.source];
  const tgt = positions[edge.target];
  if (!src || !tgt) return null;

  // Source exits from the right side, target enters from the left side
  const x1 = src.x + NODE_W;
  const y1 = src.y + NODE_H / 2;
  const x2 = tgt.x;
  const y2 = tgt.y + NODE_H / 2;

  // Handle same-column or backwards edges
  let path: string;
  if (x2 > x1) {
    // Forward: smooth S-curve
    const dx = x2 - x1;
    const cp = dx * 0.5;
    path = `M ${x1} ${y1} C ${x1 + cp} ${y1}, ${x2 - cp} ${y2}, ${x2} ${y2}`;
  } else if (x2 < x1) {
    // Backward: loop under
    const loopY = Math.max(y1, y2) + 80;
    path = `M ${x1} ${y1} C ${x1 + 60} ${y1}, ${x1 + 60} ${loopY}, ${(x1 + x2) / 2} ${loopY} C ${x2 - 60} ${loopY}, ${x2 - 60} ${y2}, ${x2} ${y2}`;
  } else {
    // Same column: short arc
    const midY = (y1 + y2) / 2;
    const arcX = x1 + 80;
    path = `M ${x1} ${y1} C ${arcX} ${y1}, ${arcX} ${y2}, ${x2} ${y2}`;
  }

  const eLabel = edge.label || edge.type || "";
  const eColor = edgeColors[eLabel] || edgeColors[edge.type || ""] || EDGE_COLOR;

  // Midpoint for label
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Label rotation to follow the curve direction
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  const clampedAngle = angle > 90 ? angle - 180 : angle < -90 ? angle + 180 : angle;

  return (
    <g>
      {/* Glow layer */}
      <path
        d={path}
        fill="none"
        stroke={eColor}
        strokeWidth={6}
        opacity={0.15}
        strokeLinecap="round"
      />
      {/* Main edge */}
      <path
        d={path}
        fill="none"
        stroke={eColor}
        strokeWidth={2.5}
        opacity={0.8}
        strokeLinecap="round"
      />
      {/* Source dot */}
      <circle cx={x1} cy={y1} r={4} fill="#1e293b" stroke={eColor} strokeWidth={2} />
      {/* Target dot */}
      <circle cx={x2} cy={y2} r={4} fill="#1e293b" stroke={eColor} strokeWidth={2} />
      {/* Arrow tip */}
      <polygon
        points={`${x2},${y2} ${x2 - 10},${y2 - 5} ${x2 - 10},${y2 + 5}`}
        fill={eColor}
        opacity={0.9}
      />
      {/* Label */}
      {eLabel && (
        <g transform={`translate(${midX}, ${midY - 10}) rotate(${clampedAngle})`}>
          <rect
            x={-eLabel.length * 3.5 - 6}
            y={-8}
            width={eLabel.length * 7 + 12}
            height={16}
            rx={3}
            fill="#1e293b"
            stroke={eColor}
            strokeWidth={0.5}
            opacity={0.9}
          />
          <text
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fontFamily="monospace"
            fill={eColor}
            dy={3.5}
          >
            {eLabel}
          </text>
        </g>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NODE COMPONENT — dark card with icon + glow border
   ═══════════════════════════════════════════════════════════════════ */
function GraphNodeCard({
  node,
  pos,
}: {
  node: GraphNode;
  pos: { x: number; y: number };
}) {
  const c = palette[node.type] || palette.backend;
  const Icon = iconMap[node.type] || Code;

  return (
    <foreignObject x={pos.x} y={pos.y} width={NODE_W} height={NODE_H}>
      <div
        style={{
          width: NODE_W,
          height: NODE_H,
          background: c.bg,
          border: `1.5px solid ${c.border}50`,
          borderRadius: 10,
          boxShadow: `0 0 12px ${c.glow}, inset 0 1px 0 ${c.border}15`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 12px",
          cursor: "default",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: `${c.border}18`,
            border: `1.5px solid ${c.border}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} color={c.icon} />
        </div>
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: "#e2e8f0",
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {node.label}
          </div>
          {node.description && (
            <div
              style={{
                color: "#94a3b8",
                fontSize: 9.5,
                lineHeight: 1.3,
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {node.description}
            </div>
          )}
        </div>
      </div>
    </foreignObject>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export function ProjectGraph({
  title = "PROJECT GRAPH",
  initialNodes = [],
  initialEdges = [],
  nodes: legacyNodes,
  edges: legacyEdges,
}: ProjectGraphProps) {
  const { repoData } = useRepo();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  /* ── Data resolution ─────────────────────────────────────────── */
  const { nodes, edges } = useMemo(() => {
    const rawNodes: GraphNode[] = legacyNodes?.length
      ? legacyNodes.map((n: any) => ({
          id: n.id ?? n.data?.label ?? "",
          label: typeof n.data?.label === "string" ? n.data.label : n.label ?? n.id ?? "",
          type: n.type ?? "backend",
          description: n.data?.description ?? n.description ?? "",
          files: n.files ?? [],
          importance: n.importance ?? "medium",
        }))
      : initialNodes?.length
        ? initialNodes
        : [];

    const rawEdges: GraphEdge[] = legacyEdges?.length ? legacyEdges : initialEdges?.length ? initialEdges : [];

    if (rawNodes.length > 0) return { nodes: rawNodes, edges: rawEdges };

    // Auto-generate from repo data
    if (!repoData?.modules?.length) return { nodes: [] as GraphNode[], edges: [] as GraphEdge[] };

    const autoNodes: GraphNode[] = repoData.modules.map((mod) => ({
      id: mod.name,
      label: mod.name,
      type: detectType(mod),
      description: mod.description,
      files: mod.files?.slice(0, 5),
    }));

    const autoEdges: GraphEdge[] = [];
    repoData.modules.forEach((mod) => {
      mod.dependencies?.forEach((dep: string) => {
        if (repoData.modules.some((m) => m.name === dep)) {
          const t = detectType(mod);
          const label =
            t === "database" ? "Database Query" :
            t === "routes" ? "API Request" :
            t === "services" ? "API Call" :
            t === "config" ? "Configuration" :
            t === "data" ? "Validation" :
            "uses";
          autoEdges.push({
            id: `${mod.name}-${dep}`,
            source: mod.name,
            target: dep,
            label,
            type: t === "database" ? "data-flow" : t === "routes" ? "api-call" : "dependency",
          });
        }
      });
    });

    return { nodes: autoNodes, edges: autoEdges };
  }, [repoData, initialNodes, initialEdges, legacyNodes, legacyEdges]);

  /* ── Layout positions ────────────────────────────────────────── */
  const { positions, totalW, totalH } = useMemo(
    () => computeLayout(nodes),
    [nodes]
  );

  /* ── Auto-fit zoom on mount / data change ────────────────────── */
  useEffect(() => {
    if (!containerRef.current || totalW === 0) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const fitZoom = Math.min(cw / totalW, ch / totalH, 1);
    const clampedZoom = Math.max(0.3, Math.min(fitZoom, 1));
    setZoom(clampedZoom);
    // Center the graph
    setPan({
      x: (cw - totalW * clampedZoom) / 2,
      y: (ch - totalH * clampedZoom) / 2,
    });
  }, [totalW, totalH, nodes.length]);

  /* ── Pan handlers ────────────────────────────────────────────── */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.2, Math.min(2, z - e.deltaY * 0.001)));
  }, []);

  /* ── Empty state ─────────────────────────────────────────────── */
  if (!nodes.length) {
    return (
      <div className="rounded-xl border border-zinc-700 bg-[#1a1d23] p-8 text-center">
        <div className="text-zinc-500 text-sm">No graph data. Connect a repository to visualize its architecture.</div>
      </div>
    );
  }

  /* ── Render ──────────────────────────────────────────────────── */
  const repoName = repoData?.repo?.name || title;

  return (
    <div
      className="rounded-xl overflow-hidden border border-zinc-700/60"
      style={{
        background: "#1e2128",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* ── Title bar ────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: "linear-gradient(90deg, #252830, #2a2d35)",
          borderBottom: "1px solid #333640",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px]">🗺️</span>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#94a3b8" }}
          >
            {repoName} — {title}
          </span>
          <span className="text-[10px] font-mono ml-2" style={{ color: "#64748b" }}>
            {nodes.length} modules · {edges.length} connections
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fbbf24" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#4ade80" }} />
        </div>
      </div>

      {/* ── Canvas ───────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative select-none"
        style={{
          height: 480,
          background: `
            radial-gradient(circle at 50% 50%, #252830 0%, #1a1d23 100%)
          `,
          backgroundImage: `
            radial-gradient(circle, #333640 0.8px, transparent 0.8px)
          `,
          backgroundSize: "24px 24px",
          cursor: dragging ? "grabbing" : "grab",
          overflow: "hidden",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Draw edges first (behind nodes) */}
            {edges.map((edge) => (
              <EdgePath key={edge.id} edge={edge} positions={positions} />
            ))}
            {/* Draw nodes on top */}
            {nodes.map((node) => {
              const pos = positions[node.id];
              if (!pos) return null;
              return <GraphNodeCard key={node.id} node={node} pos={pos} />;
            })}
          </g>
        </svg>

        {/* Zoom controls */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg px-1 py-0.5"
          style={{ background: "#1e2128cc", border: "1px solid #333640" }}
        >
          <button
            onClick={() => setZoom((z) => Math.max(0.2, z - 0.15))}
            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white text-sm font-bold"
          >
            −
          </button>
          <span className="text-[10px] font-mono text-zinc-500 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* ── Footer legend ────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-1.5"
        style={{
          background: "#252830",
          borderTop: "1px solid #333640",
        }}
      >
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#475569" }}>
          Auto-layout by module type
        </span>
        <div className="flex items-center gap-4">
          {[
            { label: "API Request", color: "#2dd4bf" },
            { label: "Data Flow", color: "#34d399" },
            { label: "API Call", color: "#fbbf24" },
            { label: "Dependency", color: "#64748b" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <svg width={18} height={6}>
                <line x1={0} y1={3} x2={18} y2={3} stroke={l.color} strokeWidth={2.5} strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-mono" style={{ color: "#64748b" }}>
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

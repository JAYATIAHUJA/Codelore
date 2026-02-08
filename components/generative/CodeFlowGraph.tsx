"use client";

import { ComicPanel } from "@/components/ui/ComicPanel";
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface CodeBlock {
  id: string;
  label: string;
  code: string;
  highlights?: string[];
  description?: string;
  language?: string;
}

export interface FlowConnection {
  from: string;
  to: string;
  label?: string;
}

export interface CodeFlowColumn {
  title: string;
  color: string;
  blocks: CodeBlock[];
}

interface CodeFlowGraphProps {
  title?: string;
  columns?: CodeFlowColumn[];
  connections?: FlowConnection[];
}

function highlightCode(code: string, highlights: string[] = []) {
  if (!highlights.length) return <span>{code}</span>;

  const lines = code.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        let result: React.ReactNode = line;

        for (const hl of highlights) {
          if (line.includes(hl)) {
            const parts = line.split(hl);
            result = (
              <>
                {parts[0]}
                <span className="bg-accent/20 text-accent px-0.5 rounded-sm border border-accent/30 tracking-tight font-bold">
                  {hl}
                </span>
                {parts.slice(1).join(hl)}
              </>
            );
            break;
          }
        }

        return (
          <div key={i} className="leading-5">
            {result}
          </div>
        );
      })}
    </>
  );
}

function CodeBlockNode({ block }: { block: CodeBlock }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="relative group">
      <div
        className="arch-border border bg-surface rounded-sm overflow-hidden arch-shadow hover:scale-[1.01] transition-transform cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {block.label && (
          <div className="px-3 py-1.5 bg-text-primary/5 border-b arch-border flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-text-primary">
              {block.label}
            </span>
            <span className="text-[10px] text-text-secondary/40">
              {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
          </div>
        )}
        {expanded && (
          <div className="p-4 bg-background overflow-x-auto">
            <pre className="text-[10px] font-mono text-text-primary whitespace-pre leading-5">
              {highlightCode(block.code, block.highlights)}
            </pre>
          </div>
        )}
        {block.description && (
          <div className="px-3 py-3 bg-accent/5 border-t border-dashed arch-border text-[10px] text-text-secondary font-medium italic">
            <span className="text-accent not-italic font-bold mr-2">ANALYSIS</span>
            {block.description}
          </div>
        )}
      </div>
    </div>
  );
}

function Arrow({ label, direction = "down" }: { label?: string; direction?: "down" | "right" }) {
  if (direction === "right") {
    return (
      <div className="flex items-center justify-center px-2 min-w-[60px]">
        <div className="flex items-center gap-1">
          <div className="h-0.5 w-6 bg-accent/60" />
          {label && (
            <span className="text-[9px] font-bold text-text-primary uppercase tracking-widest whitespace-nowrap">
              {label}
            </span>
          )}
          <div className="relative">
            <div className="h-0.5 w-4 bg-accent/60" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-accent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-0.5 h-4 bg-accent/60" />
      {label && (
        <span className="text-[9px] font-bold text-text-primary uppercase tracking-widest bg-accent/10 px-1.5 py-0.5 rounded border arch-border">
          {label}
        </span>
      )}
      <div className="relative">
        <div className="w-0.5 h-4 bg-accent/60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-accent" />
      </div>
    </div>
  );
}

export function CodeFlowGraph({
  title = "CODE FLOW",
  columns: rawColumns,
  connections: rawConnections,
}: CodeFlowGraphProps) {
  // Bulletproof: handle null, undefined, or non-array inputs
  const columns = Array.isArray(rawColumns) && rawColumns.length > 0
    ? rawColumns.map(col => ({
        ...col,
        title: col.title || "Stage",
        color: col.color || "#FFD600",
        blocks: Array.isArray(col.blocks) ? col.blocks.map(b => ({
          ...b,
          id: b.id || `block-${Math.random()}`,
          label: b.label || "",
          code: b.code || "// ...",
          highlights: Array.isArray(b.highlights) ? b.highlights : [],
        })) : [],
      }))
    : [];
  const connections = Array.isArray(rawConnections) ? rawConnections : [];

  if (!columns.length) {
    return (
      <ComicPanel title={title} color="#e53935">
        <div className="p-4 text-center text-zinc-500 text-sm">
          No flow data available.
        </div>
      </ComicPanel>
    );
  }

  // Check if we should render horizontal (columns) or vertical layout
  const isHorizontal = columns.length > 1;

  if (isHorizontal) {
    return (
      <ComicPanel title={title} color="#e53935">
        <div className="overflow-x-auto">
          <div className="flex items-start gap-0 min-w-max py-2">
            {columns.map((col, colIdx) => (
              <React.Fragment key={col.title}>
                {/* Column */}
                <div className="flex flex-col gap-3 min-w-[260px] max-w-[320px]">
                  {/* Column Header */}
                  <div
                    className="px-3 py-1.5 font-[var(--font-bangers)] text-sm tracking-wider text-black border-2 border-black rounded inline-block self-start"
                    style={{ backgroundColor: col.color }}
                  >
                    {col.title}
                  </div>

                  {/* Blocks in this column */}
                  {col.blocks.map((block, blockIdx) => (
                    <React.Fragment key={block.id}>
                      <CodeBlockNode block={block} />
                      {/* Vertical arrow between blocks in same column */}
                      {blockIdx < col.blocks.length - 1 && (
                        <Arrow
                          direction="down"
                          label={connections.find(
                            c => c.from === block.id && col.blocks.some(b => b.id === c.to)
                          )?.label}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Horizontal arrow between columns */}
                {colIdx < columns.length - 1 && (
                  <div className="flex items-center self-center mt-10">
                    <Arrow
                      direction="right"
                      label={connections.find(c => {
                        const fromInThisCol = columns[colIdx].blocks.some(b => b.id === c.from);
                        const toInNextCol = columns[colIdx + 1]?.blocks.some(b => b.id === c.to);
                        return fromInThisCol && toInNextCol;
                      })?.label}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </ComicPanel>
    );
  }

  // Vertical layout (single column)
  const col = columns[0];
  return (
    <ComicPanel title={title} color="#e53935">
      <div className="flex flex-col items-center gap-0 py-2 max-w-md mx-auto">
        <div
          className="px-3 py-1.5 font-[var(--font-bangers)] text-sm tracking-wider text-black border-2 border-black rounded mb-3"
          style={{ backgroundColor: col.color }}
        >
          {col.title}
        </div>

        {col.blocks.map((block, i) => {
          const conn = connections.find(c => c.from === block.id);
          return (
            <React.Fragment key={block.id}>
              <CodeBlockNode block={block} />
              {i < col.blocks.length - 1 && (
                <Arrow direction="down" label={conn?.label} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </ComicPanel>
  );
}

"use client";

import React, { useState } from "react";
import { repoTree, FileNode } from "@/lib/mock-data";
import { ComicPanel } from "@/components/ui/ComicPanel";

interface TreeViewProps {
  filter: string;
  highlightImportant: boolean;
  title: string;
}

const moduleFilterMap: Record<string, string[]> = {
  all: [],
  backend: ["backend", "database"],
  frontend: ["frontend"],
  auth: ["auth"],
  database: ["database"],
  services: ["backend"],
};

function filterTree(node: FileNode, filter: string): FileNode | null {
  const normalizedFilter = filter.toLowerCase();
  const activeFilter = moduleFilterMap[normalizedFilter] ? normalizedFilter : "all";

  if (activeFilter === "all") return node;
  const allowedModules = moduleFilterMap[activeFilter] || [];

  if (node.type === "file") {
    if (!node.module) return node;
    return allowedModules.includes(node.module) ? node : null;
  }

  if (node.module && !allowedModules.includes(node.module)) return null;

  const filteredChildren = node.children
    ?.map((child) => filterTree(child, activeFilter))
    .filter(Boolean) as FileNode[] | undefined;

  if (filteredChildren && filteredChildren.length === 0 && node.name !== repoTree.name) return null;

  return { ...node, children: filteredChildren };
}

function TreeNode({ node, depth, highlightImportant }: { node: FileNode; depth: number; highlightImportant: boolean }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isFolder = node.type === "folder";
  const isImportant = node.importance === "high";

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-yellow-50 transition-colors ${isImportant && highlightImportant ? "bg-yellow-50" : ""
          }`}
        onClick={() => isFolder && setExpanded(!expanded)}
      >
        <span className="text-base">
          {isFolder ? (expanded ? "📂" : "📁") : "📄"}
        </span>
        <span className={`text-sm font-mono ${isImportant && highlightImportant ? "font-bold text-red-700" : ""}`}>
          {node.name}
        </span>
        {isImportant && highlightImportant && <span className="text-xs">⭐</span>}
        {node.description && (
          <span className="text-xs text-zinc-400 ml-1 hidden sm:inline truncate max-w-[200px]">
            — {node.description}
          </span>
        )}
      </div>
      {isFolder && expanded && node.children && (
        <div className="tree-line ml-3">
          {node.children.map((child, i) => (
            <TreeNode key={`${child.name}-${i}`} node={child} depth={depth + 1} highlightImportant={highlightImportant} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({ filter = "all", highlightImportant = true, title }: TreeViewProps) {
  const filtered = filterTree(repoTree, filter);

  if (!filtered) {
    return (
      <ComicPanel title={title} color="#1565c0">
        <p className="text-zinc-500 text-sm">No files match this filter.</p>
      </ComicPanel>
    );
  }

  return (
    <ComicPanel title={title} color="#1565c0">
      <div className="max-h-[500px] overflow-y-auto">
        <TreeNode node={filtered} depth={0} highlightImportant={highlightImportant} />
      </div>
    </ComicPanel>
  );
}

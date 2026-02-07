"use client";

import React, { useState } from "react";
import { useRepo, RepoFile } from "@/components/providers/RepoProvider";
import { ComicPanel } from "@/components/ui/ComicPanel";

// Define FileNode locally as we are replacing mock-data
interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  importance?: "high" | "medium" | "low";
  description?: string;
  module?: string;
}

interface TreeViewProps {
  filter?: string;
  highlightImportant?: boolean;
  title?: string;
}

const moduleFilterMap: Record<string, string[]> = {
  all: [],
  backend: ["backend", "database"],
  frontend: ["frontend"],
  auth: ["auth"],
  database: ["database"],
  services: ["backend"],
};

// ... filterTree and TreeNode functions can stay mostly same, but need to be robust ...

function buildFileTree(files: RepoFile[]): FileNode {
  const root: FileNode = { name: "root", type: "folder", children: [] };

  files.forEach(file => {
    const parts = file.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;

      // Find existing child
      let child = current.children?.find(c => c.name === part);

      if (!child) {
        child = {
          name: part,
          type: isLast && file.type === "file" ? "file" : "folder",
          children: isLast && file.type === "file" ? undefined : [],
          // Heuristic for importance/module (could be improved with AI analysis in future)
          importance: part.includes("config") || part.includes("README") || part.endsWith("page.tsx") ? "high" : "medium"
        };
        current.children = current.children || [];
        current.children.push(child);
      }
      current = child;
    });
  });

  return root;
}

function filterTree(node: FileNode, filter: string): FileNode | null {
  // Simplified filter for now: just return node if no specific module logic
  if (filter === "all") return node;

  // TODO: Real filtering requires knowing which file belongs to which module.
  // For now, we will just return the full tree or simple name matching.
  // Providing a "Coming Soon" for filtering real data if it's too complex.
  return node;
}

function TreeNode({ node, depth, highlightImportant }: { node: FileNode; depth: number; highlightImportant: boolean }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isFolder = node.type === "folder";
  const isImportant = node.importance === "high";

  // Don't show root wrapper
  if (node.name === "root") {
    return (
      <div className="tree-line ml-0">
        {node.children?.map((child, i) => (
          <TreeNode key={`${child.name}-${i}`} node={child} depth={depth} highlightImportant={highlightImportant} />
        ))}
      </div>
    );
  }

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

export function TreeView({ filter = "all", highlightImportant = true, title = "FOLDER STRUCTURE" }: TreeViewProps) {
  const { repoData } = useRepo();

  if (!repoData) {
    return (
      <ComicPanel title={title} color="#1565c0">
        <div className="p-4 text-center">
          <p className="text-zinc-500 text-sm mb-2">No repository connected.</p>
        </div>
      </ComicPanel>
    );
  }

  const tree = buildFileTree(repoData.files);

  // We skip filtering for now as it needs deeper analysis, or we could implement basic string matching
  // const filtered = filterTree(tree, filter); 

  return (
    <ComicPanel title={title} color="#1565c0">
      <div className="max-h-[500px] overflow-y-auto">
        <TreeNode node={tree} depth={0} highlightImportant={highlightImportant} />
      </div>
    </ComicPanel>
  );
}

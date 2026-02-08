"use client";

import React, { useState } from "react";
import { useRepo, RepoFile } from "@/components/providers/RepoProvider";
import { ComicPanel } from "@/components/ui/ComicPanel";
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from "lucide-react";

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

function buildFileTree(files: RepoFile[]): FileNode {
  const root: FileNode = { name: "root", type: "folder", children: [] };

  files.forEach(file => {
    const parts = file.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      let child = current.children?.find(c => c.name === part);

      if (!child) {
        child = {
          name: part,
          type: isLast && file.type === "file" ? "file" : "folder",
          children: isLast && file.type === "file" ? undefined : [],
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

function TreeNode({ node, depth, highlightImportant }: { node: FileNode; depth: number; highlightImportant: boolean }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isFolder = node.type === "folder";
  const isImportant = node.importance === "high";

  if (node.name === "root") {
    return (
      <div className="ml-0">
        {node.children?.map((child, i) => (
          <TreeNode key={`${child.name}-${i}`} node={child} depth={depth} highlightImportant={highlightImportant} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ marginLeft: depth > 0 ? 12 : 0 }}>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded-sm cursor-pointer hover:bg-text-primary/5 transition-colors group ${isImportant && highlightImportant ? "bg-accent/5" : ""}`}
        onClick={() => isFolder && setExpanded(!expanded)}
      >
        <span className="text-text-secondary w-4 h-4 flex items-center justify-center">
          {isFolder ? (
            expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : (
            <div className="w-1 h-1 rounded-full bg-text-secondary/30" />
          )}
        </span>
        
        <span className="flex items-center gap-2 overflow-hidden">
          {isFolder ? (
            expanded ? <FolderOpen size={14} className="text-accent shrink-0" /> : <Folder size={14} className="text-accent shrink-0" />
          ) : (
            <File size={14} className="text-text-secondary/50 shrink-0" />
          )}
          <span className={`text-[11px] truncate font-mono tracking-tight ${isImportant && highlightImportant ? "text-accent font-bold" : "text-text-primary"}`}>
            {node.name}
          </span>
        </span>
        
        {isImportant && highlightImportant && (
          <span className="text-[8px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-1 border border-accent/20 rounded-[2px] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            Priority
          </span>
        )}
      </div>

      {isFolder && expanded && node.children && (
        <div className="border-l arch-border ml-3 my-0.5">
          {node.children.map((child, i) => (
            <TreeNode key={`${child.name}-${i}`} node={child} depth={depth + 1} highlightImportant={highlightImportant} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({ highlightImportant = true, title = "DIRECTORY TREE" }: TreeViewProps) {
  const { repoData } = useRepo();

  if (!repoData) {
    return (
      <ComicPanel title={title}>
        <div className="p-8 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-text-primary/5 border arch-border flex items-center justify-center opacity-40">
            <Folder size={20} className="text-text-secondary" />
          </div>
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">No active repository</p>
        </div>
      </ComicPanel>
    );
  }

  const tree = buildFileTree(repoData.files);

  return (
    <ComicPanel title={title}>
      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <TreeNode node={tree} depth={0} highlightImportant={highlightImportant} />
      </div>
    </ComicPanel>
  );
}


"use client";

import { useRepo } from "@/components/providers/RepoProvider";
import { RepoStatus } from "@/components/workspace/RepoStatus";
import { buildFileTree, TreeNode } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ChevronRight, FileCode, Folder, GitBranch, Layers, Star, Terminal } from "lucide-react";
import { useMemo, useState } from "react";

type Tab = "FILES" | "INSIGHTS" | "DOCS";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("FILES");
  const { repoData, isLoading: isRepoLoading } = useRepo();

  const fileTree = useMemo(() => {
    if (!repoData?.files) return [];
    return buildFileTree(repoData.files);
  }, [repoData]);

  return (
    <aside className="w-72 border-r arch-border bg-surface flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      {/* Repository Status */}
      <RepoStatus />
      
      {/* Tab Switcher */}
      <div className="flex border-b arch-border">
        {(["FILES", "INSIGHTS", "DOCS"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[10px] font-bold tracking-widest transition-all relative ${
              activeTab === tab 
              ? "text-text-primary" 
              : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabSide"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-background/30">
        <AnimatePresence mode="wait">
          {activeTab === "FILES" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                {isRepoLoading ? (
                  <div className="py-10 flex flex-col items-center justify-center space-y-3 opacity-50">
                    <Activity className="animate-spin text-accent" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Parsing Architecture...</span>
                  </div>
                ) : fileTree.length > 0 ? (
                  <div className="pb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 mb-2 bg-surface border arch-border rounded-sm">
                       <GitBranch size={12} className="text-text-secondary" />
                       <span className="text-[10px] font-mono font-bold text-text-primary uppercase tracking-tighter">{repoData?.repo.branch || "main"}</span>
                    </div>
                    <RecursiveTree nodes={fileTree} level={0} />
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-3 opacity-50 px-4">
                    <Terminal size={24} className="mx-auto text-text-secondary" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-primary">No Active Source</p>
                    <p className="text-[9px] font-medium leading-relaxed text-text-secondary">Connect a GitHub repository to visualize its file structure.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "INSIGHTS" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <InsightGroup title="Detected Modules" icon={<Layers size={14} className="text-accent" fill="currentColor" />}>
                <div className="space-y-2 pt-2">
                   <div className="p-3 border arch-border bg-surface text-[10px] font-bold text-text-primary tracking-widest uppercase rounded-sm arch-shadow">Authentication Engine</div>
                   <div className="p-3 border arch-border bg-surface text-[10px] font-bold text-text-primary tracking-widest uppercase rounded-sm arch-shadow">Payment_Service</div>
                </div>
              </InsightGroup>
              
              <InsightGroup title="Coupling Metrics" icon={<Activity size={14} className="text-accent" fill="currentColor" />}>
                 <div className="pt-2 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold text-text-secondary uppercase">
                        <span>Module Density</span>
                        <span>70%</span>
                      </div>
                      <div className="h-1.5 w-full bg-text-primary/5 border arch-border rounded-full overflow-hidden">
                         <div className="h-full bg-accent w-[70%]" />
                      </div>
                    </div>
                    <span className="text-[9px] font-medium text-text-secondary mt-1 block leading-tight">High coupling detected between Auth and Database entities.</span>
                 </div>
              </InsightGroup>
            </motion.div>
          )}

          {activeTab === "DOCS" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="bg-surface border arch-border p-5 rounded-sm arch-shadow">
                 <h4 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-widest">Repository Context</h4>
                 <div className="space-y-4">
                   <div className="space-y-1.5">
                     <div className="h-1.5 w-3/4 bg-text-primary/10 rounded-full" />
                     <div className="h-1.5 w-1/2 bg-text-primary/10 rounded-full" />
                   </div>
                   <p className="text-[10px] font-mono text-text-secondary leading-relaxed uppercase">
                     Key entry points identified: 
                     <br />
                     <span className="text-accent">→ interface/page.tsx</span>
                     <br />
                     <span className="text-accent">→ api/github/route.ts</span>
                   </p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t arch-border bg-surface">
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-accent flex items-center justify-center text-white dark:text-black text-[10px] font-bold arch-shadow">VN</div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-text-primary leading-none">Vansh Nagpal</span>
               <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase mt-0.5">Frontend Architect</span>
            </div>
         </div>
      </div>
    </aside>
  );
}

function RecursiveTree({ nodes, level }: { nodes: TreeNode[]; level: number }) {
  return (
    <>
      {nodes.map((node) => (
        <TreeItem key={node.path} node={node} level={level} />
      ))}
    </>
  );
}

function TreeItem({ node, level }: { node: TreeNode; level: number }) {
  const [isOpened, setIsOpened] = useState(false);
  const isSelected = false; // Add selection logic later if needed

  return (
    <div>
      <FileItem
        level={level}
        label={node.name}
        isFolder={node.type === "directory"}
        isOpened={isOpened}
        icon={node.type === "directory" ? <Folder size={14} className={isOpened ? "fill-text-secondary/20" : ""} /> : <FileCode size={14} />}
        onClick={() => node.type === "directory" && setIsOpened(!isOpened)}
      />
      {isOpened && node.children && (
        <RecursiveTree nodes={node.children} level={level + 1} />
      )}
    </div>
  );
}

function FileItem({ 
  level, 
  label, 
  isFolder, 
  isOpened, 
  isImportant, 
  icon, 
  onClick 
}: { 
  level: number; 
  label: string; 
  isFolder?: boolean; 
  isOpened?: boolean; 
  isImportant?: boolean; 
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div 
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      onClick={onClick}
      className={`group flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-text-primary/5 transition-all duration-200 ${isImportant ? "text-accent" : "text-text-secondary"} active:bg-text-primary/10 rounded-sm mb-0.5`}
    >
      <div className="flex items-center justify-center w-4">
        {isFolder && <ChevronRight size={10} className={`transition-transform duration-200 text-text-secondary/40 ${isOpened ? "rotate-90 text-accent" : ""}`} />}
      </div>
      <span className="text-text-secondary/60 group-hover:text-text-primary transition-colors">{icon}</span>
      <span className={`text-[11px] font-mono truncate tracking-tight ${isImportant ? "font-bold text-text-primary" : "font-medium"}`}>{label}</span>
      {isImportant && <Star size={10} fill="currentColor" className="ml-auto text-accent" />}
    </div>
  );
}

function InsightGroup({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-1">
         {icon}
         <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{title}</h4>
      </div>
      {children}
    </div>
  );
}

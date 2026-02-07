"use client";

import { useState, useMemo } from "react";
import { Folder, FileCode, Beaker, BookOpen, ChevronRight, Star, Layers, Activity, GitBranch, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRepo } from "@/components/providers/RepoProvider";
import { buildFileTree, TreeNode } from "@/lib/utils";

type Tab = "FILES" | "INSIGHTS" | "DOCS";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("FILES");
  const { repoData, isLoading: isRepoLoading } = useRepo();

  const fileTree = useMemo(() => {
    if (!repoData?.files) return [];
    return buildFileTree(repoData.files);
  }, [repoData]);

  return (
    <aside className="w-72 border-r-2 border-brutal-black bg-white flex flex-col h-[calc(100vh-3.5rem)] sticky top-14">
      {/* Tab Switcher */}
      <div className="flex border-b-2 border-brutal-black">
        {(["FILES", "INSIGHTS", "DOCS"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[10px] font-bold tracking-widest transition-all ${
              activeTab === tab 
              ? "bg-brutal-black text-white" 
              : "bg-white text-zinc-500 hover:text-brutal-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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
                    <Activity className="animate-spin text-brutal-blue" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Parsing Tree...</span>
                  </div>
                ) : fileTree.length > 0 ? (
                  <div className="pb-4">
                    <div className="flex items-center gap-2 px-2 py-1 mb-2 bg-zinc-50 border border-zinc-200">
                       <GitBranch size={12} className="text-zinc-400" />
                       <span className="text-[10px] font-mono font-bold text-zinc-500">{repoData?.repo.branch || "main"}</span>
                    </div>
                    <RecursiveTree nodes={fileTree} level={0} />
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-2 opacity-50 px-4">
                    <Terminal size={24} className="mx-auto text-zinc-300" />
                    <p className="text-[10px] font-bold uppercase leading-tight">No Repository Connected</p>
                    <p className="text-[9px] font-medium lowercase">Connect a public GitHub repo to start navigating.</p>
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
              <InsightGroup title="Detected Modules" icon={<Layers size={14} />}>
                <div className="space-y-2 pt-2">
                   <div className="p-2 border border-black bg-emerald-50 text-[10px] font-bold shadow-[2px_2px_0px_black]">AUTHENTICATION ENGINE</div>
                   <div className="p-2 border border-black bg-blue-50 text-[10px] font-bold shadow-[2px_2px_0px_black]">PAYMENT_SERVICE (STRIPE)</div>
                </div>
              </InsightGroup>
              
              <InsightGroup title="Dependency Clusters" icon={<Activity size={14} />}>
                 <div className="pt-2">
                    <div className="h-2 w-full bg-zinc-100 border border-zinc-200 rounded-full overflow-hidden">
                       <div className="h-full bg-brutal-blue w-[70%]" />
                    </div>
                    <span className="text-[9px] font-bold text-zinc-400 mt-1 block uppercase">High Coupling: Auth -&gt; DB</span>
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
              <div className="bg-zinc-50 border-2 border-black p-4 brutal-shadow-sm">
                 <h4 className="font-[var(--font-bangers)] text-lg mb-2">README.md</h4>
                 <div className="h-2 w-32 bg-zinc-300 mb-1" />
                 <div className="h-2 w-24 bg-zinc-200 mb-4" />
                 <p className="text-[10px] font-mono text-zinc-500 leading-relaxed uppercase">
                   Repository parsed successfully. 
                   Key entry points identified: 
                   - index.tsx
                   - server.ts
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t-2 border-brutal-black bg-zinc-50">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brutal-blue border-2 border-black flex items-center justify-center text-white text-[10px] font-bold">VN</div>
            <div className="flex flex-col">
               <span className="text-[10px] font-bold leading-none">Vansh Nagpal</span>
               <span className="text-[9px] text-zinc-400 font-mono">Pro Builder</span>
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
        icon={node.type === "directory" ? <Folder size={14} className={isOpened ? "fill-zinc-200" : ""} /> : <FileCode size={14} />}
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
      className={`group flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-zinc-50 transition-colors ${isImportant ? "text-brutal-blue" : "text-zinc-600"} active:bg-zinc-100`}
    >
      <div className="flex items-center justify-center w-4">
        {isFolder && <ChevronRight size={10} className={`transition-transform duration-200 ${isOpened ? "rotate-90" : ""}`} />}
      </div>
      <span className="text-zinc-400 group-hover:text-brutal-black transition-colors">{icon}</span>
      <span className={`text-[11px] font-mono truncate ${isImportant ? "font-bold" : "font-medium"}`}>{label}</span>
      {isImportant && <Star size={10} fill="currentColor" className="ml-auto flex-shrink-0" />}
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

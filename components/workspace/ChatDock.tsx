"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { LoadingDots } from "@/components/chat/LoadingDots";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useRepo } from "@/components/providers/RepoProvider";
import { useTamboThread } from "@tambo-ai/react";
import { MoreHorizontal, Target, Zap } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";


export function ChatDock() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { repoData } = useRepo();

  const { thread, sendThreadMessage, isIdle } = useTamboThread();

  const messages = useMemo(() => thread?.messages ?? [], [thread?.messages]);
  const sendMessage = sendThreadMessage;
  const isLoading = !isIdle;

  const isLocked = !repoData;

  // Inject Repo Context
  const hasSentContext = useRef(false);
  const lastRepoUrl = useRef<string | null>(null);

  useEffect(() => {
    // Reset context flag if a different repo is connected
    if (repoData?.repo?.url !== lastRepoUrl.current) {
      hasSentContext.current = false;
      lastRepoUrl.current = repoData?.repo?.url ?? null;
    }

    if (repoData && !hasSentContext.current && !isLoading) {
      console.log("Injecting repo context to AI...");
      
      const moduleSummary = repoData.modules?.length 
        ? repoData.modules.map(m => 
            `- ${m.name} (${m.type}): ${m.description} | Files: ${m.files.slice(0, 5).join(", ")}`
          ).join("\n")
        : "No modules detected yet.";

      const langInfo = repoData.stats?.languages?.length
        ? `Languages: ${[...new Set(repoData.stats.languages)].join(", ")}`
        : "";

      const frameworkInfo = repoData.stats?.frameworks?.length
        ? `Frameworks: ${repoData.stats.frameworks.join(", ")}`
        : "";

      // Limit file list to avoid Tambo API payload limits
      const trimmedFileList = repoData.files
        .filter(f => f.type === "file")
        .map(f => f.path)
        .slice(0, 80)
        .join("\n");
      const fileCount = repoData.files.filter(f => f.type === "file").length;
      const truncatedNote = fileCount > 80 ? `\n... and ${fileCount - 80} more files` : "";

      const contextMessage = `Repository: ${repoData.repo.owner}/${repoData.repo.name} (${repoData.repo.description || "no description"}).
${langInfo} ${frameworkInfo}
Files: ${repoData.stats.totalFiles}, Folders: ${repoData.stats.totalFolders}

Modules:
${moduleSummary}

Key files:
${trimmedFileList}${truncatedNote}

RULES:
1. "folder structure" / "file tree" → render TreeView
2. "architecture" / "modules" / "explain project" → render ModuleCards
3. ANY flow/lifecycle/trace/sequence/"how does X work" → render CodeFlowGraph with columns containing code blocks. You MUST populate the columns array with objects like {title:"Stage", color:"#FFD600", blocks:[{id:"b1", label:"functionName()", code:"actual code here"}]} and connections like [{from:"b1", to:"b2", label:"calls"}]. NEVER leave columns empty.
4. "show project graph" / "visualize architecture" / "dependency map" → render ProjectGraph with nodes and edges.
5. Use real file paths from above. Do NOT generate fake data.`;

      sendMessage(contextMessage);
      hasSentContext.current = true;
    }
  }, [repoData, isLoading, sendMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  return (
    <aside className="w-80 border-l-2 border-brutal-black bg-white flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 overflow-hidden shadow-[-4px_0px_0px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="p-4 border-b-2 border-brutal-black bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              AI Command Center
            </span>
          </div>
          <button className="text-zinc-400 hover:text-black transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 p-2 bg-brutal-yellow/10 border border-brutal-yellow rounded text-brutal-black">
          <Target size={14} className="text-brutal-yellow" />
          <span className="text-[10px] font-bold uppercase tracking-tight">
            Focus: Architecture
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30"
      >
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto brutal-border">
              <Zap size={24} className="text-brutal-yellow fill-brutal-yellow" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase">
                Ready to visualize
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium px-4">
                Ask about the auth flow, module clusters, or entry points.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 px-4 mt-4 text-[10px]">
              <SuggestionButton
                onClick={() => sendMessage("Explain the architecture")}
                text="Architecture Overview"
              />
              <SuggestionButton
                onClick={() => sendMessage("Show auth flow")}
                text="Auth Sequence"
              />
              <SuggestionButton
                onClick={() => sendMessage("What are the key files?")}
                text="Critical Files"
              />
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <MessageBubble role={msg.role} content={Array.isArray(msg.content) ? msg.content.map(part => 'text' in part ? part.text : '').join('') : msg.content} />
          </div>
        ))}

        {isLoading && <LoadingDots />}
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-brutal-black bg-white relative">
        {isLocked && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-10 p-4">
            <div className="text-[10px] font-bold text-zinc-400 text-center uppercase tracking-widest leading-tight">
              🔓 Connect a repository <br /> to unlock AI Command
            </div>
          </div>
        )}
        <ChatInput
          onSend={sendMessage}   // 🔥 DIRECT TO TAMBO
          disabled={isLoading || isLocked}
        />
      </div>
    </aside>
  );
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-2 border border-zinc-200 bg-white hover:border-brutal-black hover:bg-zinc-50 transition-all font-bold uppercase tracking-tight shadow-[2px_2px_0px_rgba(0,0,0,0.05)] hover:shadow-[2px_2px_0px_black]"
    >
      {text}
    </button>
  );
}

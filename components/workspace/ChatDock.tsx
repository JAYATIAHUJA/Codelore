"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { LoadingDots } from "@/components/chat/LoadingDots";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useRepo } from "@/components/providers/RepoProvider";
import { useChat } from "@/hooks/useChat";
import { MoreHorizontal, Target, Zap } from "lucide-react";
import { useEffect, useRef } from "react";


export function ChatDock() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { repoData } = useRepo();

  const { messages, isLoading, sendMessage, setRepoContext } = useChat();

  const isLocked = !repoData;

  // Inject repo context when repo data changes
  const lastRepoUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!repoData) return;
    if (repoData.repo?.url === lastRepoUrl.current) return;
    lastRepoUrl.current = repoData.repo?.url ?? null;

    // Build context string for Gemini
    const moduleSummary = repoData.modules?.length
      ? repoData.modules
        .map(
          (m) =>
            `- ${m.name} (${m.type}): ${m.description} | Files: ${m.files.slice(0, 5).join(", ")}`
        )
        .join("\n")
      : "No modules detected yet.";

    const langInfo = repoData.stats?.languages?.length
      ? `Languages: ${[...new Set(repoData.stats.languages)].join(", ")}`
      : "";

    const frameworkInfo = repoData.stats?.frameworks?.length
      ? `Frameworks: ${repoData.stats.frameworks.join(", ")}`
      : "";

    const trimmedFileList = repoData.files
      .filter((f) => f.type === "file")
      .map((f) => f.path)
      .slice(0, 100)
      .join("\n");

    const context = `Repository: ${repoData.repo.owner}/${repoData.repo.name} (${repoData.repo.description || "no description"}).
${langInfo} ${frameworkInfo}
Files: ${repoData.stats.totalFiles}, Folders: ${repoData.stats.totalFolders}

Modules:
${moduleSummary}

Key files:
${trimmedFileList}

${repoData.repo.readme ? `README:\n${repoData.repo.readme?.slice(0, 3000)}` : ""}`;

    setRepoContext(context);
  }, [repoData, setRepoContext]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  return (
    <aside className="w-80 border-l arch-border bg-surface flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-hidden arch-shadow">
      {/* Header */}
      <div className="p-4 border-b arch-border bg-surface">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              Architectural AI
            </span>
          </div>
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 p-2 bg-accent/10 dark:bg-accent/5 border border-accent/30 dark:border-accent/20 rounded-sm text-accent">
          <Target size={14} fill="currentColor" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Context: System Topology
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background/30"
      >
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 bg-surface rounded-sm flex items-center justify-center mx-auto arch-border arch-shadow">
              <Zap size={20} className="text-accent" fill="currentColor" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-primary">
                System Initialized
              </h3>
              <p className="text-[10px] text-text-secondary font-medium px-4 leading-relaxed">
                Inquire about complex architecture flows, module clusters, or entry points.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 px-4 mt-6">
              <SuggestionButton
                onClick={() => sendMessage("Explain the architecture")}
                text="Architecture Overview"
              />
              <SuggestionButton
                onClick={() => sendMessage("Show the project graph")}
                text="Project Graph"
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
            <MessageBubble role={msg.role} content={msg.content} />
          </div>
        ))}

        {isLoading && <LoadingDots />}
      </div>

      {/* Input */}
      <div className="p-4 border-t arch-border bg-surface relative">
        {isLocked && (
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-[1px] flex items-center justify-center z-10 p-4 rounded-sm">
            <div className="text-[10px] font-bold text-text-secondary text-center uppercase tracking-[0.2em] leading-tight">
              Connection Required <br /> to Access Intelligence
            </div>
          </div>
        )}
        <ChatInput
          onSend={sendMessage}
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
      className="text-left p-2.5 border arch-border bg-background hover:border-accent/50 dark:hover:border-accent/40 rounded-sm hover:bg-surface transition-all text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-accent arch-shadow-sm"
    >
      {text}
    </button>
  );
}

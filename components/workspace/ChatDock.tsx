"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, Target, MoreHorizontal } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { LoadingDots } from "@/components/chat/LoadingDots";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useRef, useEffect } from "react";
import { useRepo } from "@/components/providers/RepoProvider";
import { useTamboThread } from "@tambo-ai/react";


export function ChatDock() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { repoData } = useRepo();

  // 🔥 THIS IS THE KEY
  const { thread, sendThreadMessage, isIdle } = useTamboThread();

  const messages = thread?.messages ?? [];
  const sendMessage = sendThreadMessage;
  const isLoading = !isIdle;

  const isLocked = !repoData;

  // Inject Repo Context
  const hasSentContext = useRef(false);

  useEffect(() => {
    if (repoData && !hasSentContext.current && !isLoading) {
      console.log("Injecting repo context to AI...");
      const fileList = repoData.files.map(f => f.path).join("\n");
      const contextMessage = `I have connected to the repository ${repoData.repo.owner}/${repoData.repo.name}.
Here is the full file structure:
${fileList}

Please analyze this structure. When I ask for specific views (like "Show architecture" or "Show file tree"), use this data to generate the response.
For ModuleCards, generate a logical breakdown of modules based on these files.
For TreeView, use the actual file paths provided here.`;

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
            <MessageBubble role={msg.role} content={msg.content} />
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

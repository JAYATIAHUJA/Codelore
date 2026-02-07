"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, Target, MoreHorizontal } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { LoadingDots } from "@/components/chat/LoadingDots";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useRef, useEffect } from "react";

interface ChatDockProps {
  messages: any[];
  onSend: (text: string) => void;
  isLoading: boolean;
}

export function ChatDock({ messages, onSend, isLoading }: ChatDockProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <aside className="w-80 border-l-2 border-brutal-black bg-white flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 overflow-hidden shadow-[-4px_0px_0px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="p-4 border-b-2 border-brutal-black bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI Command Center</span>
          </div>
          <button className="text-zinc-400 hover:text-black transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 p-2 bg-brutal-yellow/10 border border-brutal-yellow rounded text-brutal-black">
          <Target size={14} className="text-brutal-yellow" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Focus: Architecture</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto brutal-border">
               <Zap size={24} className="text-brutal-yellow fill-brutal-yellow" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase">Ready to visualize</h3>
              <p className="text-[10px] text-zinc-500 font-medium px-4">
                Ask about the auth flow, module clusters, or entry points.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 px-4 mt-4 text-[10px]">
               <SuggestionButton onClick={() => onSend("Explain the architecture")} text="Architecture Overview" />
               <SuggestionButton onClick={() => onSend("Show auth flow")} text="Auth Sequence" />
               <SuggestionButton onClick={() => onSend("What are the key files?")} text="Critical Files" />
            </div>
          </div>
        )}

        {/* Render actual messages */}
        {messages.map((msg) => (
           <div key={msg.id} className="space-y-1">
              {msg.role === "user" ? (
                <div className="flex justify-end">
                   <div className="bg-brutal-black text-white px-3 py-2 text-xs font-medium rounded-lg rounded-tr-none shadow-[2px_2px_0px_rgba(0,0,0,0.1)] max-w-[90%] font-mono">
                      {msg.content}
                   </div>
                </div>
              ) : (
                <div className="space-y-2">
                   {msg.content && (
                     <div className="flex justify-start">
                        <div className="bg-white border border-zinc-200 px-3 py-2 text-xs font-medium rounded-lg rounded-tl-none shadow-[2px_2px_0px_rgba(0,0,0,0.05)] max-w-[90%] leading-relaxed">
                           {typeof msg.content === 'string' ? msg.content : "Calculating components..."}
                        </div>
                     </div>
                   )}
                </div>
              )}
           </div>
        ))}
        {isLoading && <LoadingDots />}
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-brutal-black bg-white">
        <ChatInput onSend={onSend} disabled={isLoading} />
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

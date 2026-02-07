"use client";

import React, { useRef, useEffect } from "react";
import { useTamboThread } from "@tambo-ai/react";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { LoadingDots } from "@/components/chat/LoadingDots";

const WELCOME_SUGGESTIONS = [
  "Explain this project",
  "Show folder structure",
  "Focus on backend",
  "Only auth flow",
  "What does login.ts do?",
];

export default function Interface() {
  const { thread, sendThreadMessage, isIdle } = useTamboThread();
  const isLoading = !isIdle;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread?.messages, isLoading]);

  const handleSend = async (text: string) => {
    try {
      await sendThreadMessage(text);
    } catch (error) {
      console.error("Failed to send message:", error);
      if (typeof error === 'object' && error !== null) {
        console.error("Error details:", JSON.stringify(error, null, 2));
      }
      alert("Failed to send message to AI. Please check the console for details.");
    }
  };

  const messages = thread?.messages ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-comic-white)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-black bg-[#FFD600] px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🗺️</span>
            <h1 className="font-[var(--font-bangers)] text-2xl tracking-wider uppercase">
              CODELORE INTERFACE
            </h1>
          </div>
          <span className="comic-border rounded-full bg-white px-3 py-1 text-xs font-bold">
            GENERATIVE UI
          </span>
        </div>
      </header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center comic-enter">
              <span className="text-6xl mb-4">💬</span>
              <h2 className="font-[var(--font-bangers)] text-3xl tracking-wider mb-2 uppercase">
                TALK TO YOUR CODEBASE!
              </h2>
              <p className="text-zinc-600 text-base mb-6 max-w-md font-medium">
                Ask anything about the project. The UI will transform based on what you want to understand.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {WELCOME_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="comic-border rounded-full bg-white px-4 py-2 text-sm font-semibold hover:bg-yellow-50 active:scale-95 transition-all"
                  >
                    &ldquo;{s}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <React.Fragment key={msg.id}>
              {msg.role === "user" && msg.content && (
                <MessageBubble role="user" content={msg.content} />
              )}

              {msg.role === "assistant" && msg.content && (
                <MessageBubble role="assistant" content={msg.content} />
              )}

              {msg.role === "assistant" && msg.renderedComponent && (
                <div className="comic-enter">
                  {msg.renderedComponent}
                </div>
              )}
            </React.Fragment>
          ))}

          {isLoading && <LoadingDots />}
        </div>
      </div>

      {/* Fixed Input */}
      <div className="sticky bottom-0 border-t-4 border-black bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}

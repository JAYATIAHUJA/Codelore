"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { Send, Bot, User } from "lucide-react";

interface ChatInterfaceProps {
  threadId?: string;
}

/**
 * Legacy standalone chat interface component.
 * The workspace now uses ChatDock + useChat hook.
 * Kept for reference but no longer actively used.
 */
export default function ChatInterface({ threadId }: ChatInterfaceProps) {
  const [question, setQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await sendMessage(question.trim());
    setQuestion("");
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background">
      <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
        <Bot className="h-4 w-4" />
        <span className="text-sm font-medium">Chat about this repository</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <Bot className="h-8 w-8 opacity-50" />
            <p>Ask anything about this repository!</p>
            <div className="text-xs opacity-70 space-y-1">
              <p>• "What tech stack does this use?"</p>
              <p>• "How is the project structured?"</p>
              <p>• "Explain the data flow"</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Bot className="h-3 w-3" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
                  }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <User className="h-3 w-3" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
              <Bot className="h-3 w-3" />
            </div>
            <div className="bg-muted rounded-lg px-3 py-2 text-sm">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleAsk} className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask about the repo..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-sm"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !question.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

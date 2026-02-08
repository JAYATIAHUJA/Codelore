"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { Send, Bot, User } from "lucide-react";

interface ChatInterfaceProps {
  threadId?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface({ threadId }: ChatInterfaceProps) {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thread = useTamboThread();
  const { setValue: setInput, submit } = useTamboThreadInput();

  const threadMessages = thread?.thread?.messages || [];
  const hasGraph = threadMessages.length >= 2;

  // Sync assistant responses from thread into local messages
  useEffect(() => {
    if (threadMessages.length <= 2) return; // Skip initial graph pair

    const latestMsg = threadMessages[threadMessages.length - 1];
    if (latestMsg && latestMsg.role === "assistant") {
      const content = typeof latestMsg.content === "string" ? latestMsg.content : "";
      if (content && !localMessages.some((m) => m.content === content && m.role === "assistant")) {
        setLocalMessages((prev) => [...prev, { role: "assistant", content }]);
      }
    }
  }, [threadMessages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages.length]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !hasGraph) return;

    const userQ = question.trim();
    setLocalMessages((prev) => [...prev, { role: "user", content: userQ }]);
    setQuestion("");
    setIsAsking(true);

    try {
      const prompt = `The user is asking a follow-up question about the repository that was just analyzed. Use the file structure, architecture, and all context from the previous analysis to answer thoroughly.

Do NOT generate a new graph. Just answer the question conversationally with specific references to files, directories, and architecture.

User's question: ${userQ}`;

      setInput(prompt);
      await submit();
    } catch (error) {
      console.error("Chat error:", error);
      setLocalMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background">
      <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
        <Bot className="h-4 w-4" />
        <span className="text-sm font-medium">Chat about this repository</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px]">
        {localMessages.length === 0 ? (
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
          localMessages.map((msg, i) => (
            <div
              key={i}
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
        {isAsking && (
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
            placeholder={hasGraph ? "Ask about the repo..." : "Generate a graph first"}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isAsking || !hasGraph}
            className="flex-1 text-sm"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isAsking || !question.trim() || !hasGraph}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

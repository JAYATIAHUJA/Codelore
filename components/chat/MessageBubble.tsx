"use client";

import React from "react";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system" | "tool" | string;
  content: string | any[];
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";
  const label = isUser ? "You" : role === "assistant" ? "AI Navigator" : role.toUpperCase();

  if (role === "system") return null; // Hide system messages

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}>
      <span className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${isUser ? "text-accent" : "text-text-secondary"}`}>
        {label}
      </span>
      <div 
        className={`max-w-[90%] p-3.5 rounded-sm border ${
          isUser 
          ? "bg-accent text-white dark:text-black border-accent dark:border-accent/50 arch-shadow" 
          : "bg-surface text-text-primary arch-border arch-shadow-sm"
        }`}
      >
        <div className="text-xs leading-relaxed font-medium">
          {Array.isArray(content) ? (
            content.map((part, i) =>
              part.type === "text" ? <p key={i}>{part.text}</p> : null
            )
          ) : typeof content === 'object' && content !== null ? (
            <pre className="whitespace-pre-wrap font-mono text-[10px]">{JSON.stringify(content, null, 2)}</pre>
          ) : (
            <p className="whitespace-pre-wrap">{String(content)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

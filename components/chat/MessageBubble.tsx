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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} comic-enter`}>
      <div className={`max-w-[80%] ${isUser ? "speech-bubble" : "speech-bubble speech-bubble-ai"}`}>
        <span className="text-xs font-bold uppercase text-zinc-500 block mb-1">
          {label}
        </span>
        <div className="text-sm leading-relaxed">
          {Array.isArray(content) ? (
            content.map((part, i) =>
              part.type === "text" ? <p key={i}>{part.text}</p> : null
            )
          ) : typeof content === 'object' && content !== null ? (
            <p>{JSON.stringify(content)}</p>
          ) : (
            <p>{String(content)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder='Try: "Explain this project" or "Show auth flow"'
        className="flex-1 comic-border rounded-lg px-4 py-3 text-base font-semibold bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="border-black border-2 rounded-md bg-[#FFA6F6] hover:bg-[#fa8cef] active:bg-[#f774ea] px-6 py-2 font-[var(--font-bangers)] text-lg tracking-wider text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
      >
        SEND!
      </button>
    </form>
  );
}

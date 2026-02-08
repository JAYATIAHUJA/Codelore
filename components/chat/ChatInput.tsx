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
        placeholder='Inquire about architecture...'
        className="flex-1 border arch-border rounded-sm px-4 py-3 text-xs font-medium bg-background text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent/60 dark:focus:border-accent/40 disabled:opacity-50 transition-all arch-shadow-sm"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="arch-btn-primary px-5 py-2 uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed arch-shadow transition-all"
      >
        Send
      </button>
    </form>
  );
}

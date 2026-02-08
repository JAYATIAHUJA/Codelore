"use client";

import React from "react";

interface ComicPanelProps {
  title?: string;
  color?: string;
  children: React.ReactNode;
  className?: string;
}

export function ComicPanel({ title, color = "var(--accent)", children, className = "" }: ComicPanelProps) {
  return (
    <div className={`relative overflow-hidden arch-border bg-surface rounded-sm arch-shadow ${className}`}>
      {title && (
        <div
          className="relative z-10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#000000] border-b arch-border font-mono"
          style={{ backgroundColor: color }}
        >
          {title}
        </div>
      )}
      <div className="relative z-10 p-4">
        {children}
      </div>
    </div>
  );
}

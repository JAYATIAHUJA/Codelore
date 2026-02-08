"use client";

import React from "react";
import { ComicPanel } from "@/components/ui/ComicPanel";
import { Lightbulb } from "lucide-react";

interface GuidanceCardProps {
  message?: string;
  suggestions?: string[];
}

export function GuidanceCard({ message = "How can I help you?", suggestions = [] }: GuidanceCardProps) {
  return (
    <ComicPanel title="GUIDE" color="var(--accent)">
      <div className="space-y-5">
        <div className="flex gap-4">
          <div className="shrink-0 w-8 h-8 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Lightbulb size={16} className="text-accent" />
          </div>
          <p className="text-[13px] font-medium leading-relaxed text-text-primary">{message}</p>
        </div>
        
        {suggestions.length > 0 && (
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary/60">Suggested queries</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((s) => (
                <span
                  key={s}
                  className="inline-block arch-border border rounded-sm bg-surface px-4 py-2 text-[10px] font-bold text-text-primary cursor-default hover:bg-text-primary/5 transition-colors arch-shadow uppercase tracking-widest"
                >
                  &ldquo;{s}&rdquo;
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ComicPanel>
  );
}

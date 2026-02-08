"use client";

import React from "react";
import { fileSummaries } from "@/lib/mock-data";
import { ComicPanel } from "@/components/ui/ComicPanel";
import { FileText, AlertCircle } from "lucide-react";

interface FileSummaryProps {
  filename?: string;
  title?: string;
}

export function FileSummary({ filename, title = "FILE DETAILS" }: FileSummaryProps) {
  const safeFilename = filename || "unknown.ts";
  const info = fileSummaries[safeFilename];

  if (!info) {
    return (
      <ComicPanel title={title}>
        <div className="flex items-center gap-3 p-2 text-text-secondary">
          <AlertCircle size={14} className="text-accent" />
          <p className="text-[11px] font-medium">
            No detailed summary for <code className="font-mono bg-text-primary/5 px-1 rounded-sm border arch-border">{filename}</code>.
          </p>
        </div>
      </ComicPanel>
    );
  }

  return (
    <ComicPanel title={title}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center">
            <FileText size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-primary">{filename}</h3>
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary/60 mt-1 block">{info.role}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary/60">Importance</span>
          <span
            className={`inline-block rounded-sm px-3 py-1 text-[9px] font-bold border uppercase tracking-tighter ${info.importance === "Critical"
              ? "bg-red-500/10 border-red-500/20 text-red-500"
              : "bg-accent/10 border-accent/20 text-accent"
              }`}
          >
            {info.importance}
          </span>
        </div>
        
        <p className="text-[11px] leading-relaxed text-text-secondary font-medium arch-border border rounded-sm p-4 bg-surface arch-shadow">
          {info.details}
        </p>
      </div>
    </ComicPanel>
  );
}

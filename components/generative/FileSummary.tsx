"use client";

import React from "react";
import { fileSummaries } from "@/lib/mock-data";
import { ComicPanel } from "@/components/ui/ComicPanel";
import { FileText, AlertCircle } from "lucide-react";

interface FileSummaryProps {
  filename?: string;
  title?: string;
  role?: string;
  description?: string;
  importance?: string;
}

export function FileSummary({
  filename,
  title = "FILE DETAILS",
  role,
  description,
  importance
}: FileSummaryProps) {
  const safeFilename = filename || "unknown.ts";
  // Only use mock data if no description is provided
  const info = !description ? fileSummaries[safeFilename] : null;

  if (description) {
    return (
      <ComicPanel title={title} color="#ff9800">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <h3 className="font-[var(--font-bangers)] text-xl tracking-wide">{filename}</h3>
              {role && <span className="text-xs font-bold uppercase text-zinc-500">{role}</span>}
            </div>
          </div>
          {importance && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-zinc-500">Importance:</span>
              <span
                className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold border-2 border-black ${importance === "Critical"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
                  }`}
              >
                {importance}
              </span>
            </div>
          )}
          <p className="text-sm leading-relaxed text-zinc-700 comic-border rounded-lg p-3 bg-zinc-50">
            {description}
          </p>
        </div>
      </ComicPanel>
    );
  }

  // Fallback for mock data (legacy support if needed, or just default behavior)
  const fallbackInfo = fileSummaries[safeFilename];
  const finalInfo = info || fallbackInfo;

  if (!finalInfo) {
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
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary/60 mt-1 block">{finalInfo.role}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary/60">Importance</span>
          <span
<<<<<<< HEAD
            className={`inline-block rounded-sm px-3 py-1 text-[9px] font-bold border uppercase tracking-tighter ${info.importance === "Critical"
              ? "bg-red-500/10 border-red-500/20 text-red-500"
              : "bg-accent/10 border-accent/20 text-accent"
=======
            className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold border-2 border-black ${finalInfo.importance === "Critical"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
>>>>>>> bf1391fd6cfddc983e04a57446abc13740f2ee2c
              }`}
          >
            {finalInfo.importance}
          </span>
        </div>
<<<<<<< HEAD
        
        <p className="text-[11px] leading-relaxed text-text-secondary font-medium arch-border border rounded-sm p-4 bg-surface arch-shadow">
          {info.details}
=======
        <p className="text-sm leading-relaxed text-zinc-700 comic-border rounded-lg p-3 bg-zinc-50">
          {finalInfo.details}
>>>>>>> bf1391fd6cfddc983e04a57446abc13740f2ee2c
        </p>
      </div>
    </ComicPanel>
  );
}

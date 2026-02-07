"use client";

import React from "react";
import { fileSummaries } from "@/lib/mock-data";
import { ComicPanel } from "@/components/ui/ComicPanel";

interface FileSummaryProps {
  filename?: string;
  title?: string;
}

export function FileSummary({ filename, title = "FILE DETAILS" }: FileSummaryProps) {
  const safeFilename = filename || "unknown.ts";
  const info = fileSummaries[safeFilename];

  if (!info) {
    return (
      <ComicPanel title={title} color="#ff9800">
        <p className="text-zinc-500 text-sm">
          No detailed summary for <code className="font-mono bg-zinc-100 px-1 rounded">{filename}</code>.
          Try: login.ts, authMiddleware.ts, tokenService.ts, routes.ts, prismaClient.ts, Dashboard.tsx
        </p>
      </ComicPanel>
    );
  }

  return (
    <ComicPanel title={title} color="#ff9800">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📄</span>
          <div>
            <h3 className="font-[var(--font-bangers)] text-xl tracking-wide">{filename}</h3>
            <span className="text-xs font-bold uppercase text-zinc-500">{info.role}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500">Importance:</span>
          <span
            className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold border-2 border-black ${info.importance === "Critical"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
              }`}
          >
            {info.importance}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-zinc-700 comic-border rounded-lg p-3 bg-zinc-50">
          {info.details}
        </p>
      </div>
    </ComicPanel>
  );
}

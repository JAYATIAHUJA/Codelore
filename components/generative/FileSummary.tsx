"use client";

import React from "react";
import { fileSummaries } from "@/lib/mock-data";
import { ComicPanel } from "@/components/ui/ComicPanel";

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
      <ComicPanel title={title} color="#ff9800">
        <p className="text-zinc-500 text-sm">
          No detailed summary available for <code className="font-mono bg-zinc-100 px-1 rounded">{filename}</code>.
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
            <span className="text-xs font-bold uppercase text-zinc-500">{finalInfo.role}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500">Importance:</span>
          <span
            className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold border-2 border-black ${finalInfo.importance === "Critical"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
              }`}
          >
            {finalInfo.importance}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-zinc-700 comic-border rounded-lg p-3 bg-zinc-50">
          {finalInfo.details}
        </p>
      </div>
    </ComicPanel>
  );
}

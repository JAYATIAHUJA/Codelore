"use client";

import React from "react";
import { modules } from "@/lib/mock-data";
import { ComicPanel } from "@/components/ui/ComicPanel";

interface Module {
  name: string;
  description: string;
  files: string[];
  dependencies?: string[];
  color?: string;
}

interface ModuleCardsProps {
  filter?: string;
  title?: string;
  modules?: Module[];
}

const filterMap: Record<string, string[]> = {
  all: [], // If all, we show everything. Logic below handles this.
  backend: ["Backend API", "Services", "Database"],
  frontend: ["Frontend"],
  auth: ["Authentication"],
  database: ["Database"],
  services: ["Services"],
};

export function ModuleCards({ filter = "all", title = "PROJECT OVERVIEW", modules: aiModules }: ModuleCardsProps) {
  // Use AI provided modules if available, otherwise fallback to mock (or empty)
  const data = aiModules || modules;

  const normalizedFilter = filter.toLowerCase();

  // If filter is specific and we have mock data map, use it. 
  // But for AI data, we might need a generic filter.
  // For now, if AI provides data, we just show all of it unless filter logic is generic.
  // Let's implement a simple generic filter if possible, or just show all for AI data as it's likely pre-filtered by generic prompt or just small enough.

  const visible = aiModules
    ? aiModules
    : modules.filter((m) => {
      const activeFilter = filterMap[normalizedFilter] ? normalizedFilter : "all";
      if (activeFilter === "all") return true;
      return filterMap[activeFilter]?.includes(m.name);
    });

  return (
    <ComicPanel title={title} color="#FFD600">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((mod) => (
          <div
            key={mod.name}
            className="comic-border rounded-lg p-4 bg-white hover:scale-[1.02] transition-transform cursor-default"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-black"
                style={{ backgroundColor: mod.color }}
              />
              <h3 className="font-[var(--font-bangers)] text-lg tracking-wide">{mod.name}</h3>
            </div>
            <p className="text-sm text-zinc-700 mb-3 leading-relaxed">{mod.description}</p>
            <div className="mb-2">
              <span className="text-xs font-bold uppercase text-zinc-500">Key Files:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {mod.files.slice(0, 4).map((f) => (
                  <span
                    key={f}
                    className="inline-block rounded bg-zinc-100 border border-zinc-300 px-2 py-0.5 text-xs font-mono"
                  >
                    {f}
                  </span>
                ))}
                {mod.files.length > 4 && (
                  <span className="text-xs text-zinc-400">+{mod.files.length - 4} more</span>
                )}
              </div>
            </div>
            {mod.dependencies && mod.dependencies.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase text-zinc-500">Depends on:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mod.dependencies.map((d) => (
                    <span
                      key={d}
                      className="inline-block rounded-full bg-yellow-100 border border-yellow-400 px-2 py-0.5 text-xs font-semibold"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ComicPanel>
  );
}

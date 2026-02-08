"use client";

import { useRepo } from "@/components/providers/RepoProvider";
import { ComicPanel } from "@/components/ui/ComicPanel";
import { modules } from "@/lib/mock-data";

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
  const { repoData } = useRepo();
  
  // Priority: AI provided modules -> Real repository modules -> Mock data fallback
  const data = aiModules || repoData?.modules || modules;

  const normalizedFilter = filter.toLowerCase();

  // Filter modules based on type for real data, or name for mock data
  const visible = data.filter((m: any) => {
    if (normalizedFilter === "all") return true;
    
    // For real repository data with types
    if ('type' in m) {
      switch (normalizedFilter) {
        case 'frontend': return m.type === 'frontend';
        case 'backend': return m.type === 'backend';
        case 'database': return m.type === 'database';
        case 'config': return m.type === 'config';
        case 'tests': return m.type === 'tests';
        default: return true;
      }
    }
    
    // Fallback for mock data
    const activeFilter = filterMap[normalizedFilter] ? normalizedFilter : "all";
    if (activeFilter === "all") return true;
    return filterMap[activeFilter]?.includes(m.name);
  });

  return (
    <ComicPanel title={title} color="var(--accent)">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((mod) => (
          <div
            key={mod.name}
            className="arch-border border rounded-sm p-4 bg-surface hover:scale-[1.01] transition-transform cursor-default arch-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2.5 h-2.5 rounded-full border border-text-primary/20"
                style={{ backgroundColor: mod.color || "var(--accent)" }}
              />
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-primary">{mod.name}</h3>
            </div>
            <p className="text-[11px] text-text-secondary mb-4 leading-relaxed font-medium">{mod.description}</p>
            <div className="mb-3">
              <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary/60">Key Files</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {mod.files.slice(0, 4).map((f) => (
                  <span
                    key={f}
                    className="inline-block rounded-sm bg-text-primary/5 border arch-border px-2 py-0.5 text-[9px] font-mono text-text-primary"
                  >
                    {f}
                  </span>
                ))}
                {mod.files.length > 4 && (
                  <span className="text-[9px] text-text-secondary/40 font-mono">+{mod.files.length - 4}</span>
                )}
              </div>
            </div>
            {mod.dependencies && mod.dependencies.length > 0 && (
              <div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary/60">Depends on</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {mod.dependencies.map((d) => (
                    <span
                      key={d}
                      className="inline-block rounded-sm bg-accent/10 border border-accent/20 px-2 py-0.5 text-[9px] font-bold text-accent uppercase tracking-tighter"
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

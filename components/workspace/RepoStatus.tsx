"use client";

import { useRepo } from "@/components/providers/RepoProvider";
import { useGitHubIntegration } from "@/lib/useGitHub";
import { GitBranch, Github, RefreshCw, Star, Users } from "lucide-react";

export function RepoStatus() {
  const { repoData } = useRepo();
  const { refreshRepository, isAnalyzing } = useGitHubIntegration();

  if (!repoData) return null;

  const { repo, stats } = repoData;

  return (
    <div className="p-4 bg-surface border-b arch-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Github size={14} className="text-text-primary" />
            <span className="font-bold text-sm tracking-tight text-text-primary">
              {repo.owner}/{repo.name}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-[10px] text-zinc-600 dark:text-text-secondary font-mono uppercase tracking-tighter">
            <div className="flex items-center gap-1">
              <Star size={10} className="text-accent" fill="currentColor" />
              <span>{repo.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch size={10} />
              <span>{repo.branch}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={10} />
              <span>{stats.totalFiles} entities</span>
            </div>
          </div>
        </div>

        <button
          onClick={refreshRepository}
          disabled={isAnalyzing}
          className="w-8 h-8 flex items-center justify-center border arch-border bg-background hover:bg-surface rounded-sm transition-all disabled:opacity-50 text-text-secondary hover:text-accent arch-shadow-sm"
          title="Refresh repository analysis"
        >
          <RefreshCw 
            size={12} 
            className={`${isAnalyzing ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>

      {repo.description && (
        <p className="text-xs text-zinc-600 dark:text-text-secondary mt-2 line-clamp-1">
          {repo.description}
        </p>
      )}

      {stats.languages.length > 0 && (
        <div className="flex gap-1 mt-2">
          {stats.languages.slice(0, 3).map((lang) => (
            <span
              key={lang}
              className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-100 border border-zinc-400 dark:border-zinc-300 rounded text-xs font-mono text-zinc-800 dark:text-zinc-900"
            >
              {lang}
            </span>
          ))}
          {stats.languages.length > 3 && (
            <span className="text-xs text-zinc-400 self-center">
              +{stats.languages.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
"use client";

import { useGitHubIntegration } from "@/lib/useGitHub";
import { AlertCircle, ArrowRight, Github, Loader2 } from "lucide-react";
import React, { useState } from "react";

export function GitHubInput() {
  const [url, setUrl] = useState("");
  const { analyzeRepository, isAnalyzing, error } = useGitHubIntegration();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isAnalyzing) return;

    console.log("Attempting to analyze repository:", url);
    const result = await analyzeRepository(url);
    
    if (result.success) {
      console.log("Repository analysis successful:", result.data);
      setUrl("");
    } else {
      console.error("Repository analysis failed:", result.error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleConnect} className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-accent transition-colors z-10">
          <Github size={18} />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter GitHub repository URL..."
          className="w-full pl-12 pr-36 py-4 bg-background border arch-border font-medium focus:border-accent/40 rounded-sm arch-shadow transition-all outline-none text-text-primary placeholder:text-text-secondary/50 placeholder:text-sm"
          disabled={isAnalyzing}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
           <button
             type="submit"
             disabled={isAnalyzing || !url.trim()}
             className="arch-btn-primary h-10 px-6 uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             {isAnalyzing ? (
               <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Scanning...</span>
               </>
             ) : (
               <>
                 <span>Analyze</span>
                 <ArrowRight size={14} />
               </>
             )}
           </button>
        </div>
      </form>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-accent/5 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest rounded-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}

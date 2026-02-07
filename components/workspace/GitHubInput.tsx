"use client";

import React, { useState } from "react";
import { Github, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { useRepo } from "@/components/providers/RepoProvider";

export function GitHubInput() {
  const [url, setUrl] = useState("");
  const { setRepoData, isLoading, setIsLoading, error, setError } = useRepo();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting to connect to:", url);
      const response = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      console.log("GitHub API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to connect to GitHub");
      }

      setRepoData(data);
      setUrl("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleConnect} className="relative group px-1">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-brutal-blue transition-colors z-10">
          <Github size={20} />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repository"
          className="w-full pl-12 pr-40 py-4 bg-white border-4 border-brutal-black font-bold brutal-shadow-sm focus:brutal-shadow transition-all outline-none"
          disabled={isLoading}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
           <button
             type="submit"
             disabled={isLoading || !url.trim()}
             className="px-6 py-2 bg-brutal-blue text-white font-black uppercase text-xs tracking-widest hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-black"
           >
             {isLoading ? (
               <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Fetching...</span>
               </>
             ) : (
               <>
                 <span>Connect</span>
                 <ArrowRight size={16} />
               </>
             )}
           </button>
        </div>
      </form>

      {error && (
        <div className="mx-1 flex items-center gap-2 p-3 bg-red-50 border-2 border-brutal-red text-brutal-red text-xs font-bold uppercase">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}

"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RepoInputProps {
  threadId?: string;
}

/**
 * Legacy repo input component. The workspace now uses GitHubInput + useGitHubIntegration.
 * Kept for reference but no longer actively used.
 */
export default function RepoInput({ threadId }: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setIsLoading(true);

    try {
      setStatus("Analyzing repository...");

      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: repoUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Analysis result:", data);
        setStatus("Analysis complete!");
      } else {
        setStatus("Analysis failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-xl">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter GitHub repo URL (e.g., https://github.com/localsend/localsend)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !repoUrl}>
          {isLoading ? "Analyzing..." : "Visualize"}
        </Button>
      </div>
      {status && (
        <p className="text-sm text-muted-foreground animate-pulse">{status}</p>
      )}
    </form>
  );
}

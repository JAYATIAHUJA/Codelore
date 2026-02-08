import { useState, useCallback } from "react";

export interface RepoAnalysis {
  structureSummary: string;
  keyFilesSummary: string;
  fileTree: string;
  directories: string[];
  entryPoints: string[];
  configFiles: string[];
  fileCount: number;
  dirCount: number;
}

export function useRepoAnalysis() {
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeRepo = useCallback(async (repoUrl: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to analyze repository");
      }

      const data: RepoAnalysis = await response.json();
      setAnalysis(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to analyze repository";
      setError(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analysis, isAnalyzing, error, analyzeRepo };
}

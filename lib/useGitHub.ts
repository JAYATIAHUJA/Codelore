"use client";

import { RepoData, useRepo } from "@/components/providers/RepoProvider";
import { useCallback, useState } from "react";

export interface GitHubAnalysisResult {
  success: boolean;
  data?: RepoData;
  error?: string;
}

export function useGitHubIntegration() {
  const { setRepoData, setIsLoading, setError, repoData, isLoading, error } = useRepo();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeRepository = useCallback(async (githubUrl: string): Promise<GitHubAnalysisResult> => {
    if (!githubUrl.trim()) {
      const errorMsg = "Please provide a GitHub repository URL";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Validate GitHub URL format
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+/;
    if (!githubRegex.test(githubUrl)) {
      const errorMsg = "Invalid GitHub URL. Please use format: https://github.com/owner/repo";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: githubUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze repository');
      }

      setRepoData(result);
      return { success: true, data: result };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  }, [setRepoData, setIsLoading, setError]);

  const clearRepository = useCallback(() => {
    setRepoData(null);
    setError(null);
  }, [setRepoData, setError]);

  const refreshRepository = useCallback(async (): Promise<GitHubAnalysisResult> => {
    if (!repoData?.repo?.url) {
      const errorMsg = "No repository loaded to refresh";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    return analyzeRepository(repoData.repo.url);
  }, [repoData?.repo?.url, analyzeRepository, setError]);

  return {
    analyzeRepository,
    clearRepository,
    refreshRepository,
    isAnalyzing,
    repoData,
    isLoading,
    error,
  };
}
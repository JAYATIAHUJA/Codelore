"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export interface RepoFile {
  path: string;
  type: "file" | "directory";
  size: number;
}

export interface Module {
  name: string;
  description: string;
  files: string[];
  dependencies: string[];
  color: string;
  type: "frontend" | "backend" | "database" | "config" | "tests" | "docs";
}

export interface RepoData {
  repo: {
    name: string;
    owner: string;
    branch: string;
    description: string;
    stars: number;
    url: string;
    language: string;
    readme?: string;
  };
  files: RepoFile[];
  modules: Module[];
  stats: {
    totalFiles: number;
    totalFolders: number;
    languages: string[];
    frameworks: string[];
  };
}

interface RepoContextType {
  repoData: RepoData | null;
  setRepoData: (data: RepoData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export function RepoProvider({ children }: { children: ReactNode }) {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <RepoContext.Provider value={{ repoData, setRepoData, isLoading, setIsLoading, error, setError }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  const context = useContext(RepoContext);
  if (context === undefined) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { RepoData } from "@/components/providers/RepoProvider";

export interface WorkspaceTab {
  id: string;
  label: string;
  repoData: RepoData | null;
  isLoading: boolean;
  error: string | null;
}

interface WorkspaceTabsContextType {
  tabs: WorkspaceTab[];
  activeTabId: string;
  activeTab: WorkspaceTab;
  addTab: () => void;
  removeTab: (id: string) => void;
  switchTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<WorkspaceTab>) => void;
}

const WorkspaceTabsContext = createContext<WorkspaceTabsContextType | undefined>(undefined);

function createTab(index: number): WorkspaceTab {
  return {
    id: `tab-${Date.now()}-${index}`,
    label: `Workspace ${index + 1}`,
    repoData: null,
    isLoading: false,
    error: null,
  };
}

export function WorkspaceTabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<WorkspaceTab[]>([createTab(0)]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const addTab = useCallback(() => {
    const newTab = createTab(tabs.length);
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs.length]);

  const removeTab = useCallback((id: string) => {
    setTabs(prev => {
      if (prev.length <= 1) return prev; // Keep at least one tab
      const filtered = prev.filter(t => t.id !== id);
      // If removing active tab, switch to the last remaining tab
      if (activeTabId === id) {
        setActiveTabId(filtered[filtered.length - 1].id);
      }
      return filtered;
    });
  }, [activeTabId]);

  const switchTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  const updateTab = useCallback((id: string, updates: Partial<WorkspaceTab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  return (
    <WorkspaceTabsContext.Provider value={{ tabs, activeTabId, activeTab, addTab, removeTab, switchTab, updateTab }}>
      {children}
    </WorkspaceTabsContext.Provider>
  );
}

export function useWorkspaceTabs() {
  const context = useContext(WorkspaceTabsContext);
  if (!context) {
    throw new Error("useWorkspaceTabs must be used within WorkspaceTabsProvider");
  }
  return context;
}

"use client";

import { TamboThreadProvider } from "@tambo-ai/react";
import React from "react";
import { ChatDock } from "./ChatDock";
import { InfiniteCanvas } from "./InfiniteCanvas";

interface WorkspaceContentProps {
  tabId: string;
  children?: React.ReactNode;
}

/**
 * Wraps each workspace tab's content in its own TamboThreadProvider,
 * giving each tab an isolated AI chat thread and canvas.
 * The `key` prop on this component (set to tabId) ensures full
 * remount when switching tabs → fresh thread per workspace.
 */
export function WorkspaceContent({ tabId, children }: WorkspaceContentProps) {
  return (
    <TamboThreadProvider contextKey={`workspace-${tabId}`} streaming>
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <InfiniteCanvas>
            {children}
          </InfiniteCanvas>
        </div>
        <ChatDock />
      </div>
    </TamboThreadProvider>
  );
}

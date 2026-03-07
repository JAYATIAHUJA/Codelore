"use client";

import React from "react";
import { ChatDock } from "./ChatDock";
import { InfiniteCanvas } from "./InfiniteCanvas";

interface WorkspaceContentProps {
  tabId: string;
  children?: React.ReactNode;
}

/**
 * Wraps each workspace tab's content with the canvas and chat dock.
 * The `key` prop on this component (set to tabId) ensures full
 * remount when switching tabs → fresh state per workspace.
 */
export function WorkspaceContent({ tabId, children }: WorkspaceContentProps) {
  return (
    <div className="flex flex-1 overflow-hidden relative">
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <InfiniteCanvas>
          {children}
        </InfiniteCanvas>
      </div>
      <ChatDock />
    </div>
  );
}

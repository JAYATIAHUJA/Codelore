"use client";

import React from "react";
import { authFlowSteps, authFlowConnections } from "@/lib/mock-data";
import { ComicPanel } from "@/components/ui/ComicPanel";

interface FlowDiagramProps {
  title?: string;
}

const stepColors = [
  "var(--accent)", // aquamarine
  "var(--accent)", 
  "var(--accent)",
  "var(--accent)",
  "var(--accent)",
  "var(--accent)",
  "var(--accent)",
];

export function FlowDiagram({ title = "AUTH FLOW" }: FlowDiagramProps) {
  return (
    <ComicPanel title={title} color="var(--accent)">
      <div className="flex flex-col items-center gap-0 py-4">
        {authFlowSteps.map((step, i) => {
          const connection = authFlowConnections.find((c) => c.from === step.id);
          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div className="flex items-center gap-4 w-full max-w-sm">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-sm arch-border flex items-center justify-center text-[#000000] font-mono font-bold text-xs"
                  style={{ backgroundColor: stepColors[i] }}
                >
                  {step.id}
                </div>
                <div className="flow-node flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-text-primary">{step.label}</div>
                  <div className="text-[9px] text-text-secondary font-mono opacity-60 uppercase">{step.file}</div>
                  <div className="text-[10px] text-text-secondary mt-1 leading-relaxed">{step.description}</div>
                </div>
              </div>
              {/* Arrow connector */}
              {connection && (
                <div className="flex flex-col items-center my-1">
                  <div className="w-[1px] h-6 bg-border" />
                  <div className="text-[9px] font-bold text-accent uppercase tracking-tighter -my-1">
                    {connection.label} ▼
                  </div>
                  <div className="w-[1px] h-4 bg-border" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </ComicPanel>
  );
}

"use client";

import React from "react";
import { ProjectGraph } from "@/components/generative/ProjectGraph";

// Test data to verify AI graph generation works
const testNodes = [
  {
    id: "frontend",
    label: "React Frontend",
    type: "frontend" as const,
    description: "React components and pages",
    files: ["Dashboard.tsx", "LoginForm.tsx", "Sidebar.tsx"],
    importance: "high" as const,
    style: {
      size: "large" as const,
      color: "#3b82f6"
    }
  },
  {
    id: "backend",
    label: "Node.js API",
    type: "backend" as const,
    description: "REST API endpoints",
    files: ["routes.ts", "controllers.ts"],
    importance: "high" as const,
    style: {
      size: "large" as const,
      color: "#10b981"
    }
  },
  {
    id: "database",
    label: "PostgreSQL",
    type: "database" as const,
    description: "Database and models",
    files: ["schema.sql", "models.ts"],
    importance: "medium" as const,
    style: {
      size: "medium" as const,
      color: "#6366f1"
    }
  },
  {
    id: "config",
    label: "Configuration",
    type: "config" as const,
    description: "App configuration",
    files: ["config.json", ".env"],
    importance: "low" as const,
    style: {
      size: "small" as const,
      color: "#6b7280"
    }
  }
];

const testEdges = [
  {
    id: "frontend-backend",
    source: "frontend",
    target: "backend",
    label: "API calls",
    type: "api-call" as const,
    animated: true,
    style: {
      color: "#f59e0b",
      width: 3
    }
  },
  {
    id: "backend-database",
    source: "backend",
    target: "database",
    label: "queries",
    type: "data-flow" as const,
    animated: true,
    style: {
      color: "#10b981",
      width: 2
    }
  },
  {
    id: "config-backend",
    source: "config",
    target: "backend",
    label: "settings",
    type: "dependency" as const,
    animated: false,
    style: {
      color: "#6b7280",
      width: 1,
      dashArray: "5,5"
    }
  }
];

export function GraphTest() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">AI Graph Generation Test</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Modern Theme</h2>
        <ProjectGraph
          title="MODERN ARCHITECTURE"
          initialNodes={testNodes}
          initialEdges={testEdges}
          layout={{
            direction: "horizontal",
            spacing: 400,
            algorithm: "hierarchical"
          }}
          style={{
            theme: "modern",
            background: "dots",
            animations: true
          }}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Brutal Theme</h2>
        <ProjectGraph
          title="BRUTAL ARCHITECTURE"
          initialNodes={testNodes}
          initialEdges={testEdges}
          layout={{
            direction: "vertical",
            spacing: 300,
            algorithm: "hierarchical"
          }}
          style={{
            theme: "brutal",
            background: "grid",
            animations: false
          }}
        />
      </div>
    </div>
  );
}

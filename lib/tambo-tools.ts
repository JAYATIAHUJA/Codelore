import { TamboTool } from "@tambo-ai/react";

export const graphGeneratorTool: TamboTool = {
  name: "graphGenerator",
  description: `Generates a knowledge graph of a GitHub repository's architecture. 
You MUST generate at least 8 nodes and 12 edges based on the repository's actual file structure.
Analyze directories, files, dependencies, and entry points to create a meaningful connected graph.
Every node MUST have at least one edge. Every edge MUST reference valid node IDs.`,
  parameters: {
    type: "object" as const,
    properties: {
      repoUrl: {
        type: "string",
        description: "The GitHub repository URL",
      },
      repoContent: {
        type: "string",
        description: "README content (supplementary)",
      },
      repoStructure: {
        type: "string",
        description:
          "The analyzed file structure of the repository. PRIMARY source for graph generation.",
      },
      nodes: {
        type: "array",
        description: `Array of 8-20 graph nodes. Each needs id (snake_case), label (short name), group (core|ui|data|config|service|entry|external|test|build).`,
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique snake_case identifier" },
            label: { type: "string", description: "Short display label" },
            group: {
              type: "string",
              description:
                "Category: core, ui, data, config, service, entry, external, test, build",
            },
          },
          required: ["id", "label"],
        },
      },
      edges: {
        type: "array",
        description: `Array of 12-30 edges. Each needs from/to (valid node IDs) and optional label.`,
        items: {
          type: "object",
          properties: {
            from: { type: "string", description: "Source node ID" },
            to: { type: "string", description: "Target node ID" },
            label: { type: "string", description: "Relationship type" },
          },
          required: ["from", "to"],
        },
      },
    },
    required: ["nodes", "edges"],
  },
  handler: async (params: Record<string, unknown>) => {
    // Ensure all values are defined with proper defaults
    const nodes = Array.isArray(params.nodes) ? params.nodes : [];
    const edges = Array.isArray(params.edges) ? params.edges : [];
    const repoUrl = typeof params.repoUrl === "string" ? params.repoUrl : "";

    // Sanitize nodes — ensure every node has id, label, group
    const sanitizedNodes = nodes.map((n: any) => ({
      id: String(n.id || ""),
      label: String(n.label || n.id || ""),
      group: String(n.group || "core"),
    }));

    // Sanitize edges — ensure every edge has from, to, label
    const nodeIds = new Set(sanitizedNodes.map((n: any) => n.id));
    const sanitizedEdges = edges
      .filter((e: any) => e && e.from && e.to && nodeIds.has(String(e.from)) && nodeIds.has(String(e.to)))
      .map((e: any) => ({
        from: String(e.from),
        to: String(e.to),
        label: String(e.label || ""),
      }));

    return {
      nodes: sanitizedNodes,
      edges: sanitizedEdges,
      repoUrl,
    };
  },
};

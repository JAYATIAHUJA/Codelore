import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

const GraphNodeSchema = z.object({
  id: z.string().describe("Unique snake_case identifier"),
  label: z.string().describe("Short display label"),
  group: z.string().describe("Category: core, ui, data, config, service, entry, external, test, build"),
});

const GraphEdgeSchema = z.object({
  from: z.string().describe("Source node ID"),
  to: z.string().describe("Target node ID"),
  label: z.string().optional().describe("Relationship type"),
});

const InputSchema = z.object({
  repoUrl: z.string().describe("The GitHub repository URL"),
  repoContent: z.string().describe("README content (supplementary)").optional(),
  repoStructure: z.string().describe("The analyzed file structure of the repository. PRIMARY source for graph generation."),
  nodes: z.array(GraphNodeSchema).describe("Array of 8-20 graph nodes. Each needs id (snake_case), label (short name), group (core|ui|data|config|service|entry|external|test|build)."),
  edges: z.array(GraphEdgeSchema).describe("Array of 12-30 edges. Each needs from/to (valid node IDs) and optional label."),
});

const OutputSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      group: z.string(),
    })
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      label: z.string(),
    })
  ),
  repoUrl: z.string(),
});

export const graphGeneratorTool: TamboTool<z.infer<typeof InputSchema>, z.infer<typeof OutputSchema>> = {
  name: "graphGenerator",
  description: `Generates a knowledge graph of a GitHub repository's architecture. 
You MUST generate at least 8 nodes and 12 edges based on the repository's actual file structure.
Analyze directories, files, dependencies, and entry points to create a meaningful connected graph.
Every node MUST have at least one edge. Every edge MUST reference valid node IDs.`,
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  tool: async (params) => {
    // Ensure all values are defined with proper defaults
    const nodes = Array.isArray(params.nodes) ? params.nodes : [];
    const edges = Array.isArray(params.edges) ? params.edges : [];
    const repoUrl = typeof params.repoUrl === "string" ? params.repoUrl : "";

    // Sanitize nodes — ensure every node has id, label, group
    const sanitizedNodes = nodes.map((n) => ({
      id: String(n.id || ""),
      label: String(n.label || n.id || ""),
      group: String(n.group || "core"),
    }));

    // Sanitize edges — ensure every edge has from, to, label
    const nodeIds = new Set(sanitizedNodes.map((n) => n.id));
    const sanitizedEdges = edges
      .filter((e) => e && e.from && e.to && nodeIds.has(String(e.from)) && nodeIds.has(String(e.to)))
      .map((e) => ({
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

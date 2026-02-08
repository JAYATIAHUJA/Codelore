import { CodeFlowGraph } from "@/components/generative/CodeFlowGraph";
import { FileSummary } from "@/components/generative/FileSummary";
import { FlowDiagram } from "@/components/generative/FlowDiagram";
import { GenerativeTable } from "@/components/generative/GenerativeTable";
import { GuidanceCard } from "@/components/generative/GuidanceCard";
import { ModuleCards } from "@/components/generative/ModuleCards";
import { TreeView } from "@/components/generative/TreeView";
import { type TamboComponent } from "@tambo-ai/react";
import { ProjectGraph } from "@/components/generative/ProjectGraph";
import { z } from "zod";

export const componentRegistry: TamboComponent[] = [
  {
    name: "GenerativeTable",
    description:
      "Displays structured data in a table format. Use when the user asks for a 'table', 'list', 'comparison', 'matrix', or 'grid' of data. Suitable for listing API endpoints, database schemas, configuration options, dependencies, or any structured data that fits in rows and columns.",
    component: GenerativeTable,
    propsSchema: z.object({
      title: z.string().optional().default("DATA TABLE").describe("Title of the table"),
      description: z.string().optional().describe("Optional description of what the table shows"),
      columns: z.array(
        z.object({
          header: z.string().optional().default("").describe("Header text for the column"),
          width: z.string().optional().describe("CSS width (e.g. '20%', '100px')"),
          align: z.string().optional().default("left").describe("Text alignment for the column (left, center, right)"),
        })
      ).optional().default([]).describe("Column definitions"),
      rows: z.array(
        z.object({
          values: z.array(z.string().optional().default("")).optional().default([]).describe("Array of cell values corresponding to the column order"),
        })
      ).optional().default([]).describe("Data rows for the table"),
    }),
  },
  {
    name: "ModuleCards",
    description:
      "Shows a high-level architecture overview of the codebase as module cards. Use when the user asks to explain the project, wants a high-level overview, architecture, or what the codebase does. This component AUTO-READS real repository data — just render it with a title and filter, do NOT pass custom modules unless specifically needed.",
    component: ModuleCards,
    propsSchema: z.object({
      filter: z
        .string()
        .optional()
        .default("all")
        .describe("Which modules to show. Use 'all' by default. Options: 'all', 'frontend', 'backend', 'database', 'config', 'tests'. Real repositories auto-detect these types."),
      title: z
        .string()
        .optional()
        .default("PROJECT OVERVIEW")
        .describe("A short comic-style title for the section, e.g. 'PROJECT OVERVIEW!' or 'BACKEND MODULES!'"),
      modules: z
        .array(
          z.object({
            name: z.string().optional().default("Unknown Module").describe("Name of the module, e.g. 'Next.js Frontend', 'Node.js Backend'"),
            description: z.string().optional().default("").describe("Brief description of what this module does"),
            files: z.array(z.string()).optional().default([]).describe("List of key files in this module"),
            dependencies: z.array(z.string()).optional().default([]).describe("List of other modules this module depends on"),
            color: z.string().optional().default("#000000").describe("Hex color code for the module tag"),
            type: z.enum(['frontend', 'backend', 'database', 'config', 'tests', 'docs']).optional().describe("Module type for filtering"),
          })
        )
        .optional()
        .nullable()
        .describe("Optional custom modules. If omitted, will use real repository analysis or fall back to mock data."),
    }),
  },
  {
    name: "TreeView",
    description:
      "Shows the folder/file structure of the codebase as a collapsible tree. This component AUTO-READS real repository data from the connected GitHub repo. Just render it — do NOT pass file data as props. Use when user asks to 'show folder structure', 'show files', 'what files are there', or 'project structure'.",
    component: TreeView,
    propsSchema: z.object({
      filter: z
        .string()
        .optional()
        .default("all")
        .describe("Which part of the tree to show. 'all' shows everything. For advanced filtering, use specific types."),
      highlightImportant: z
        .boolean()
        .optional()
        .default(true)
        .describe("If true, highlight important files with a star icon."),
      title: z
        .string()
        .optional()
        .default("FOLDER STRUCTURE")
        .describe("A short comic-style title, e.g. 'FOLDER STRUCTURE!' or 'REPOSITORY FILES!'"),
    }),
  },
  {
    name: "FlowDiagram",
    description:
      "Shows a simple linear flow diagram of the authentication flow. Use ONLY when user asks about 'auth flow', 'how does authentication work', 'login flow', 'how does login work'. Shows steps from Login Form → API → DB → JWT → Dashboard.",
    component: FlowDiagram,
    propsSchema: z.object({
      title: z
        .string()
        .optional()
        .default("AUTH FLOW")
        .describe("A comic-style title, e.g. 'AUTH FLOW!' or 'LOGIN SEQUENCE!'"),
    }),
  },
  {
    name: "CodeFlowGraph",
    description:
      "ALWAYS use this component when the user asks about any kind of flow, lifecycle, trace, sequence, pipeline, or 'how does X work'. Shows a visual diagram with code snippets in columns connected by arrows. Use for: 'show database flow', 'request lifecycle', 'trace the code path', 'how does auth work', 'show startup flow', 'API flow', 'show me the flow for X'. NEVER respond with plain text for flow questions — ALWAYS render this component instead.",
    component: CodeFlowGraph,
    propsSchema: z.object({
      title: z
        .string()
        .nullish()
        .optional()
        .describe("Comic-style title like 'REQUEST LIFECYCLE!' or 'DATABASE FLOW!'"),
      columns: z
        .any()
        .optional()
        .describe(`REQUIRED: An array of 2-4 column objects. NEVER leave this empty. Each column MUST have: title (string), color (hex string), blocks (non-empty array). Example: [{"title":"Entry Point","color":"#FFD600","blocks":[{"id":"main","label":"main()","code":"async function main() {\n  const app = createApp();\n  await app.listen(3000);\n}","highlights":["createApp"],"description":"App entry"}]},{"title":"Service Layer","color":"#bbdefb","blocks":[{"id":"svc","label":"createApp()","code":"function createApp() {\n  const router = new Router();\n  return router;\n}","highlights":["Router"]}]}]`),
      connections: z
        .any()
        .optional()
        .describe(`Array of arrow objects connecting blocks by ID. Example: [{"from":"main","to":"svc","label":"calls"},{"from":"svc","to":"db","label":"queries"}]`),
    }),
  },
  {
    name: "ProjectGraph",
    description:
      "Creates an intelligent, interactive graph visualization of the entire project structure with AI-driven layout, styling, and relationship analysis. Use when user asks to 'visualize the project', 'show project graph', 'create architecture diagram', 'show dependencies', or 'map the codebase'. AI can specify nodes, edges, layout, and styling for optimal visualization.",
    component: ProjectGraph,
    propsSchema: z.object({
      title: z.string().optional().default("PROJECT MAP").describe("Title of the graph, e.g. 'PROJECT MAP', 'ARCHITECTURE DIAGRAM', 'DEPENDENCY GRAPH'"),
      initialNodes: z.array(
        z.object({
          id: z.string().describe("Unique ID for the node"),
          label: z.string().describe("Display label for the node"),
          type: z.enum(["frontend", "backend", "database", "api", "config", "tests", "entry", "utils", "services", "routes", "controllers"]).describe("Type of module for icon and color mapping"),
          description: z.string().optional().describe("Brief description of what this module does"),
          files: z.array(z.string()).optional().describe("Key files in this module"),
          importance: z.enum(["high", "medium", "low"]).optional().describe("Importance level for visual emphasis"),
          position: z.object({ x: z.number().default(0), y: z.number().default(0) }).optional().describe("X/Y coordinates - if not provided, AI will auto-layout"),
          style: z.object({
            color: z.string().optional().describe("Custom color override"),
            icon: z.string().optional().describe("Custom icon name"),
            size: z.enum(["small", "medium", "large"]).optional().default("medium").describe("Node size"),
          }).optional().describe("Visual styling options"),
        })
      ).optional().default([]).describe("Nodes in the graph - AI can create these based on repository analysis"),
      initialEdges: z.array(
        z.object({
          id: z.string().describe("Unique ID for the edge"),
          source: z.string().describe("ID of the source node"),
          target: z.string().describe("ID of the target node"),
          label: z.string().optional().describe("Label on the connection line"),
          type: z.enum(["import", "data-flow", "api-call", "dependency"]).optional().default("dependency").describe("Type of relationship for styling"),
          animated: z.boolean().optional().default(true).describe("Whether the edge should be animated"),
          style: z.object({
            color: z.string().optional().describe("Custom edge color"),
            width: z.number().optional().default(2).describe("Edge thickness"),
            dashArray: z.string().optional().describe("Dash pattern for dashed lines"),
          }).optional().describe("Edge styling options"),
        })
      ).optional().default([]).describe("Connections between nodes - AI determines relationships"),
      layout: z.object({
        direction: z.enum(["horizontal", "vertical", "radial"]).optional().default("horizontal").describe("Layout direction"),
        spacing: z.number().optional().default(350).describe("Spacing between nodes"),
        algorithm: z.enum(["hierarchical", "force", "circular"]).optional().default("hierarchical").describe("Layout algorithm to use"),
      }).optional().describe("Layout configuration for optimal node arrangement"),
      style: z.object({
        theme: z.enum(["modern", "brutal", "minimal", "colorful"]).optional().default("modern").describe("Visual theme - modern has gradients and shadows, brutal has black borders"),
        background: z.enum(["grid", "dots", "solid"]).optional().default("dots").describe("Background pattern"),
        animations: z.boolean().optional().default(true).describe("Enable animations and transitions"),
      }).optional().describe("Overall visual styling and theme"),
    }),
  },
  {
    name: "FileSummary",
    description:
      "Explains a specific file in the codebase — its purpose, role, and importance. Use when the user asks about a specific file.",
    component: FileSummary,
    propsSchema: z.object({
      filename: z
        .string()
        .optional()
        .default("unknown.ts")
        .describe(
          "The filename to explain, e.g. 'login.ts', 'authMiddleware.ts', 'routes.ts'."
        ),
      title: z
        .string()
        .optional()
        .default("FILE BREAKDOWN!")
        .describe(
          "A comic-style title, e.g. 'FILE BREAKDOWN!' or 'INSIDE login.ts!'"
        ),
      role: z
        .string()
        .optional()
        .describe("The role of the file, e.g. 'Authentication Config', 'Helper Utility', 'Main Entry Point'"),
      description: z
        .string()
        .optional()
        .describe("A detailed explanation of what the file does, its key functions, and its importance in the project."),
      importance: z
        .enum(["Critical", "High", "Medium", "Low"])
        .optional()
        .describe("How important this file is to the overall project."),
    }),
  },
  {
    name: "GuidanceCard",
    description:
      "Shows a helpful guidance or suggestion message. Use when the user greets the system, asks an unclear question, or when no other component applies.",
    component: GuidanceCard,
    propsSchema: z.object({
      message: z
        .string()
        .optional()
        .default("Try asking about the project architecture, folder structure, or auth flow.")
        .describe("The guidance message to display."),
      suggestions: z
        .array(z.string())
        .optional()
        .default([
          "Explain this project",
          "Show folder structure",
          "Show auth flow",
        ])
        .describe("Suggested follow-up queries."),
    }),
  },
];

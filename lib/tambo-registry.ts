import { CodeFlowGraph } from "@/components/generative/CodeFlowGraph";
import { FileSummary } from "@/components/generative/FileSummary";
import { FlowDiagram } from "@/components/generative/FlowDiagram";
import { GenerativeTable } from "@/components/generative/GenerativeTable";
import { GuidanceCard } from "@/components/generative/GuidanceCard";
import { ModuleCards } from "@/components/generative/ModuleCards";
import { TreeView } from "@/components/generative/TreeView";
import { type TamboComponent } from "@tambo-ai/react";
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
        .describe("Array of 2-4 columns for flow stages. Each column has: title (string), color (hex string like '#FFD600'), blocks (array of {id, label, code, highlights?, description?})"),
      connections: z
        .any()
        .optional()
        .describe("Array of arrows between blocks. Each has: from (block ID), to (block ID), label? (string)"),
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

import { type TamboComponent } from "@tambo-ai/react";
import { TreeView } from "@/components/generative/TreeView";
import { ModuleCards } from "@/components/generative/ModuleCards";
import { FlowDiagram } from "@/components/generative/FlowDiagram";
import { FileSummary } from "@/components/generative/FileSummary";
import { GuidanceCard } from "@/components/generative/GuidanceCard";
import { z } from "zod";

export const componentRegistry: TamboComponent[] = [
  {
    name: "ModuleCards",
    description:
      "Shows a high-level architecture overview of the codebase as module cards. Use when the user asks to explain the project, wants a high-level overview, architecture, or what the codebase does.",
    component: ModuleCards,
    propsSchema: z.object({
      filter: z
        .string()
        .optional()
        .default("all")
        .describe("Which modules to show. Use 'all' by default. Options: 'all', 'backend', 'frontend', 'auth', 'database', 'services'. If unsure, use 'all'."),
      title: z
        .string()
        .optional()
        .default("PROJECT OVERVIEW")
        .describe("A short comic-style title for the section, e.g. 'PROJECT OVERVIEW!' or 'BACKEND MODULES!'"),
      modules: z
        .array(
          z.object({
            name: z.string().describe("Name of the module, e.g. 'Authentication'"),
            description: z.string().describe("Brief description of what this module does"),
            files: z.array(z.string()).describe("List of key files in this module"),
            dependencies: z.array(z.string()).optional().describe("List of other modules this module depends on"),
            color: z.string().optional().describe("Hex color code for the module tag"),
          })
        )
        .optional()
        .describe("The list of modules to display. Generate this based on the repository code."),
    }),
  },
  {
    name: "TreeView",
    description:
      "Shows the folder/file structure of the codebase as a collapsible tree. Use when user asks to 'show folder structure', 'show files', 'what files are there', 'project structure'. Can filter by module.",
    component: TreeView,
    propsSchema: z.object({
      filter: z
        .string()
        .optional()
        .default("all")
        .describe("Which part of the tree to show. 'all' shows everything. Options: 'backend', 'frontend', 'auth'. Default to 'all'."),
      highlightImportant: z
        .boolean()
        .optional()
        .default(true)
        .describe("If true, highlight important files with a star icon."),
      title: z
        .string()
        .optional()
        .default("FOLDER STRUCTURE")
        .describe("A short comic-style title, e.g. 'FOLDER STRUCTURE!' or 'BACKEND FILES!'"),
    }),
  },
  {
    name: "FlowDiagram",
    description:
      "Shows a visual flow diagram of the authentication flow. Use ONLY when user asks about 'auth flow', 'how does authentication work', 'login flow', 'how does login work'. Shows steps from Login Form → API → DB → JWT → Dashboard.",
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
    name: "FileSummary",
    description:
      "Explains a specific file in the codebase — its purpose, role, and importance. Use when the user asks about a specific file.",
    component: FileSummary,
    propsSchema: z.object({
      filename: z
        .string()
        .optional()
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

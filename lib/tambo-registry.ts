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
      "Shows high-level architecture overview of the codebase as module cards. Use when user asks to 'explain this project', 'high level overview', 'what does this codebase do', or 'show me the architecture'. Each card shows a module name, description, key files, and dependencies.",
    component: ModuleCards,
    propsSchema: z.object({
      filter: z
        .string()
        .describe("Which modules to show. Use 'all' by default. Options: 'all', 'backend', 'frontend', 'auth', 'database', 'services'. If unsure, use 'all'."),
      title: z
        .string()
        .describe("A short comic-style title for the section, e.g. 'PROJECT OVERVIEW!' or 'BACKEND MODULES!'"),
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
        .describe("Which part of the tree to show. 'all' shows everything. Options: 'backend', 'frontend', 'auth'. Default to 'all'."),
      highlightImportant: z
        .boolean()
        .describe("If true, highlight important files with a star icon."),
      title: z
        .string()
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
        .describe("A comic-style title, e.g. 'AUTH FLOW!' or 'LOGIN SEQUENCE!'"),
    }),
  },
  {
    name: "FileSummary",
    description:
      "Shows detailed information about a specific file — its role, importance, and what it does. Use when user asks about a specific file like 'what does login.ts do' or 'explain authMiddleware'.",
    component: FileSummary,
    propsSchema: z.object({
      filename: z
        .string()
        .describe("The filename to explain, e.g. 'login.ts', 'authMiddleware.ts', 'routes.ts', 'prismaClient.ts', 'Dashboard.tsx', 'tokenService.ts'"),
      title: z
        .string()
        .describe("A comic-style title, e.g. 'FILE BREAKDOWN!' or 'INSIDE login.ts!'"),
    }),
  },
  {
    name: "GuidanceCard",
    description:
      "Shows a helpful guidance message or suggestion. Use as a fallback when the query doesn't match other components, or to provide tips. Also use for greetings.",
    component: GuidanceCard,
    propsSchema: z.object({
      message: z
        .string()
        .describe("The guidance message to display"),
      suggestions: z
        .array(z.string())
        .describe("Suggested follow-up queries the user can try, e.g. ['Explain this project', 'Show folder structure', 'Auth flow']"),
    }),
  },
];

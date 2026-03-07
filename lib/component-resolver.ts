/**
 * Component Resolver — Gemini Function Calling definitions
 * that map to existing visualization components.
 *
 * These are used in the chat route so Gemini can decide to render
 * a visualization component in response to a user question.
 */

import { Type } from "@google/genai";

export const COMPONENT_TOOLS = [
    {
        functionDeclarations: [
            {
                name: "render_project_graph",
                description:
                    "Render an interactive architecture graph of the project. Use when the user asks to 'visualize architecture', 'show project graph', 'dependency map', 'show modules', or 'map the codebase'. Generate nodes for key architectural components and edges for real dependency relationships.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "Graph title, e.g. 'PROJECT MAP', 'ARCHITECTURE DIAGRAM'",
                        },
                        nodes: {
                            type: Type.ARRAY,
                            description: "6-20 nodes representing architectural components",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING, description: "Unique snake_case identifier" },
                                    label: { type: Type.STRING, description: "Short display label" },
                                    type: {
                                        type: Type.STRING,
                                        description:
                                            "One of: frontend, backend, database, api, config, tests, entry, utils, services, routes, controllers, middleware, data, external",
                                    },
                                    description: { type: Type.STRING, description: "Brief description" },
                                    importance: {
                                        type: Type.STRING,
                                        description: "high, medium, or low",
                                    },
                                },
                                required: ["id", "label", "type"],
                            },
                        },
                        edges: {
                            type: Type.ARRAY,
                            description: "Connections between nodes",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING, description: "Unique edge id" },
                                    source: { type: Type.STRING, description: "Source node id" },
                                    target: { type: Type.STRING, description: "Target node id" },
                                    label: { type: Type.STRING, description: "Relationship label" },
                                    type: {
                                        type: Type.STRING,
                                        description: "import, data-flow, api-call, or dependency",
                                    },
                                },
                                required: ["id", "source", "target"],
                            },
                        },
                    },
                    required: ["title", "nodes", "edges"],
                },
            },
            {
                name: "render_code_flow",
                description:
                    "Render a code flow diagram showing how data/requests move through the system. Use when the user asks about 'flow', 'lifecycle', 'trace', 'sequence', 'pipeline', 'how does X work', or 'show the flow for X'. ALWAYS generate 2-4 columns with actual code snippets.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "Diagram title, e.g. 'AUTH FLOW', 'REQUEST LIFECYCLE'",
                        },
                        columns: {
                            type: Type.ARRAY,
                            description: "2-4 columns representing stages of the flow",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING, description: "Stage name" },
                                    color: { type: Type.STRING, description: "Hex color for the header" },
                                    blocks: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                id: { type: Type.STRING },
                                                label: { type: Type.STRING, description: "Function/component name" },
                                                code: { type: Type.STRING, description: "Actual code snippet" },
                                                description: { type: Type.STRING, description: "What this block does" },
                                            },
                                            required: ["id", "label", "code"],
                                        },
                                    },
                                },
                                required: ["title", "color", "blocks"],
                            },
                        },
                        connections: {
                            type: Type.ARRAY,
                            description: "Arrows connecting blocks",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    from: { type: Type.STRING },
                                    to: { type: Type.STRING },
                                    label: { type: Type.STRING },
                                },
                                required: ["from", "to"],
                            },
                        },
                    },
                    required: ["title", "columns"],
                },
            },
            {
                name: "render_module_cards",
                description:
                    "Show a high-level architecture overview as module cards. Use when the user asks to 'explain the project', 'show overview', 'what does this codebase do', or 'architecture overview'.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Section title" },
                        filter: {
                            type: Type.STRING,
                            description: "all, frontend, backend, database, config, or tests",
                        },
                    },
                    required: ["title"],
                },
            },
            {
                name: "render_tree_view",
                description:
                    "Show the folder/file structure as a collapsible tree. Use when the user asks about 'folder structure', 'show files', 'file tree', or 'project structure'.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Section title" },
                        filter: { type: Type.STRING, description: "all or specific filter" },
                    },
                    required: ["title"],
                },
            },
            {
                name: "render_file_summary",
                description:
                    "Show a detailed summary of a specific file. Use when the user asks about a specific file, like 'explain auth.ts' or 'what does server.js do'.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        filename: { type: Type.STRING, description: "The filename" },
                        title: { type: Type.STRING, description: "Comic-style title" },
                        role: { type: Type.STRING, description: "Role of the file" },
                        description: {
                            type: Type.STRING,
                            description: "Detailed explanation of what the file does",
                        },
                        importance: {
                            type: Type.STRING,
                            description: "Critical, High, Medium, or Low",
                        },
                    },
                    required: ["filename", "title", "role", "description", "importance"],
                },
            },
            {
                name: "render_table",
                description:
                    "Display structured data in a table. Use when the user asks for a 'table', 'list', 'comparison', or structured data display.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        columns: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    header: { type: Type.STRING },
                                    width: { type: Type.STRING },
                                    align: { type: Type.STRING },
                                },
                                required: ["header"],
                            },
                        },
                        rows: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    values: { type: Type.ARRAY, items: { type: Type.STRING } },
                                },
                                required: ["values"],
                            },
                        },
                    },
                    required: ["title", "columns", "rows"],
                },
            },
        ],
    },
];

/**
 * Maps a Gemini function call name to the React component name
 * used in the InfiniteCanvas rendering system.
 */
export const FUNCTION_TO_COMPONENT: Record<string, string> = {
    render_project_graph: "ProjectGraph",
    render_code_flow: "CodeFlowGraph",
    render_module_cards: "ModuleCards",
    render_tree_view: "TreeView",
    render_file_summary: "FileSummary",
    render_table: "GenerativeTable",
};

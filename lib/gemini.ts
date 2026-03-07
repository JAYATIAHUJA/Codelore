import { GoogleGenAI, Type } from "@google/genai";

// ─── Client ───────────────────────────────────────────────────────────────────
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// gemini-2.5-flash: fast, capable, generous free tier
// Switch to "gemini-2.5-pro" for deeper analysis if you have a paid plan
export const GEMINI_MODEL = "gemini-2.5-flash";

// ─── Schemas ──────────────────────────────────────────────────────────────────
// These structured-output schemas match existing component props exactly.

export const MODULE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        files: { type: Type.ARRAY, items: { type: Type.STRING } },
        dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
        color: { type: Type.STRING },
        type: { type: Type.STRING },
    },
    required: ["name", "description", "files", "dependencies", "color", "type"],
} as const;

export const GRAPH_NODE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        label: { type: Type.STRING },
        type: { type: Type.STRING },
        description: { type: Type.STRING },
        importance: { type: Type.STRING },
    },
    required: ["id", "label", "type"],
} as const;

export const GRAPH_EDGE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        source: { type: Type.STRING },
        target: { type: Type.STRING },
        label: { type: Type.STRING },
        type: { type: Type.STRING },
    },
    required: ["id", "source", "target"],
} as const;

export const REPO_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        modules: { type: Type.ARRAY, items: MODULE_SCHEMA },
        graph: {
            type: Type.OBJECT,
            properties: {
                nodes: { type: Type.ARRAY, items: GRAPH_NODE_SCHEMA },
                edges: { type: Type.ARRAY, items: GRAPH_EDGE_SCHEMA },
            },
            required: ["nodes", "edges"],
        },
        summary: { type: Type.STRING },
        techStack: {
            type: Type.OBJECT,
            properties: {
                languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
                databases: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["languages", "frameworks"],
        },
    },
    required: ["modules", "graph", "summary", "techStack"],
} as const;

// ─── System Prompts ───────────────────────────────────────────────────────────

export const ANALYSIS_SYSTEM_PROMPT = `You are CodeLore, an expert code architecture analyzer. You receive a DEEP index of a GitHub repository — including full source code for key files, import graphs, and the file tree — and you produce a structured architectural analysis.

Your analysis must include:
1. **Modules**: Distinct logical modules in the codebase (frontend, backend, database, config, tests, etc.) with real file paths and accurate dependency relationships between modules.
2. **Architecture Graph**: Nodes representing key architectural components and edges representing real dependencies (imports, API calls, data flow). Use these node types: frontend, backend, database, api, config, tests, entry, utils, services, routes, controllers, middleware, data, external.
3. **Summary**: A concise technical summary of the project architecture.
4. **Tech Stack**: Languages, frameworks, databases, and tools detected from actual code — not just file names.

Rules:
- Use REAL file paths from the provided index — never invent file paths.
- Identify dependencies by analyzing actual import statements in the source code.
- Generate 6-20 graph nodes and meaningful edges between them.
- Module colors should be hex codes. Use: frontend=#61dafb, backend=#4caf50, database=#336791, config=#ff9500, tests=#22c55e, docs=#9e9e9e, api=#fbbf24, utils=#a855f7.
- Module types must be one of: frontend, backend, database, config, tests, docs.
- Graph edge types must be one of: import, data-flow, api-call, dependency.`;

export const CHAT_SYSTEM_PROMPT = `You are CodeLore, an AI assistant that helps developers understand codebases. You have deep knowledge about a specific repository provided in the context.

You can answer questions about:
- Architecture and design patterns
- How specific features work (data flow, request lifecycle, etc.)
- File purposes and relationships
- Technology choices and dependencies
- Code quality and potential improvements

When a user asks about visual topics like "show/visualize the architecture", "how does X flow work", "show the project graph", etc., you should use function calling to render the appropriate visualization component. Otherwise, respond with detailed text analysis.

Rules:
- Always reference real file paths and function names from the provided context.
- Be thorough and specific — reference actual code when possible.
- When rendering visualizations, populate ALL required fields with real data from the codebase.
- For CodeFlowGraph, always generate 2-4 columns with actual code snippets.
- For ProjectGraph, generate nodes with proper types and meaningful edges.`;

// ─── API Helpers ──────────────────────────────────────────────────────────────

export interface AnalysisResult {
    modules: {
        name: string;
        description: string;
        files: string[];
        dependencies: string[];
        color: string;
        type: string;
    }[];
    graph: {
        nodes: {
            id: string;
            label: string;
            type: string;
            description?: string;
            importance?: string;
        }[];
        edges: {
            id: string;
            source: string;
            target: string;
            label?: string;
            type?: string;
        }[];
    };
    summary: string;
    techStack: {
        languages: string[];
        frameworks: string[];
        databases?: string[];
        tools?: string[];
    };
}

export async function analyzeRepoWithGemini(
    repoIndex: string,
    repoMeta: { owner: string; name: string; description?: string }
): Promise<AnalysisResult> {
    const response = await genai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `Analyze this repository: ${repoMeta.owner}/${repoMeta.name}${repoMeta.description ? ` — ${repoMeta.description}` : ""}\n\nHere is the deep index:\n\n${repoIndex}`,
                    },
                ],
            },
        ],
        config: {
            systemInstruction: ANALYSIS_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: REPO_ANALYSIS_SCHEMA,
            temperature: 0.2,
        },
    });

    const text = response.text || "{}";
    return JSON.parse(text) as AnalysisResult;
}

export async function* chatWithGemini(
    messages: { role: "user" | "model"; text: string }[],
    repoContext: string,
    tools: any[]
) {
    const contents = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
    }));

    const response = await genai.models.generateContentStream({
        model: GEMINI_MODEL,
        contents,
        config: {
            systemInstruction: `${CHAT_SYSTEM_PROMPT}\n\n## Repository Context\n${repoContext}`,
            temperature: 0.4,
            tools,
        },
    });

    for await (const chunk of response) {
        yield chunk;
    }
}

export { genai };

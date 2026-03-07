import { buildGitHubHeaders, getGitHubToken } from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RepoIndex {
    owner: string;
    name: string;
    description: string;
    branch: string;
    stars: number;
    url: string;
    language: string;
    readme: string | null;
    fileTree: string;
    totalFiles: number;
    totalDirs: number;
    /** Actual source code of key files (entry points, configs, core modules) */
    sourceFiles: { path: string; content: string }[];
    /** Import/dependency relationships extracted from source */
    importGraph: { from: string; imports: string[] }[];
    /** Dependency manifest contents (package.json, requirements.txt, etc.) */
    manifests: { path: string; content: string }[];
    /** Detected tech stack from file analysis */
    detectedStack: {
        languages: string[];
        frameworks: string[];
    };
}

interface TreeItem {
    path: string;
    type: "blob" | "tree";
    size?: number;
}

// ─── Priority patterns for source file selection ──────────────────────────────

const ENTRY_POINT_PATTERNS = [
    /^src\/(index|main|app)\.(ts|tsx|js|jsx)$/,
    /^(index|main|app|server)\.(ts|tsx|js|jsx|py|go|rs)$/,
    /^lib\/main\.dart$/,
    /^src\/main\.(py|go|rs)$/,
    /^app\/(layout|page)\.(ts|tsx|js|jsx)$/,
    /^app\/api\/.*\/route\.(ts|js)$/,
    /^pages\/(_app|index|api\/.*)\.(ts|tsx|js|jsx)$/,
];

const CORE_DIR_PATTERNS = [
    /^src\//,
    /^lib\//,
    /^app\//,
    /^components\//,
    /^pages\//,
    /^services\//,
    /^utils\//,
    /^hooks\//,
    /^middleware\//,
    /^routes\//,
    /^controllers\//,
    /^models\//,
    /^api\//,
];

const CONFIG_PATTERNS = [
    "package.json",
    "tsconfig.json",
    "requirements.txt",
    "pyproject.toml",
    "Cargo.toml",
    "go.mod",
    "pubspec.yaml",
    "Gemfile",
    "build.gradle",
    "pom.xml",
    "composer.json",
    "next.config.ts",
    "next.config.js",
    "next.config.mjs",
    "vite.config.ts",
    "vite.config.js",
    "webpack.config.js",
    "docker-compose.yml",
    "Dockerfile",
    ".env.example",
];

const SOURCE_EXTENSIONS = new Set([
    "ts", "tsx", "js", "jsx", "py", "go", "rs", "java", "cs",
    "rb", "php", "swift", "kt", "dart", "vue", "svelte",
]);

const SKIP_DIRS = new Set([
    "node_modules", ".git", ".next", "dist", "build", "__pycache__",
    "vendor", ".gradle", "target", ".dart_tool", ".pub-cache",
    "coverage", ".nyc_output", ".cache", "tmp",
]);

// ─── Main Indexer ─────────────────────────────────────────────────────────────

export async function buildRepoIndex(
    owner: string,
    repo: string
): Promise<RepoIndex | null> {
    const token = await getGitHubToken();
    const headers = buildGitHubHeaders(token);

    console.log(`[RepoIndexer] Indexing ${owner}/${repo} (auth: ${token ? 'yes' : 'no'})`);

    // 1. Fetch repo metadata
    const metaRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        { headers }
    );
    if (!metaRes.ok) {
        console.error(`[RepoIndexer] Failed to fetch repo metadata: ${metaRes.status} ${metaRes.statusText}`);
        const body = await metaRes.text().catch(() => '');
        console.error(`[RepoIndexer] Response: ${body.slice(0, 500)}`);
        return null;
    }
    const meta = await metaRes.json();
    const branch = meta.default_branch;
    console.log(`[RepoIndexer] Repo found: ${meta.full_name}, branch: ${branch}`);

    // 2. Fetch file tree
    const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        { headers }
    );
    if (!treeRes.ok) {
        console.error(`[RepoIndexer] Failed to fetch file tree: ${treeRes.status} ${treeRes.statusText}`);
        return null;
    }
    const treeData = await treeRes.json();

    const allItems: TreeItem[] = (treeData.tree || [])
        .filter((item: any) => !isSkipped(item.path))
        .map((item: any) => ({
            path: item.path,
            type: item.type === "tree" ? "tree" : "blob",
            size: item.size,
        }));

    const blobs = allItems.filter((i) => i.type === "blob");
    const dirs = allItems.filter((i) => i.type === "tree");

    // 3. Select key files to fetch content for
    // Use fewer files when unauthenticated to stay within rate limits
    const maxFiles = token ? 35 : 15;
    const filesToFetch = selectKeyFiles(blobs, maxFiles);
    console.log(`[RepoIndexer] ${blobs.length} files found, fetching ${filesToFetch.length} key files`);

    // 4. Fetch contents in parallel (batches of 5 to avoid rate limits)
    const sourceFiles: { path: string; content: string }[] = [];
    const manifests: { path: string; content: string }[] = [];

    const batches = chunkArray(filesToFetch, 5);
    for (const batch of batches) {
        const results = await Promise.allSettled(
            batch.map((f) => fetchFileContent(owner, repo, f.path, branch, headers))
        );

        results.forEach((result, i) => {
            if (result.status === "fulfilled" && result.value) {
                const file = { path: batch[i].path, content: result.value };
                if (batch[i].isConfig) {
                    manifests.push(file);
                } else {
                    sourceFiles.push(file);
                }
            }
        });
    }

    // 5. Build import graph from source files
    const importGraph = buildImportGraph(sourceFiles);

    // 6. Build file tree string
    const fileTree = buildTreeString(allItems);
    console.log(`[RepoIndexer] Indexed ${sourceFiles.length} source files, ${manifests.length} manifests, ${importGraph.length} import entries`);

    // 7. Fetch README
    const readme = await fetchReadme(owner, repo, headers);

    // 8. Detect stack from files
    const detectedStack = detectStack(blobs);

    return {
        owner,
        name: meta.name,
        description: meta.description || "",
        branch,
        stars: meta.stargazers_count,
        url: meta.html_url,
        language: meta.language || "",
        readme,
        fileTree,
        totalFiles: blobs.length,
        totalDirs: dirs.length,
        sourceFiles,
        importGraph,
        manifests,
        detectedStack,
    };
}

// ─── File Selection ───────────────────────────────────────────────────────────

interface FileToFetch {
    path: string;
    priority: number;
    isConfig: boolean;
}

function selectKeyFiles(
    blobs: TreeItem[],
    maxFiles: number = 35
): FileToFetch[] {
    const scored: FileToFetch[] = [];

    for (const blob of blobs) {
        const ext = getExtension(blob.path);

        // Skip huge files (> 100KB) and binary files
        if (blob.size && blob.size > 100_000) continue;
        if (!ext || !isTextFile(ext)) continue;

        let priority = 0;
        let isConfig = false;

        // Config/manifests: highest priority
        if (CONFIG_PATTERNS.some((p) => blob.path === p || blob.path.endsWith("/" + p))) {
            priority = 100;
            isConfig = true;
        }
        // Entry points: very high priority
        else if (ENTRY_POINT_PATTERNS.some((rx) => rx.test(blob.path))) {
            priority = 90;
        }
        // Core source files: high priority
        else if (CORE_DIR_PATTERNS.some((rx) => rx.test(blob.path)) && SOURCE_EXTENSIONS.has(ext)) {
            // Prefer shallower files and smaller files
            const depth = blob.path.split("/").length;
            const sizeScore = blob.size ? Math.max(0, 10 - blob.size / 5000) : 5;
            priority = 60 - depth * 3 + sizeScore;
        }
        // Other source files
        else if (SOURCE_EXTENSIONS.has(ext)) {
            priority = 20;
        }

        if (priority > 0) {
            scored.push({ path: blob.path, priority, isConfig });
        }
    }

    // Sort by priority desc, take top N
    scored.sort((a, b) => b.priority - a.priority);
    return scored.slice(0, maxFiles);
}

// ─── Import Graph ─────────────────────────────────────────────────────────────

function buildImportGraph(
    files: { path: string; content: string }[]
): { from: string; imports: string[] }[] {
    const graph: { from: string; imports: string[] }[] = [];

    for (const file of files) {
        const imports = extractImports(file.content, file.path);
        if (imports.length > 0) {
            graph.push({ from: file.path, imports });
        }
    }

    return graph;
}

function extractImports(content: string, filePath: string): string[] {
    const imports: string[] = [];
    const ext = getExtension(filePath);

    // JS/TS imports
    if (["ts", "tsx", "js", "jsx", "mjs"].includes(ext || "")) {
        // import ... from "..."
        const esm = content.matchAll(/(?:import|export)\s+.*?from\s+['"](.+?)['"]/g);
        for (const m of esm) imports.push(m[1]);

        // require("...")
        const cjs = content.matchAll(/require\s*\(\s*['"](.+?)['"]\s*\)/g);
        for (const m of cjs) imports.push(m[1]);
    }

    // Python imports
    if (ext === "py") {
        const pyImports = content.matchAll(/(?:from\s+(\S+)\s+import|import\s+(\S+))/g);
        for (const m of pyImports) imports.push(m[1] || m[2]);
    }

    // Go imports
    if (ext === "go") {
        const goImports = content.matchAll(/["']([^"']+)["']/g);
        for (const m of goImports) {
            if (m[1].includes("/")) imports.push(m[1]);
        }
    }

    return [...new Set(imports)];
}

// ─── GitHub API Helpers ───────────────────────────────────────────────────────

async function fetchFileContent(
    owner: string,
    repo: string,
    path: string,
    branch: string,
    headers: HeadersInit
): Promise<string | null> {
    try {
        const res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
            { headers }
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (data.content && data.encoding === "base64") {
            return Buffer.from(data.content, "base64")
                .toString("utf-8")
                .slice(0, 8000); // Cap at 8KB per file
        }
        return null;
    } catch {
        return null;
    }
}

async function fetchReadme(
    owner: string,
    repo: string,
    headers: HeadersInit
): Promise<string | null> {
    try {
        const res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/readme`,
            { headers }
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (data.content && data.encoding === "base64") {
            return Buffer.from(data.content, "base64")
                .toString("utf-8")
                .slice(0, 5000);
        }
        return null;
    } catch {
        return null;
    }
}

// ─── Tree Builder ─────────────────────────────────────────────────────────────

function buildTreeString(items: TreeItem[]): string {
    const tree: Record<string, any> = {};

    for (const item of items.slice(0, 500)) {
        const parts = item.path.split("/");
        let current = tree;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1 && item.type === "blob") {
                current[part] = null;
            } else {
                if (!current[part] || current[part] === null) current[part] = {};
                current = current[part];
            }
        }
    }

    function render(node: Record<string, any>, prefix = ""): string {
        const keys = Object.keys(node).sort((a, b) => {
            const aDir = node[a] !== null;
            const bDir = node[b] !== null;
            if (aDir !== bDir) return aDir ? -1 : 1;
            return a.localeCompare(b);
        });

        let result = "";
        keys.forEach((key, i) => {
            const isLast = i === keys.length - 1;
            result += prefix + (isLast ? "└── " : "├── ") + key + "\n";
            if (node[key] !== null && typeof node[key] === "object") {
                result += render(node[key], prefix + (isLast ? "    " : "│   "));
            }
        });
        return result;
    }

    return render(tree);
}

// ─── Stack Detection ──────────────────────────────────────────────────────────

function detectStack(blobs: TreeItem[]) {
    const paths = blobs.map((b) => b.path);

    const langMap: Record<string, string> = {
        ts: "TypeScript", tsx: "TypeScript", js: "JavaScript", jsx: "JavaScript",
        py: "Python", go: "Go", rs: "Rust", java: "Java", cs: "C#",
        rb: "Ruby", php: "PHP", swift: "Swift", kt: "Kotlin", dart: "Dart",
        vue: "Vue", svelte: "Svelte", cpp: "C++", c: "C",
    };

    const languages = new Set<string>();
    for (const b of blobs) {
        const ext = getExtension(b.path);
        if (ext && langMap[ext]) languages.add(langMap[ext]);
    }

    const frameworks: string[] = [];
    if (paths.some((p) => p.includes("next.config"))) frameworks.push("Next.js");
    if (paths.some((p) => p.includes("nuxt.config"))) frameworks.push("Nuxt.js");
    if (paths.some((p) => p.includes("angular.json"))) frameworks.push("Angular");
    if (paths.some((p) => p.includes("vue.config") || p.endsWith(".vue"))) frameworks.push("Vue.js");
    if (paths.some((p) => p.includes("svelte.config"))) frameworks.push("Svelte");
    if (paths.some((p) => p.includes("remix.config"))) frameworks.push("Remix");
    if (paths.some((p) => p.includes("vite.config"))) frameworks.push("Vite");
    if (paths.some((p) => p === "manage.py" || p.includes("django"))) frameworks.push("Django");
    if (paths.some((p) => p.includes("flask"))) frameworks.push("Flask");
    if (paths.some((p) => p.includes("fastapi"))) frameworks.push("FastAPI");
    if (paths.some((p) => p.includes("spring"))) frameworks.push("Spring Boot");
    if (paths.some((p) => p === "pubspec.yaml")) frameworks.push("Flutter");
    if (paths.some((p) => p.endsWith(".tsx") || p.endsWith(".jsx"))) {
        if (!frameworks.includes("Next.js")) frameworks.push("React");
    }

    return { languages: [...languages], frameworks };
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function isSkipped(path: string): boolean {
    const first = path.split("/")[0];
    return SKIP_DIRS.has(first) || path.startsWith(".");
}

function getExtension(path: string): string | null {
    const parts = path.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : null;
}

function isTextFile(ext: string): boolean {
    const textExts = new Set([
        ...SOURCE_EXTENSIONS,
        "json", "yaml", "yml", "toml", "xml", "md", "txt", "css", "scss",
        "html", "sql", "graphql", "proto", "dockerfile", "sh", "bash",
        "env", "config", "cfg", "ini", "lock", "mod", "sum", "gradle",
        "properties", "mjs", "cjs",
    ]);
    return textExts.has(ext);
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

// ─── Serializer ───────────────────────────────────────────────────────────────

/** Serialize a RepoIndex into a text prompt for Gemini */
export function serializeRepoIndex(index: RepoIndex): string {
    const sections: string[] = [];

    sections.push(`# Repository: ${index.owner}/${index.name}`);
    if (index.description) sections.push(`> ${index.description}`);
    sections.push(`Branch: ${index.branch} | Stars: ${index.stars} | Language: ${index.language}`);
    sections.push(`Files: ${index.totalFiles} | Directories: ${index.totalDirs}`);

    if (index.detectedStack.languages.length) {
        sections.push(`\n## Detected Stack\nLanguages: ${index.detectedStack.languages.join(", ")}`);
        if (index.detectedStack.frameworks.length) {
            sections.push(`Frameworks: ${index.detectedStack.frameworks.join(", ")}`);
        }
    }

    sections.push(`\n## File Tree\n\`\`\`\n${index.fileTree}\`\`\``);

    if (index.manifests.length) {
        sections.push("\n## Dependency Manifests");
        for (const m of index.manifests) {
            sections.push(`### ${m.path}\n\`\`\`\n${m.content}\n\`\`\``);
        }
    }

    if (index.sourceFiles.length) {
        sections.push("\n## Source Code (Key Files)");
        for (const f of index.sourceFiles) {
            const ext = getExtension(f.path) || "";
            sections.push(`### ${f.path}\n\`\`\`${ext}\n${f.content}\n\`\`\``);
        }
    }

    if (index.importGraph.length) {
        sections.push("\n## Import Graph");
        for (const entry of index.importGraph) {
            sections.push(`- ${entry.from} → [${entry.imports.join(", ")}]`);
        }
    }

    if (index.readme) {
        sections.push(`\n## README\n${index.readme}`);
    }

    return sections.join("\n");
}

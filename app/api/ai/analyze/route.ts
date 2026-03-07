import { NextRequest, NextResponse } from "next/server";
import { buildRepoIndex, serializeRepoIndex } from "@/lib/repo-indexer";
import { analyzeRepoWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 });
        }

        const match = url.match(/github\.com\/([^/]+)\/([^/\s#?]+)/);
        if (!match) {
            return NextResponse.json(
                { error: "Invalid GitHub URL" },
                { status: 400 }
            );
        }

        const owner = match[1];
        const repoName = match[2].replace(/\.git$/, "").replace(/\/$/, "");

        // 1. Deep-index the repository (fetches source code, imports, etc.)
        const repoIndex = await buildRepoIndex(owner, repoName);
        if (!repoIndex) {
            return NextResponse.json(
                { error: "Could not access repository. Check the URL and permissions." },
                { status: 404 }
            );
        }

        // 2. Serialize index for Gemini
        const indexText = serializeRepoIndex(repoIndex);

        // 3. Analyze with Gemini — structured output
        const analysis = await analyzeRepoWithGemini(indexText, {
            owner,
            name: repoName,
            description: repoIndex.description,
        });

        // 4. Build response matching RepoData interface
        const files = buildFilesList(repoIndex.fileTree);

        return NextResponse.json({
            repo: {
                name: repoIndex.name,
                owner: repoIndex.owner,
                branch: repoIndex.branch,
                description: repoIndex.description,
                stars: repoIndex.stars,
                url: repoIndex.url,
                language: repoIndex.language,
                readme: repoIndex.readme,
            },
            files,
            modules: analysis.modules.map((m) => ({
                ...m,
                type: validateModuleType(m.type),
            })),
            stats: {
                totalFiles: repoIndex.totalFiles,
                totalFolders: repoIndex.totalDirs,
                languages: analysis.techStack.languages,
                frameworks: analysis.techStack.frameworks,
            },
            // Extra data for chat context
            analysis: {
                graph: analysis.graph,
                summary: analysis.summary,
                techStack: analysis.techStack,
            },
            // Serialized index for chat context (trimmed)
            repoContext: indexText.slice(0, 100_000),
        });
    } catch (error: any) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json(
            { error: error.message || "Analysis failed" },
            { status: 500 }
        );
    }
}

// Build flat files list from the tree string
function buildFilesList(
    fileTree: string
): { path: string; type: "file" | "directory"; size: number }[] {
    // Parse the tree string to extract file paths
    const files: { path: string; type: "file" | "directory"; size: number }[] = [];
    const lines = fileTree.split("\n");
    const pathStack: string[] = [];

    for (const line of lines) {
        if (!line.trim()) continue;

        // Count depth by looking at tree characters
        const stripped = line.replace(/[│├└──\s]/g, "").trim();
        if (!stripped) continue;

        // Determine depth from indentation
        const indent = line.search(/[├└]/);
        const depth = indent >= 0 ? Math.floor(indent / 4) : 0;

        // Trim path stack to current depth
        pathStack.length = depth;
        pathStack.push(stripped);

        const fullPath = pathStack.join("/");

        // Directory entries in the tree are followed by children
        // but we check if the next line has deeper indentation
        // For now, treat entries without extensions as directories
        const hasExtension = stripped.includes(".");
        files.push({
            path: fullPath,
            type: hasExtension ? "file" : "directory",
            size: 0,
        });
    }

    return files;
}

function validateModuleType(
    type: string
): "frontend" | "backend" | "database" | "config" | "tests" | "docs" {
    const valid = ["frontend", "backend", "database", "config", "tests", "docs"];
    return valid.includes(type)
        ? (type as "frontend" | "backend" | "database" | "config" | "tests" | "docs")
        : "backend";
}

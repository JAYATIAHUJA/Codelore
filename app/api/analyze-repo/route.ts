import { NextRequest, NextResponse } from "next/server";
import {
  fetchRepoStructure,
  fetchKeyFileContent,
} from "@/lib/github-repo-analyzer";

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();
    if (!repoUrl) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/\s#?]+)/);
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");

    const structure = await fetchRepoStructure(owner, repo);
    if (!structure) {
      return NextResponse.json(
        { error: "Could not fetch repo structure" },
        { status: 404 }
      );
    }

    // Fetch key dependency files for deeper understanding
    const depFiles = [
      "package.json",
      "pubspec.yaml",
      "Cargo.toml",
      "go.mod",
      "requirements.txt",
      "pyproject.toml",
    ];
    const keyFileContents: Record<string, string> = {};

    for (const depFile of depFiles) {
      const found = structure.configFiles.find(
        (f) => f === depFile || f.endsWith("/" + depFile)
      );
      if (found) {
        const content = await fetchKeyFileContent(owner, repo, found);
        if (content) keyFileContents[found] = content;
      }
    }

    return NextResponse.json({
      structure,
      keyFileContents,
    });
  } catch (error) {
    console.error("Analyze repo error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

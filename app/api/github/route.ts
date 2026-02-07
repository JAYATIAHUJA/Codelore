import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Parse GitHub URL: https://github.com/owner/repo
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL. Expected format: https://github.com/owner/repo" }, { status: 400 });
    }

    const owner = match[1];
    let repoName = match[2];
    // Remove trailing .git or trailing slash
    repoName = repoName.replace(/\.git$/, "").replace(/\/$/, "");

    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "CodeLore-App",
    };

    // Use GITHUB_TOKEN if available to increase rate limits
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch Repository Metadata (to get default branch and verify existence)
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!repoResponse.ok) {
      const errorData = await repoResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch repository info" },
        { status: repoResponse.status }
      );
    }

    const repoData = await repoResponse.json();
    const branch = repoData.default_branch;

    // 2. Fetch Recursive Tree
    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/${branch}?recursive=1`,
      { headers }
    );

    if (!treeResponse.ok) {
      const errorData = await treeResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch repository tree" },
        { status: treeResponse.status }
      );
    }

    const treeData = await treeResponse.json();

    // 3. Transform Data
    const files = treeData.tree.map((item: any) => ({
      path: item.path,
      type: item.type === "blob" ? "file" : "directory",
      size: item.size || 0,
    }));

    return NextResponse.json({
      repo: {
        name: repoData.name,
        owner: repoData.owner.login,
        branch: branch,
        description: repoData.description,
        stars: repoData.stargazers_count,
        url: repoData.html_url,
      },
      files,
      stats: {
        totalFiles: files.filter((f: any) => f.type === "file").length,
        totalFolders: files.filter((f: any) => f.type === "directory").length,
      }
    });

  } catch (err: any) {
    console.error("GitHub API Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

interface GitHubFile {
  path: string;
  type: "file" | "directory";
  size: number;
}

interface Module {
  name: string;
  description: string;
  files: string[];
  dependencies: string[];
  color: string;
  type: "frontend" | "backend" | "database" | "config" | "tests" | "docs";
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Parse GitHub URL
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const owner = match[1];
    let repoName = match[2].replace(/\.git$/, "").replace(/\/$/, "");

    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "CodeLore-App",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch repository metadata
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers,
      next: { revalidate: 3600 },
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

    // 2. Fetch repository tree
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

    // 3. Get package.json and other config files for better analysis
    const configFiles = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/package.json?ref=${branch}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/requirements.txt?ref=${branch}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/pom.xml?ref=${branch}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/Cargo.toml?ref=${branch}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/go.mod?ref=${branch}`, { headers }),
    ]);

    // 4. Transform files
    const files: GitHubFile[] = treeData.tree.map((item: any) => ({
      path: item.path,
      type: item.type === "blob" ? "file" : "directory",
      size: item.size || 0,
    }));

    // 5. Analyze repository structure
    const modules = analyzeRepoStructure(files, configFiles);

    return NextResponse.json({
      repo: {
        name: repoData.name,
        owner: repoData.owner.login,
        branch: branch,
        description: repoData.description,
        stars: repoData.stargazers_count,
        url: repoData.html_url,
        language: repoData.language,
      },
      files,
      modules,
      stats: {
        totalFiles: files.filter((f) => f.type === "file").length,
        totalFolders: files.filter((f) => f.type === "directory").length,
        languages: detectLanguages(files),
        frameworks: detectFrameworks(files),
      }
    });

  } catch (err: any) {
    console.error("GitHub Analysis Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function analyzeRepoStructure(files: GitHubFile[], fetchedConfigs: PromiseSettledResult<Response>[]): Module[] {
  const modules: Module[] = [];
  const filePaths = files.filter(f => f.type === "file").map(f => f.path);

  // Detect project type and framework
  const hasNextJs = filePaths.some(p => p.includes("next.config") || p.includes("app/layout.tsx"));
  const hasReact = filePaths.some(p => p.endsWith(".jsx") || p.endsWith(".tsx"));
  const hasNode = filePaths.includes("package.json");
  const hasExpress = filePaths.some(p => p.includes("server.") || p.includes("app.js"));
  const hasPython = filePaths.some(p => p.endsWith(".py"));
  const hasJava = filePaths.some(p => p.endsWith(".java"));
  const hasDotNet = filePaths.some(p => p.endsWith(".cs") || p.endsWith(".csproj"));

  // Frontend Module
  if (hasReact || hasNextJs) {
    const frontendFiles = filePaths.filter(p =>
      p.includes("components/") ||
      p.includes("pages/") ||
      p.includes("app/") ||
      p.endsWith(".tsx") ||
      p.endsWith(".jsx") ||
      p.includes("public/")
    );

    modules.push({
      name: hasNextJs ? "Next.js Frontend" : "React Frontend",
      description: hasNextJs
        ? "Next.js application with React components, pages, and routing"
        : "React application with components and client-side logic",
      files: frontendFiles.slice(0, 8),
      dependencies: hasNode ? ["Node.js Backend", "API Layer", "Routes"] : [],
      color: "#61dafb",
      type: "frontend"
    });
  }

  // Backend Analysis - Granular Breakdown
  if (hasNode && hasExpress) {
    // 1. Routes
    const routeFiles = filePaths.filter(p => p.includes("routes/") || p.includes("api/"));
    if (routeFiles.length > 0) {
      modules.push({
        name: "Routes",
        description: "API endpoints and route definitions",
        files: routeFiles.slice(0, 8),
        dependencies: ["Controllers", "Middleware"], // Logical flow
        color: "#4caf50",
        type: "backend"
      });
    }

    // 2. Controllers
    const controllerFiles = filePaths.filter(p => p.includes("controllers/"));
    if (controllerFiles.length > 0) {
      modules.push({
        name: "Controllers",
        description: "Request handlers and logic orchestration",
        files: controllerFiles.slice(0, 8),
        dependencies: ["Services"],
        color: "#8bc34a",
        type: "backend"
      });
    }

    // 3. Services
    const serviceFiles = filePaths.filter(p => p.includes("services/"));
    if (serviceFiles.length > 0) {
      modules.push({
        name: "Services",
        description: "Business logic and data processing",
        files: serviceFiles.slice(0, 8),
        dependencies: ["Database", "Utils"],
        color: "#cddc39",
        type: "backend"
      });
    }

    // 4. Middleware
    const middlewareFiles = filePaths.filter(p => p.includes("middleware/"));
    if (middlewareFiles.length > 0) {
      modules.push({
        name: "Middleware",
        description: "Request processing (auth, logging, validation)",
        files: middlewareFiles.slice(0, 8),
        dependencies: [],
        color: "#ffc107",
        type: "backend"
      });
    }

    // 5. Entry Point (Fallback for general backend files)
    const entryFiles = filePaths.filter(p =>
      p === "server.js" || p === "app.js" || p === "index.js" || p === "main.ts"
    );
    modules.push({
      name: "Entry Point",
      description: "Application entry point and server startup",
      files: entryFiles,
      dependencies: ["Routes", "Middleware", "Config"],
      color: "#607d8b",
      type: "backend"
    });
  } else if (hasPython) {
    const pythonFiles = filePaths.filter(p =>
      p.endsWith(".py") &&
      !p.includes("__pycache__") &&
      !p.includes("venv/")
    );

    modules.push({
      name: "Python Backend",
      description: "Python application with Flask/Django or FastAPI framework",
      files: pythonFiles.slice(0, 8),
      dependencies: ["Database"],
      color: "#3776ab",
      type: "backend"
    });
  } else if (hasJava) {
    const javaFiles = filePaths.filter(p => p.endsWith(".java"));

    modules.push({
      name: "Java Backend",
      description: "Java application with Spring Boot or other framework",
      files: javaFiles.slice(0, 8),
      dependencies: ["Database"],
      color: "#f89820",
      type: "backend"
    });
  }

  // Database Module
  const dbFiles = filePaths.filter(p =>
    p.includes("prisma/") ||
    p.includes("migrations/") ||
    p.includes("schema/") ||
    p.includes("models/") ||
    p.includes("database/") ||
    p.includes("entities/") ||
    p.includes(".sql")
  );

  if (dbFiles.length > 0) {
    modules.push({
      name: "Database",
      description: "Database schemas, migrations, and ORM configurations",
      files: dbFiles.slice(0, 8),
      dependencies: [],
      color: "#336791",
      type: "database"
    });
  }

  // Configuration Module
  const configPaths = filePaths.filter(p =>
    p.includes("config") ||
    p.endsWith(".config.js") ||
    p.endsWith(".config.ts") ||
    p === "package.json" ||
    p === "tsconfig.json" ||
    p === "next.config.js" ||
    p === "tailwind.config.js" ||
    p.startsWith(".env") ||
    p === "dockerfile" ||
    p === "docker-compose.yml"
  );

  if (configPaths.length > 0) {
    modules.push({
      name: "Config",
      description: "App configuration and environment settings",
      files: configPaths.slice(0, 8),
      dependencies: [],
      color: "#ff9500",
      type: "config"
    });
  }

  // Utils / Shared
  const utilFiles = filePaths.filter(p => p.includes("utils/") || p.includes("helpers/") || p.includes("lib/"));
  if (utilFiles.length > 0) {
    modules.push({
      name: "Utils",
      description: "Shared utility functions and helpers",
      files: utilFiles.slice(0, 8),
      dependencies: [],
      color: "#9e9e9e",
      type: "backend"
    });
  }

  // Tests
  const testFiles = filePaths.filter(p =>
    p.includes("test") ||
    p.includes("spec") ||
    p.includes("__tests__") ||
    p.endsWith(".test.js") ||
    p.endsWith(".test.ts") ||
    p.endsWith(".spec.js") ||
    p.endsWith(".spec.ts")
  );

  if (testFiles.length > 0) {
    modules.push({
      name: "Tests",
      description: "Test suites",
      files: testFiles.slice(0, 8),
      dependencies: ["Routes", "Services"],
      color: "#22c55e",
      type: "tests"
    });
  }

  return modules;
}

function detectLanguages(files: GitHubFile[]): string[] {
  const languageMap: Record<string, string> = {
    'js': 'JavaScript',
    'jsx': 'JavaScript',
    'ts': 'TypeScript',
    'tsx': 'TypeScript',
    'py': 'Python',
    'java': 'Java',
    'cs': 'C#',
    'go': 'Go',
    'rs': 'Rust',
    'cpp': 'C++',
    'c': 'C',
    'php': 'PHP',
    'rb': 'Ruby',
  };

  const languages = new Set<string>();

  files.forEach(file => {
    const ext = file.path.split('.').pop()?.toLowerCase();
    if (ext && languageMap[ext]) {
      languages.add(languageMap[ext]);
    }
  });

  return Array.from(languages);
}

function detectFrameworks(files: GitHubFile[]): string[] {
  const filePaths = files.map(f => f.path);
  const frameworks: string[] = [];

  if (filePaths.some(p => p.includes("next.config"))) frameworks.push("Next.js");
  if (filePaths.some(p => p.includes("nuxt.config"))) frameworks.push("Nuxt.js");
  if (filePaths.some(p => p.includes("angular.json"))) frameworks.push("Angular");
  if (filePaths.some(p => p.includes("vue.config"))) frameworks.push("Vue.js");
  if (filePaths.some(p => p.includes("svelte.config"))) frameworks.push("Svelte");
  if (filePaths.some(p => p.includes("remix.config"))) frameworks.push("Remix");

  // Backend frameworks
  if (filePaths.some(p => p.includes("express"))) frameworks.push("Express.js");
  if (filePaths.some(p => p.includes("fastify"))) frameworks.push("Fastify");
  if (filePaths.some(p => p.includes("django"))) frameworks.push("Django");
  if (filePaths.some(p => p.includes("flask"))) frameworks.push("Flask");
  if (filePaths.some(p => p.includes("spring"))) frameworks.push("Spring Boot");

  return frameworks;
}
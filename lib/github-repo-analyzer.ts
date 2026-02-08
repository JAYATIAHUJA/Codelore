export interface RepoFile {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

export interface RepoStructure {
  fileTree: string;
  directories: string[];
  topLevelEntries: string[];
  filesByExtension: Record<string, number>;
  entryPoints: string[];
  configFiles: string[];
  totalFiles: number;
  totalDirs: number;
}

export async function fetchRepoStructure(
  owner: string,
  repo: string
): Promise<RepoStructure | null> {
  // Try main, then master
  for (const branch of ["main", "master", "develop"]) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "codebase-app",
          },
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.tree && data.tree.length > 0) {
        return analyzeTree(data.tree);
      }
    } catch {
      continue;
    }
  }
  return null;
}

function analyzeTree(tree: any[]): RepoStructure {
  const files: RepoFile[] = tree
    .filter((item: any) => !item.path.startsWith(".git/"))
    .map((item: any) => ({
      path: item.path,
      type: item.type === "tree" ? "tree" : "blob",
      size: item.size,
    }));

  const blobs = files.filter((f) => f.type === "blob");
  const dirs = files.filter((f) => f.type === "tree");

  const topLevelEntries = files
    .filter((f) => !f.path.includes("/"))
    .map((f) => f.path + (f.type === "tree" ? "/" : ""));

  const topLevelDirs = dirs
    .filter((d) => !d.path.includes("/"))
    .map((d) => d.path);

  const filesByExtension: Record<string, number> = {};
  for (const f of blobs) {
    const ext = f.path.includes(".") ? "." + f.path.split(".").pop() : "(none)";
    filesByExtension[ext] = (filesByExtension[ext] || 0) + 1;
  }

  const configPatterns = [
    "package.json", "pubspec.yaml", "Cargo.toml", "go.mod",
    "requirements.txt", "pyproject.toml", "build.gradle", "pom.xml",
    "CMakeLists.txt", "Makefile", "docker-compose", "Dockerfile",
    "tsconfig.json", "vite.config", "next.config", "webpack.config",
    ".github/workflows",
  ];

  const configFiles = blobs
    .filter((f) => configPatterns.some((p) => f.path.toLowerCase().includes(p.toLowerCase())))
    .map((f) => f.path)
    .slice(0, 20);

  const entryPatterns = [
    "main.dart", "main.ts", "main.js", "main.go", "main.rs", "main.py",
    "index.ts", "index.js", "index.html", "App.tsx", "App.vue",
    "app.py", "server.ts", "server.js",
    "lib/main.dart", "src/main", "src/index", "src/app",
  ];

  const entryPoints = blobs
    .filter((f) => entryPatterns.some((p) => f.path.endsWith(p) || f.path.includes(p)))
    .map((f) => f.path)
    .slice(0, 10);

  // Build tree string (limit depth for large repos)
  const fileTree = buildTreeString(files.slice(0, 500));

  return {
    fileTree,
    directories: dirs.map((d) => d.path),
    topLevelEntries,
    filesByExtension,
    entryPoints,
    configFiles,
    totalFiles: blobs.length,
    totalDirs: dirs.length,
  };
}

function buildTreeString(files: RepoFile[]): string {
  const tree: Record<string, any> = {};
  for (const file of files) {
    const parts = file.path.split("/");
    let current = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1 && file.type === "blob") {
        current[part] = null;
      } else {
        if (!current[part] || current[part] === null) current[part] = {};
        current = current[part];
      }
    }
  }

  function render(node: Record<string, any>, prefix: string = ""): string {
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

export async function fetchKeyFileContent(
  owner: string,
  repo: string,
  filePath: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "codebase-app",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.content && data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8").slice(0, 3000);
    }
    return null;
  } catch {
    return null;
  }
}

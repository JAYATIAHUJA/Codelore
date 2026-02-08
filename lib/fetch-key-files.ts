const KEY_FILES = [
  "package.json",
  "Cargo.toml",
  "go.mod",
  "requirements.txt",
  "pyproject.toml",
  "Gemfile",
  "build.gradle",
  "pom.xml",
  "composer.json",
];

const KEY_CONFIG_FILES = [
  "tsconfig.json",
  "next.config.js",
  "next.config.ts",
  "next.config.mjs",
  "vite.config.ts",
  "vite.config.js",
  "webpack.config.js",
  "tailwind.config.js",
  "tailwind.config.ts",
];

export interface KeyFileContent {
  path: string;
  content: string;
}

/**
 * Fetches the content of key dependency/config files from the repo
 * to understand the project's technology stack and structure
 */
export async function fetchKeyFiles(
  owner: string,
  repo: string,
  availableFiles: string[]
): Promise<KeyFileContent[]> {
  const filesToFetch = [...KEY_FILES, ...KEY_CONFIG_FILES].filter((f) =>
    availableFiles.some(
      (af) => af === f || af.endsWith("/" + f)
    )
  );

  const results: KeyFileContent[] = [];

  // Fetch up to 5 key files to avoid rate limiting
  for (const filePath of filesToFetch.slice(0, 5)) {
    try {
      const matchedPath =
        availableFiles.find((af) => af === filePath || af.endsWith("/" + filePath)) ||
        filePath;

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${matchedPath}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "codebase-app",
          },
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      if (data.content && data.encoding === "base64") {
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        // Truncate large files
        results.push({
          path: matchedPath,
          content: content.slice(0, 3000),
        });
      }
    } catch {
      // Skip files that can't be fetched
    }
  }

  return results;
}

export function formatKeyFilesForPrompt(files: KeyFileContent[]): string {
  if (files.length === 0) return "";

  const sections = files.map(
    (f) => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``
  );

  return "## Key File Contents\n\n" + sections.join("\n\n");
}

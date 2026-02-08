"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTamboThreadInput } from "@tambo-ai/react";

interface RepoInputProps {
  threadId?: string;
}

export default function RepoInput({ threadId }: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { setValue: setInput, submit } = useTamboThreadInput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setIsLoading(true);

    try {
      // Step 1: Fetch README
      setStatus("Fetching README...");
      let readmeContent = "";
      try {
        const readmeRes = await fetch("/api/fetch-readme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl }),
        });
        if (readmeRes.ok) {
          const data = await readmeRes.json();
          readmeContent = data.content || "";
        }
      } catch {
        // README fetch failed, continue without it
      }

      // Step 2: Analyze actual repo structure
      setStatus("Analyzing repository file structure...");
      let structureInfo = "";
      try {
        const structRes = await fetch("/api/analyze-repo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl }),
        });
        if (structRes.ok) {
          const data = await structRes.json();
          const s = data.structure;

          structureInfo = `## ACTUAL FILE STRUCTURE (${s.totalFiles} files, ${s.totalDirs} directories)

### Top-level entries:
${s.topLevelEntries.join("\n")}

### File tree:
\`\`\`
${s.fileTree.slice(0, 6000)}
\`\`\`

### Entry points found:
${s.entryPoints.length > 0 ? s.entryPoints.join("\n") : "None detected"}

### Config/build files:
${s.configFiles.join("\n")}

### File types:
${Object.entries(s.filesByExtension as Record<string, number>)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 15)
              .map(([ext, count]) => `${ext}: ${count} files`)
              .join("\n")}`;

          // Add key file contents
          if (data.keyFileContents && Object.keys(data.keyFileContents).length > 0) {
            structureInfo += "\n\n### Key dependency files:\n";
            for (const [path, content] of Object.entries(data.keyFileContents)) {
              structureInfo += `\n#### ${path}:\n\`\`\`\n${(content as string).slice(0, 2000)}\n\`\`\`\n`;
            }
          }
        }
      } catch {
        // Structure fetch failed, continue with README only
      }

      // Step 3: Build the prompt
      setStatus("Generating graph...");

      const prompt = `Analyze this GitHub repository and generate a detailed knowledge graph showing its architecture.

Repository: ${repoUrl}

${structureInfo ? `=== REPOSITORY STRUCTURE (USE THIS AS PRIMARY SOURCE) ===
${structureInfo}
=== END STRUCTURE ===` : ""}

${readmeContent ? `=== README (supplementary info only) ===
${readmeContent.slice(0, 3000)}
=== END README ===` : ""}

CRITICAL INSTRUCTIONS:
1. Use the ACTUAL FILE STRUCTURE above to create nodes - analyze the directories and files, NOT just the README
2. Create a node for EACH major top-level directory (like src/, lib/, app/, test/, etc.)
3. Create nodes for important subdirectories that represent features/modules
4. Create nodes for entry points and key config files
5. Create edges showing containment (dir contains subdir), imports, dependencies, and data flow
6. Generate AT LEAST 10 nodes and 15 edges
7. EVERY node must have at least one edge connection
8. EVERY edge must reference node IDs that exist in your nodes array
9. Use descriptive group values: core, ui, data, config, service, entry, external, test, build
10. Make the graph actually represent the real architecture of this specific repository`;

      setInput(prompt);
      await submit();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-xl">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter GitHub repo URL (e.g., https://github.com/localsend/localsend)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !repoUrl}>
          {isLoading ? "Analyzing..." : "Visualize"}
        </Button>
      </div>
      {status && (
        <p className="text-sm text-muted-foreground animate-pulse">{status}</p>
      )}
    </form>
  );
}

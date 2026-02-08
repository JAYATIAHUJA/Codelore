import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: TreeNode[];
}

export function buildFileTree(files: { path: string; type: "file" | "directory" }[]): TreeNode[] {
  const root: TreeNode[] = [];
  const level: { [key: string]: TreeNode[] } = { "": root };

  // Sort files so folders come before files or at least alphabetical
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  sortedFiles.forEach((file) => {
    const parts = file.path.split("/");
    let currentPath = "";
    
    parts.forEach((part, index) => {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = index === parts.length - 1;

      if (!level[currentPath]) {
        const newNode: TreeNode = {
          name: part,
          path: currentPath,
          type: isLast ? file.type : "directory",
          children: isLast && file.type === "file" ? undefined : [],
        };
        
        // Ensure parent exists in level map
        if (!level[parentPath]) {
            // This case shouldn't happen with sorted files and path split
            // but for safety we can skip or handle
            return;
        }

        level[parentPath].push(newNode);
        level[currentPath] = newNode.children || [];
      }
    });
  });

  return root;
}

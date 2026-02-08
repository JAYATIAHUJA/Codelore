import { TamboProvider as Provider } from "@tambo-ai/react";
import { z } from "zod";
import GraphComponent from "@/components/graph-component";
import { graphGeneratorTool } from "@/lib/tambo-tools";

const components = [
  {
    name: "GraphComponent",
    description:
      "Renders a knowledge graph visualization of a repository's architecture with nodes and edges.",
    component: GraphComponent,
    propsSchema: z.object({
      nodes: z
        .array(
          z.object({
            id: z.string(),
            label: z.string(),
            group: z.string().optional().default("core"),
            type: z.string().optional(),
            description: z.string().optional(),
          })
        )
        .default([]),
      edges: z
        .array(
          z.object({
            from: z.string(),
            to: z.string(),
            label: z.string().optional().default(""),
          })
        )
        .default([]),
      repoUrl: z.string().optional().default(""),
    }),
  },
];

const tools = [graphGeneratorTool];

export default function TamboProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
    >
      {children}
    </Provider>
  );
}
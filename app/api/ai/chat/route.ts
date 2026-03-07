import { NextRequest } from "next/server";
import { chatWithGemini } from "@/lib/gemini";
import { COMPONENT_TOOLS, FUNCTION_TO_COMPONENT } from "@/lib/component-resolver";

export async function POST(req: NextRequest) {
    try {
        const { messages, repoContext } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: "Messages required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Transform messages to Gemini format
        const geminiMessages = messages.map(
            (m: { role: string; content: string }) => ({
                role: m.role === "assistant" ? ("model" as const) : ("user" as const),
                text: m.content,
            })
        );

        // Stream response using SSE
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const generator = chatWithGemini(
                        geminiMessages,
                        repoContext || "",
                        COMPONENT_TOOLS
                    );

                    for await (const chunk of generator) {
                        // Handle text content
                        if (chunk.text) {
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify({ type: "text", content: chunk.text })}\n\n`
                                )
                            );
                        }

                        // Handle function calls
                        const candidates = chunk.candidates || [];
                        for (const candidate of candidates) {
                            const parts = candidate.content?.parts || [];
                            for (const part of parts) {
                                if (part.functionCall && part.functionCall.name) {
                                    const fnName = part.functionCall.name;
                                    const componentName =
                                        FUNCTION_TO_COMPONENT[fnName] ||
                                        fnName;

                                    controller.enqueue(
                                        encoder.encode(
                                            `data: ${JSON.stringify({
                                                type: "component",
                                                component: componentName,
                                                props: part.functionCall.args || {},
                                            })}\n\n`
                                        )
                                    );
                                }
                            }
                        }
                    }

                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
                    );
                    controller.close();
                } catch (error: any) {
                    console.error("Chat stream error:", error);
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                type: "error",
                                content: error.message || "An error occurred",
                            })}\n\n`
                        )
                    );
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Chat failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

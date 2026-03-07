"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export interface RenderedComponent {
    id: string;
    component: string; // Component name: "ProjectGraph", "CodeFlowGraph", etc.
    props: Record<string, any>;
}

interface ChatContextType {
    messages: ChatMessage[];
    renderedComponents: RenderedComponent[];
    isLoading: boolean;
    repoContext: string;
    setRepoContext: (context: string) => void;
    sendMessage: (text: string) => Promise<void>;
    clearChat: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [renderedComponents, setRenderedComponents] = useState<RenderedComponent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [repoContext, setRepoContext] = useState("");
    const abortRef = useRef<AbortController | null>(null);

    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || isLoading) return;

            // Add user message
            const userMsg: ChatMessage = {
                id: `user-${Date.now()}`,
                role: "user",
                content: text,
            };

            setMessages((prev) => [...prev, userMsg]);
            setIsLoading(true);

            // Prepare messages for API (include history)
            const apiMessages = [
                ...messages.map((m) => ({ role: m.role, content: m.content })),
                { role: "user" as const, content: text },
            ];

            // Cancel any previous request
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            let assistantContent = "";
            const assistantId = `assistant-${Date.now()}`;

            // Add placeholder assistant message
            setMessages((prev) => [
                ...prev,
                { id: assistantId, role: "assistant", content: "" },
            ]);

            try {
                const response = await fetch("/api/ai/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: apiMessages, repoContext }),
                    signal: abortRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error(`Chat request failed: ${response.statusText}`);
                }

                const reader = response.body?.getReader();
                if (!reader) throw new Error("No response stream");

                const decoder = new TextDecoder();
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    // Parse SSE events from buffer
                    const lines = buffer.split("\n\n");
                    buffer = lines.pop() || ""; // Keep incomplete chunk

                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;
                        const dataStr = line.slice(6).trim();
                        if (!dataStr) continue;

                        try {
                            const event = JSON.parse(dataStr);

                            if (event.type === "text") {
                                assistantContent += event.content;
                                setMessages((prev) =>
                                    prev.map((m) =>
                                        m.id === assistantId
                                            ? { ...m, content: assistantContent }
                                            : m
                                    )
                                );
                            } else if (event.type === "component") {
                                const compId = `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                                setRenderedComponents((prev) => [
                                    ...prev,
                                    {
                                        id: compId,
                                        component: event.component,
                                        props: event.props || {},
                                    },
                                ]);

                                // Also note it in the assistant message
                                assistantContent += `\n[Rendered: ${event.component}]`;
                                setMessages((prev) =>
                                    prev.map((m) =>
                                        m.id === assistantId
                                            ? { ...m, content: assistantContent }
                                            : m
                                    )
                                );
                            } else if (event.type === "error") {
                                assistantContent += event.content || "An error occurred.";
                                setMessages((prev) =>
                                    prev.map((m) =>
                                        m.id === assistantId
                                            ? { ...m, content: assistantContent }
                                            : m
                                    )
                                );
                            }
                            // "done" type — just let the loop end
                        } catch {
                            // Skip unparseable chunks
                        }
                    }
                }

                // If no content was generated, add a fallback
                if (!assistantContent.trim()) {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantId
                                ? { ...m, content: "I analyzed your request but couldn't generate a response. Please try rephrasing." }
                                : m
                        )
                    );
                }
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Chat error:", error);
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantId
                                ? {
                                    ...m,
                                    content:
                                        assistantContent ||
                                        "Sorry, I encountered an error. Please try again.",
                                }
                                : m
                        )
                    );
                }
            } finally {
                setIsLoading(false);
            }
        },
        [messages, repoContext, isLoading]
    );

    const clearChat = useCallback(() => {
        abortRef.current?.abort();
        setMessages([]);
        setRenderedComponents([]);
        setIsLoading(false);
    }, []);

    return (
        <ChatContext.Provider
            value={{
                messages,
                renderedComponents,
                isLoading,
                repoContext,
                setRepoContext,
                sendMessage,
                clearChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}

"use client";

import React from "react";
import { ComicPanel } from "@/components/ui/ComicPanel";

interface TableColumn {
    header: string;
    width?: string;
    align?: "left" | "center" | "right";
}

interface GenerativeTableProps {
    title?: string;
    description?: string;
    columns?: TableColumn[];
    rows?: { values: string[] }[];
}

export function GenerativeTable({
    title = "DATA TABLE",
    description,
    columns = [],
    rows = []
}: GenerativeTableProps) {
    if (!columns.length || !rows.length) {
        return (
            <ComicPanel title={title} color="#4fc3f7">
                <div className="p-4 text-center text-zinc-500 text-sm italic">
                    No data to display.
                </div>
            </ComicPanel>
        );
    }

    return (
        <ComicPanel title={title} color="#4fc3f7">
            <div className="overflow-x-auto">
                {description && (
                    <p className="text-sm text-zinc-600 mb-3 px-1">{description}</p>
                )}

                <table className="w-full border-collapse bg-white text-sm">
                    <thead>
                        <tr className="bg-blue-50 border-b-2 border-black">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-3 py-2 font-[var(--font-bangers)] tracking-wide text-blue-900 border-r border-blue-200 last:border-r-0 text-${col.align || "left"}`}
                                    style={{ width: col.width }}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIdx) => (
                            <tr
                                key={rowIdx}
                                className="border-b border-zinc-200 last:border-b-0 hover:bg-yellow-50 transition-colors"
                            >
                                {columns.map((col, colIdx) => (
                                    <td
                                        key={`${rowIdx}-${colIdx}`}
                                        className={`px-3 py-2 border-r border-zinc-100 last:border-r-0 text-${col.align || "left"}`}
                                    >
                                        <span className="font-mono text-zinc-700">
                                            {row.values[colIdx] || ""}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ComicPanel>
    );
}

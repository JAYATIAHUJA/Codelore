"use client";

import React, { useMemo, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Position,
    MarkerType,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRepo } from "@/components/providers/RepoProvider";
import { 
    Server, 
    Database, 
    Globe, 
    Settings, 
    Code, 
    TestTube,
    Star,
    Layers,
    Package,
    Zap,
    GitBranch
} from 'lucide-react';

// Icon mapping for different node types
const iconMap = {
    frontend: Globe,
    backend: Server,
    database: Database,
    api: Zap,
    config: Settings,
    tests: TestTube,
    entry: Star,
    utils: Code,
    services: Layers,
    routes: GitBranch,
    controllers: Package
};

// Color schemes for different themes
const colorSchemes = {
    modern: {
        frontend: '#3b82f6',
        backend: '#10b981',
        database: '#6366f1',
        api: '#f59e0b',
        config: '#6b7280',
        tests: '#22c55e',
        entry: '#fbbf24',
        utils: '#8b5cf6',
        services: '#ec4899',
        routes: '#14b8a6',
        controllers: '#f97316'
    },
    brutal: {
        frontend: '#000000',
        backend: '#000000',
        database: '#000000',
        api: '#000000',
        config: '#000000',
        tests: '#000000',
        entry: '#000000',
        utils: '#000000',
        services: '#000000',
        routes: '#000000',
        controllers: '#000000'
    },
    minimal: {
        frontend: '#64748b',
        backend: '#64748b',
        database: '#64748b',
        api: '#64748b',
        config: '#64748b',
        tests: '#64748b',
        entry: '#64748b',
        utils: '#64748b',
        services: '#64748b',
        routes: '#64748b',
        controllers: '#64748b'
    },
    colorful: {
        frontend: '#3b82f6',
        backend: '#10b981',
        database: '#6366f1',
        api: '#f59e0b',
        config: '#6b7280',
        tests: '#22c55e',
        entry: '#fbbf24',
        utils: '#8b5cf6',
        services: '#ec4899',
        routes: '#14b8a6',
        controllers: '#f97316'
    }
};

interface GraphNode {
    id: string;
    label: string;
    type: "frontend" | "backend" | "database" | "api" | "config" | "tests" | "entry" | "utils" | "services" | "routes" | "controllers";
    description?: string;
    files?: string[];
    importance?: "high" | "medium" | "low";
    position?: { x: number; y: number };
    style?: {
        color?: string;
        icon?: string;
        size?: "small" | "medium" | "large";
    };
}

interface GraphEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    type?: "import" | "data-flow" | "api-call" | "dependency";
    animated?: boolean;
    style?: {
        color?: string;
        width?: number;
        dashArray?: string;
    };
}

interface GraphLayout {
    direction?: "horizontal" | "vertical" | "radial";
    spacing?: number;
    algorithm?: "hierarchical" | "force" | "circular";
}

interface GraphStyle {
    theme?: "modern" | "brutal" | "minimal" | "colorful";
    background?: "grid" | "dots" | "solid";
    animations?: boolean;
}

interface ProjectGraphProps {
    title?: string;
    initialNodes?: GraphNode[];
    initialEdges?: GraphEdge[];
    layout?: GraphLayout;
    style?: GraphStyle;
    // Legacy compatibility
    nodes?: Node[];
    edges?: Edge[];
}

export function ProjectGraph({
    title = "PROJECT MAP",
    initialNodes = [],
    initialEdges = [],
    layout = { direction: "horizontal", spacing: 350, algorithm: "hierarchical" },
    style = { theme: "modern", background: "dots", animations: true },
    nodes: legacyNodes,
    edges: legacyEdges
}: ProjectGraphProps) {
    const { repoData } = useRepo();

    // Use legacy props if provided for backward compatibility
    const effectiveNodes = legacyNodes || initialNodes;
    const effectiveEdges = legacyEdges || initialEdges;

    // Enhanced AI-driven node generation
    const { autoNodes, autoEdges } = useMemo(() => {
        // If nodes are already provided (AI-generated), use them directly
        if (effectiveNodes && effectiveNodes.length > 0) {
            const processedNodes = effectiveNodes.map((node: any) => {
                // Handle both legacy Node format and new GraphNode format
                if (node.data && node.position) {
                    // Legacy Node format
                    return node;
                }
                
                // New GraphNode format - convert to ReactFlow Node
                const IconComponent = iconMap[node.type as keyof typeof iconMap] || Code;
                const colors = colorSchemes[style.theme || 'modern'];
                const nodeColor = node.style?.color || colors[node.type as keyof typeof colors] || '#666';
                const nodeSize = (node.style?.size || 'medium') as keyof typeof sizeMap;
                
                const sizeMap = {
                    small: { width: 140, height: 80, fontSize: 12 },
                    medium: { width: 180, height: 100, fontSize: 14 },
                    large: { width: 220, height: 120, fontSize: 16 }
                };
                
                const dimensions = sizeMap[nodeSize];
                
                return {
                    id: node.id,
                    position: node.position || { x: 0, y: 0 },
                    data: { 
                        label: (
                            <div className="flex flex-col items-center gap-1 p-2">
                                <IconComponent size={20} color={nodeColor} />
                                <div className="font-semibold text-xs text-center">{node.label}</div>
                                {node.description && (
                                    <div className="text-xs opacity-70 text-center max-w-full truncate">{node.description}</div>
                                )}
                            </div>
                        )
                    },
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    style: {
                        background: style.theme === 'brutal' ? '#ffffff' : `linear-gradient(135deg, ${nodeColor}15, ${nodeColor}05)`,
                        border: style.theme === 'brutal' ? '3px solid #000000' : `2px solid ${nodeColor}`,
                        borderRadius: style.theme === 'brutal' ? '0px' : '12px',
                        padding: '8px',
                        fontWeight: 'bold',
                        width: dimensions.width,
                        height: dimensions.height,
                        textAlign: 'center',
                        boxShadow: style.theme === 'brutal' ? '6px 6px 0px rgba(0,0,0,1)' : `0 4px 12px ${nodeColor}30`,
                        fontSize: `${dimensions.fontSize}px`,
                        fontFamily: style.theme === 'brutal' ? 'var(--font-geist-mono)' : 'system-ui',
                        backdropFilter: 'blur(8px)',
                    },
                    type: 'default',
                };
            });
            
            const processedEdges = (effectiveEdges || []).map((edge: any) => {
                // Handle both legacy Edge format and new GraphEdge format
                if (edge.source && edge.target && edge.id) {
                    // Legacy Edge format
                    return edge;
                }
                
                // New GraphEdge format - convert to ReactFlow Edge
                const edgeColors = {
                    import: '#3b82f6',
                    'data-flow': '#10b981',
                    'api-call': '#f59e0b',
                    dependency: '#6b7280'
                };
                
                const edgeColor = edge.style?.color || edgeColors[edge.type as keyof typeof edgeColors] || '#666';
                
                return {
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    label: edge.label,
                    animated: edge.animated !== false && style.animations,
                    style: { 
                        stroke: edgeColor, 
                        strokeWidth: edge.style?.width || 2,
                        strokeDasharray: edge.style?.dashArray
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: edgeColor,
                        height: 16,
                        width: 16,
                    },
                    labelStyle: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                        fill: edgeColor,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                    }
                };
            });
            
            return { autoNodes: processedNodes, autoEdges: processedEdges };
        }

        if (!repoData?.modules) return { autoNodes: [], autoEdges: [] };

        const modules = repoData.modules;
        const generatedNodes: Node[] = [];
        const generatedEdges: Edge[] = [];

        // Enhanced layout algorithm with multiple strategies
        const layoutAlgorithm = layout.algorithm || 'hierarchical';
        const direction = layout.direction || 'horizontal';
        const spacing = layout.spacing || 350;
        
        // Define ranks for module types with more granular classification
        const ranks: Record<string, number> = {
            "frontend": 0,
            "config": 0,
            "entry": 0,
            "routes": 1,
            "middleware": 1.5,
            "controllers": 2,
            "services": 3,
            "utils": 3.5,
            "database": 4,
            "tests": 4
        };
        
        // Enhanced module type detection
        const getModuleType = (mod: any): string => {
            const name = mod.name.toLowerCase();
            const desc = mod.description?.toLowerCase() || '';
            
            if (name.includes("frontend") || name.includes("react") || name.includes("next") || name.includes("vue")) return "frontend";
            if (name.includes("entry") || name.includes("server") || name.includes("main") || name.includes("app.js")) return "entry";
            if (name.includes("config") || name.includes("settings")) return "config";
            if (name.includes("route") || name.includes("api")) return "routes";
            if (name.includes("middleware")) return "middleware";
            if (name.includes("controller")) return "controllers";
            if (name.includes("service")) return "services";
            if (name.includes("util") || name.includes("helper")) return "utils";
            if (name.includes("database") || name.includes("model") || name.includes("prisma")) return "database";
            if (name.includes("test") || name.includes("spec")) return "tests";
            
            // Fallback based on description
            if (desc.includes("frontend") || desc.includes("ui") || desc.includes("react")) return "frontend";
            if (desc.includes("backend") || desc.includes("server") || desc.includes("api")) return "backend";
            if (desc.includes("database") || desc.includes("data")) return "database";
            
            return "backend";
        };
        
        // Enhanced rank calculation
        const getRank = (mod: any) => {
            const type = getModuleType(mod);
            return ranks[type] || 2;
        };

        // Group modules by rank with enhanced positioning
        const layers: Record<number, any[]> = {};
        modules.forEach(mod => {
            const rank = getRank(mod);
            if (!layers[rank]) layers[rank] = [];
            layers[rank].push({ ...mod, type: getModuleType(mod) });
        });

        // Enhanced node generation with AI-driven styling
        const spacingX = spacing;
        const spacingY = direction === 'vertical' ? 200 : 150;

        Object.keys(layers).forEach(rankStr => {
            const rank = parseFloat(rankStr);
            const mods = layers[rank];
            const layerHeight = mods.length * spacingY;

            mods.forEach((mod, index) => {
                const moduleType = mod.type;
                const IconComponent = iconMap[moduleType as keyof typeof iconMap] || Code;
                const colors = colorSchemes[style.theme || 'modern'];
                const nodeColor = colors[moduleType as keyof typeof colors] || mod.color || '#666';
                
                // Dynamic positioning based on direction
                const x = direction === 'vertical' 
                    ? (index % 2) * spacingX + 100
                    : rank * spacingX;
                const y = direction === 'vertical'
                    ? Math.floor(index / 2) * spacingY + 100
                    : (index * spacingY) - (layerHeight / 2) + 300;

                generatedNodes.push({
                    id: mod.name,
                    position: { x, y },
                    data: { 
                        label: (
                            <div className="flex flex-col items-center gap-1 p-2">
                                <IconComponent size={20} color={nodeColor} />
                                <div className="font-semibold text-xs text-center">{mod.name}</div>
                                {mod.description && (
                                    <div className="text-xs opacity-70 text-center max-w-full truncate">{mod.description}</div>
                                )}
                            </div>
                        )
                    },
                    sourcePosition: direction === 'vertical' ? Position.Bottom : Position.Right,
                    targetPosition: direction === 'vertical' ? Position.Top : Position.Left,
                    style: {
                        background: style.theme === 'brutal' ? '#ffffff' : `linear-gradient(135deg, ${nodeColor}15, ${nodeColor}05)`,
                        border: style.theme === 'brutal' ? '3px solid #000000' : `2px solid ${nodeColor}`,
                        borderRadius: style.theme === 'brutal' ? '0px' : '12px',
                        padding: '8px',
                        fontWeight: 'bold',
                        width: 180,
                        height: 100,
                        textAlign: 'center',
                        boxShadow: style.theme === 'brutal' ? '6px 6px 0px rgba(0,0,0,1)' : `0 4px 12px ${nodeColor}30`,
                        fontSize: '14px',
                        fontFamily: style.theme === 'brutal' ? 'var(--font-geist-mono)' : 'system-ui',
                        backdropFilter: 'blur(8px)',
                    },
                    type: 'default',
                });

                // Enhanced edge creation with relationship types
                if (mod.dependencies) {
                    mod.dependencies.forEach((dep: string) => {
                        if (modules.some(m => m.name === dep)) {
                            const edgeType = moduleType === 'database' ? 'data-flow' : 
                                          moduleType === 'routes' ? 'api-call' : 
                                          'dependency';
                            const edgeColors = {
                                'data-flow': '#10b981',
                                'api-call': '#f59e0b',
                                'dependency': '#6b7280',
                                'import': '#3b82f6'
                            };
                            const edgeColor = edgeColors[edgeType as keyof typeof edgeColors] || '#666';
                            
                            generatedEdges.push({
                                id: `${mod.name}-${dep}`,
                                source: mod.name,
                                target: dep,
                                label: edgeType === 'data-flow' ? 'data' : 
                                       edgeType === 'api-call' ? 'API' : 
                                       edgeType === 'dependency' ? 'depends' : 'imports',
                                animated: style.animations,
                                style: { 
                                    stroke: edgeColor, 
                                    strokeWidth: 2,
                                },
                                markerEnd: {
                                    type: MarkerType.ArrowClosed,
                                    color: edgeColor,
                                    height: 16,
                                    width: 16,
                                },
                                labelStyle: {
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    fill: edgeColor,
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    padding: '2px 6px',
                                    borderRadius: '4px'
                                }
                            });
                        }
                    });
                }
            });
        });

        return { autoNodes: generatedNodes, autoEdges: generatedEdges };
    }, [repoData, effectiveNodes, effectiveEdges, layout.algorithm, layout.direction, layout.spacing, style.animations, style.theme]);

    const [nodes, setNodes, onNodesChange] = useNodesState(autoNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(autoEdges);

    // Sync state if props or auto-generation changes
    useEffect(() => {
        setNodes(autoNodes);
        setEdges(autoEdges);
    }, [autoNodes, autoEdges, setNodes, setEdges]);

    // Enhanced styling with theme support
    const backgroundVariant = style.background === 'grid' ? BackgroundVariant.Dots : 
                           style.background === 'solid' ? undefined : 
                           BackgroundVariant.Dots;
    
    const flowStyles = {
        background: style.theme === 'brutal' ? '#ffffff' : 'transparent',
        height: '600px',
        width: '100%',
    };

    return (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            {/* Title Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md">
                <h3 className="font-[var(--font-bangers)] text-xl tracking-wide">{title}</h3>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                style={flowStyles}
                fitView
                attributionPosition="bottom-right"
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            >
                {backgroundVariant && (
                    <Background 
                        color={style.theme === 'brutal' ? '#000000' : '#ccc'} 
                        gap={20} 
                        variant={backgroundVariant} 
                    />
                )}
                <Controls
                    style={{
                        border: style.theme === 'brutal' ? '3px solid #000000' : '2px solid black',
                        borderRadius: style.theme === 'brutal' ? '0px' : '4px',
                        boxShadow: style.theme === 'brutal' ? '4px 4px 0px rgba(0,0,0,1)' : '4px 4px 0px rgba(0,0,0,0.1)'
                    }}
                    showInteractive={false}
                />
                <MiniMap
                    style={{
                        border: style.theme === 'brutal' ? '3px solid #000000' : '2px solid black',
                        borderRadius: style.theme === 'brutal' ? '0px' : '4px'
                    }}
                    zoomable
                    pannable
                    nodeColor={(n) => {
                        // Extract color from node style or use default
                        if (typeof n.style === 'object' && n.style) {
                            const styleObj = n.style as any;
                            return styleObj.background?.includes('gradient') ? '#666' : styleObj.background || '#fff';
                        }
                        return '#fff';
                    }}
                />
            </ReactFlow>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/80 px-2 py-1 rounded text-xs text-zinc-500 font-mono border border-zinc-200">
                * Interactive Graph • Drag nodes to explore *
            </div>
        </div>
    );
}

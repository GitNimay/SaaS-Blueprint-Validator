
import React, { useEffect, useCallback } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    useNodesState, 
    useEdgesState, 
    Node,
    Edge,
    ReactFlowInstance
} from 'reactflow';
import { ProjectData } from '../../types';
import { MindMapNode } from '../../services/aiService';
import { BrainCircuit, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

interface MindMapTabProps {
  data: ProjectData;
  mindMapData: MindMapNode | null;
  onRetry: () => void;
  isLoading: boolean;
}

// Layout algorithm for recursive JSON -> ReactFlow
const generateLayout = (root: MindMapNode) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let globalId = 0;
    
    // Aesthetic Colors for Branches
    const colors = [
        { bg: '#3b82f6', border: '#60a5fa' }, // Blue
        { bg: '#8b5cf6', border: '#a78bfa' }, // Purple
        { bg: '#ec4899', border: '#f472b6' }, // Pink
        { bg: '#10b981', border: '#34d399' }, // Green
        { bg: '#f59e0b', border: '#fbbf24' }, // Amber
    ];

    const traverse = (node: MindMapNode, depth: number, x: number, yRange: { min: number, max: number }, parentId: string | null, branchIndex: number) => {
        const id = (globalId++).toString();
        const y = (yRange.min + yRange.max) / 2;
        
        // Style based on depth
        const isRoot = depth === 0;
        const color = colors[branchIndex % colors.length] || colors[0];
        
        nodes.push({
            id,
            data: { label: node.label, details: node.details },
            position: { x, y },
            type: isRoot ? 'input' : (node.children?.length ? 'default' : 'output'),
            style: {
                background: isRoot ? '#000000' : '#171717',
                color: '#fff',
                border: isRoot 
                    ? '2px solid #fff' 
                    : `1px solid ${depth === 1 ? color.border : '#404040'}`,
                borderRadius: '999px', // Pill shape
                padding: '12px 24px',
                minWidth: '160px',
                textAlign: 'center',
                boxShadow: isRoot ? '0 0 40px -10px rgba(255,255,255,0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                fontSize: isRoot ? '16px' : '13px',
                fontWeight: isRoot ? '600' : '400',
            }
        });

        if (parentId !== null) {
            edges.push({
                id: `e${parentId}-${id}`,
                source: parentId,
                target: id,
                type: 'bezier',
                animated: true,
                style: { 
                    stroke: depth === 1 ? color.border : '#525252',
                    strokeWidth: depth === 1 ? 2 : 1,
                    opacity: 0.8
                },
            });
        }

        if (node.children && node.children.length > 0) {
            const totalHeight = yRange.max - yRange.min;
            const slice = totalHeight / node.children.length;
            
            node.children.forEach((child, index) => {
                const childMin = yRange.min + (slice * index);
                const childMax = childMin + slice;
                // Pass branch index down if we are at root, otherwise keep current
                const nextBranchIndex = isRoot ? index : branchIndex;
                
                traverse(child, depth + 1, x + 300, { min: childMin, max: childMax }, id, nextBranchIndex);
            });
        }
    };

    traverse(root, 0, 0, { min: 0, max: 1200 }, null, 0);
    return { nodes, edges };
};

const MindMapTab: React.FC<MindMapTabProps> = ({ data, mindMapData, onRetry, isLoading }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Only update graph when data arrives
    if (mindMapData) {
        const layout = generateLayout(mindMapData);
        setNodes(layout.nodes);
        setEdges(layout.edges);
    }
  }, [mindMapData]);

  // Use onInit to handle view fitting instead of a hook that requires a provider
  const onInit = useCallback((instance: ReactFlowInstance) => {
    window.requestAnimationFrame(() => {
        instance.fitView({ padding: 0.1, duration: 800 });
    });
  }, []);

  return (
    <div className="h-full flex flex-col space-y-6">
       <ScrollReveal>
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-neutral-400" />
                    Concept Mind Map
                </h2>
                <p className="text-sm text-neutral-500">Visual breakdown of core concepts and features.</p>
            </div>
            {isLoading && (
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    Generating Nodes...
                </div>
            )}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200} className="flex-1 min-h-[600px] bg-[#0A0A0A] border border-neutral-800 rounded-xl overflow-hidden relative shadow-2xl">
          {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                      <div className="w-12 h-12 border-2 border-neutral-800 rounded-full animate-spin border-t-white" />
                      <BrainCircuit className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-neutral-500 text-sm font-medium animate-pulse">Constructing Neural Map...</p>
              </div>
          ) : !mindMapData ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                  <p className="text-neutral-400 text-sm">Failed to generate mind map structure.</p>
                  <button 
                    onClick={onRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry Generation
                  </button>
             </div>
          ) : (
             <div className="h-full w-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onInit={onInit}
                    minZoom={0.1}
                    maxZoom={2}
                    attributionPosition="bottom-right"
                >
                    <Background color="#222" gap={24} size={1} />
                    <Controls className="!bg-neutral-900 !border-neutral-800 !fill-neutral-400 [&>button:hover]:!fill-white" />
                </ReactFlow>
             </div>
          )}
      </ScrollReveal>
    </div>
  );
};

export default MindMapTab;

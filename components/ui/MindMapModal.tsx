
import React, { useMemo, useEffect } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    useNodesState, 
    useEdgesState, 
    Position,
    MarkerType,
    Node,
    Edge
} from 'reactflow';
import { X, Network, BrainCircuit } from 'lucide-react';
import { MindMapNode } from '../../services/aiService';

interface MindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MindMapNode | null;
  isLoading: boolean;
}

// Custom layout algorithm to turn recursive JSON into ReactFlow nodes/edges
const generateLayout = (root: MindMapNode) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Depth tracking for horizontal spacing
    // Height tracking for vertical spacing
    
    let globalId = 0;
    
    const traverse = (node: MindMapNode, depth: number, x: number, yRange: { min: number, max: number }, parentId: string | null) => {
        const id = (globalId++).toString();
        const y = (yRange.min + yRange.max) / 2;
        
        nodes.push({
            id,
            data: { label: node.label, details: node.details },
            position: { x, y },
            type: depth === 0 ? 'input' : (node.children?.length ? 'default' : 'output'),
            style: {
                background: depth === 0 ? '#6d28d9' : '#171717', // Purple root, black others
                color: '#fff',
                border: depth === 0 ? '1px solid #8b5cf6' : '1px solid #404040',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: depth === 0 ? '14px' : '12px',
                fontWeight: depth === 0 ? 'bold' : 'normal',
                width: 180,
            }
        });

        if (parentId !== null) {
            edges.push({
                id: `e${parentId}-${id}`,
                source: parentId,
                target: id,
                type: 'bezier',
                animated: true,
                style: { stroke: '#525252' },
            });
        }

        if (node.children && node.children.length > 0) {
            const totalHeight = yRange.max - yRange.min;
            const slice = totalHeight / node.children.length;
            
            node.children.forEach((child, index) => {
                const childMin = yRange.min + (slice * index);
                const childMax = childMin + slice;
                
                traverse(child, depth + 1, x + 250, { min: childMin, max: childMax }, id);
            });
        }
    };

    // Initial canvas size assumption
    traverse(root, 0, 0, { min: 0, max: 1000 }, null);
    
    return { nodes, edges };
};

export const MindMapModal: React.FC<MindMapModalProps> = ({ isOpen, onClose, data, isLoading }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (data && isOpen) {
        const layout = generateLayout(data);
        setNodes(layout.nodes);
        setEdges(layout.edges);
    }
  }, [data, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-6xl rounded-xl shadow-2xl flex flex-col h-[90vh] animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-blue-400" />
             </div>
             <div>
                <h3 className="text-white font-semibold">Idea Mind Map</h3>
                <p className="text-xs text-neutral-500">Visual breakdown of core concepts</p>
             </div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-black/50 relative overflow-hidden">
            {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-neutral-400 text-sm animate-pulse">Generating neural connections...</p>
                </div>
            ) : (
                 <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    attributionPosition="bottom-right"
                    minZoom={0.1}
                 >
                    <Background color="#333" gap={20} />
                    <Controls className="!bg-neutral-800 !border-neutral-700 !fill-white" />
                 </ReactFlow>
            )}
        </div>
      </div>
    </div>
  );
};

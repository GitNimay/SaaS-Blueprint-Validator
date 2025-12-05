
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Handle,
  Position,
  NodeProps,
  MiniMap,
  MarkerType
} from 'reactflow';
import { ProjectData } from '../../types';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Server, Database, Globe, Smartphone, Shield, Cpu, Cloud, Activity, GitBranch, Terminal, Table, FileCode } from 'lucide-react';

// --- Custom Node Components ---

const getNodeIcon = (label: string, type?: string) => {
  const l = label.toLowerCase();
  // New Types
  if (type === 'pipeline' || l.includes('git') || l.includes('ci/cd')) return <GitBranch className="w-3 h-3" />;
  if (l.includes('test') || l.includes('lint') || l.includes('scan')) return <FileCode className="w-3 h-3" />;
  if (l.includes('build') || l.includes('deploy')) return <Terminal className="w-3 h-3" />;
  if (l.includes('table') || l.includes('entity') || type === 'database') return <Table className="w-3 h-3" />; // Table icon for Schema

  // Existing Types
  if (l.includes('db') || l.includes('storage') || type === 'database') return <Database className="w-3 h-3" />;
  if (l.includes('web') || type === 'client') return <Globe className="w-3 h-3" />;
  if (l.includes('mobile') || l.includes('app')) return <Smartphone className="w-3 h-3" />;
  if (l.includes('auth') || l.includes('waf') || l.includes('security')) return <Shield className="w-3 h-3" />;
  if (l.includes('ai') || l.includes('worker') || l.includes('compute')) return <Cpu className="w-3 h-3" />;
  if (l.includes('cdn') || l.includes('gateway') || type === 'gateway') return <Cloud className="w-3 h-3" />;
  return <Server className="w-3 h-3" />;
};

const getNodeColor = (type?: string) => {
    switch (type) {
        case 'database': return 'border-orange-900/50 text-orange-400';
        case 'client': return 'border-blue-900/50 text-blue-400';
        case 'gateway': return 'border-purple-900/50 text-purple-400';
        case 'edge': return 'border-pink-900/50 text-pink-400';
        case 'pipeline': return 'border-green-900/50 text-green-400'; // New pipeline color
        default: return 'border-neutral-800 text-neutral-400';
    }
}

const DetailedNode = ({ data }: NodeProps) => {
  const colorClass = getNodeColor(data.type);
  
  return (
    <div className="relative group">
      {/* Connector lines visual aid (fake) */}
      <div className="absolute -left-2 top-1/2 w-2 h-px bg-neutral-800" />
      <div className="absolute -right-2 top-1/2 w-2 h-px bg-neutral-800" />

      <div className={`relative min-w-[220px] bg-black border ${colorClass.split(' ')[0]} rounded-sm shadow-xl transition-all hover:border-neutral-500`}>
        {/* Technical Header */}
        <div className="px-3 py-2 border-b border-neutral-900 bg-neutral-950/50 flex items-center justify-between">
            <div className={`flex items-center gap-2 ${colorClass.split(' ')[1]}`}>
                {getNodeIcon(data.label, data.type)}
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">{data.type || 'Service'}</span>
            </div>
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
        </div>
        
        {/* Body */}
        <div className="px-4 py-4">
            <div className="font-semibold text-neutral-200 text-sm mb-2 font-mono">{data.label}</div>
            
            <div className="flex flex-wrap gap-2">
                 {data.details && (
                    <div className="text-[10px] text-neutral-500 font-mono bg-neutral-900 px-2 py-1 rounded border border-neutral-800 flex items-center gap-1">
                        <Activity className="w-2 h-2" />
                        {data.details}
                    </div>
                )}
            </div>
        </div>
        
        {/* Handles - Custom styled for "port" look */}
        <Handle 
            type="target" 
            position={Position.Left} 
            className="!bg-neutral-950 !border-neutral-600 !w-2 !h-4 !rounded-sm -ml-[5px]" 
        />
        <Handle 
            type="source" 
            position={Position.Right} 
            className="!bg-neutral-950 !border-neutral-600 !w-2 !h-4 !rounded-sm -mr-[5px]" 
        />
      </div>
    </div>
  );
};

// --- Main Component ---

interface BlueprintTabProps {
  data: ProjectData;
}

const BlueprintTab: React.FC<BlueprintTabProps> = ({ data }) => {
  const [activeBlueprintId, setActiveBlueprintId] = useState<string>(data.blueprints?.[0]?.id || '');
  
  const activeBlueprint = useMemo(() => 
    data.blueprints.find(b => b.id === activeBlueprintId) || data.blueprints[0],
  [data.blueprints, activeBlueprintId]);

  const nodeTypes = useMemo(() => ({
    detailed: DetailedNode,
  }), []);

  const getFlowNodes = useCallback((blueprintNodes: any[]) => {
    return blueprintNodes.map(n => ({
      id: n.id,
      type: 'detailed', 
      data: { label: n.label, details: n.details, type: n.type },
      position: n.position,
    }));
  }, []);

  const getFlowEdges = useCallback((blueprintEdges: any[]) => {
    return blueprintEdges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: 'smoothstep', // Orthogonal lines for schematic look
      animated: true,
      style: { stroke: '#404040', strokeWidth: 1.5 },
      labelStyle: { fill: '#a3a3a3', fontWeight: 500, fontSize: 9, fontFamily: 'monospace' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#404040',
        width: 15,
        height: 15,
      },
    }));
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (activeBlueprint) {
      setNodes(getFlowNodes(activeBlueprint.nodes));
      setEdges(getFlowEdges(activeBlueprint.edges));
    }
  }, [activeBlueprint, getFlowNodes, getFlowEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (!activeBlueprint) return <div className="p-10 text-neutral-500">No blueprint data available.</div>;

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Header & Controls */}
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <h2 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                 System Architecture
                 <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">LIVE</span>
               </h2>
               <p className="text-sm text-neutral-500">Auto-generated infrastructure schematic based on project requirements.</p>
           </div>
           
           <div className="flex p-1 bg-neutral-900 rounded-lg border border-neutral-800 overflow-x-auto max-w-full no-scrollbar">
                {data.blueprints.map((bp) => (
                <button
                    key={bp.id}
                    onClick={() => setActiveBlueprintId(bp.id)}
                    className={`px-4 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap flex-shrink-0 ${
                    activeBlueprintId === bp.id
                        ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                >
                    {bp.name}
                </button>
                ))}
            </div>
        </div>
      </ScrollReveal>

      {/* Diagram Canvas */}
      <ScrollReveal delay={200} className="w-full h-[60vh] md:h-[500px] bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden relative shadow-2xl">
        {/* Smaller Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:12px_12px]" />
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.2}
          maxZoom={2}
          attributionPosition="bottom-right"
        >
          {/* Smaller dots grid */}
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={12} 
            size={1} 
            color="#333" 
            className="opacity-20"
          />
          
          <Controls 
              className="!bg-neutral-900 !border-neutral-800 !shadow-none [&>button]:!fill-neutral-400 [&>button:hover]:!fill-white [&>button]:!border-b-neutral-800" 
              position="top-left"
              showInteractive={false}
          />

          <MiniMap 
            nodeColor={(n) => {
                if (n.data.type === 'database') return '#7c2d12'; // orange-900
                if (n.data.type === 'gateway') return '#581c87'; // purple-900
                if (n.data.type === 'pipeline') return '#064e3b'; // green-900
                return '#262626'; // neutral-800
            }}
            maskColor="rgba(0, 0, 0, 0.7)"
            className="!bg-black !border !border-neutral-800 rounded-lg !bottom-4 !right-4 !w-32 !h-24 md:!w-48 md:!h-32"
          />
          
          {/* Metadata Overlay */}
          <div className="absolute top-4 right-4 pointer-events-none text-right hidden sm:block">
             <div className="text-[10px] text-neutral-600 font-mono mb-1">REGION: US-EAST-1</div>
             <div className="text-[10px] text-neutral-600 font-mono">UPTIME: 99.99%</div>
          </div>

        </ReactFlow>
      </ScrollReveal>
    </div>
  );
};

export default BlueprintTab;

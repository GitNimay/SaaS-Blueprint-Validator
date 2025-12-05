
import React, { useEffect } from 'react';
import { ProjectData } from '../../types';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Server, Shield, Zap, AlertTriangle, Layers, Code, Database, Globe, Smartphone, Cpu, Loader2, RefreshCw } from 'lucide-react';

interface TechStackTabProps {
  data: ProjectData;
  auditContent: string;
  onRetry: () => void;
  isLoading: boolean;
}

const getTechIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('front') || c.includes('web')) return Globe;
    if (c.includes('back') || c.includes('api')) return Server;
    if (c.includes('data') || c.includes('db')) return Database;
    if (c.includes('mobile')) return Smartphone;
    if (c.includes('ai') || c.includes('ml')) return Cpu;
    return Code;
}

const TechStackTab: React.FC<TechStackTabProps> = ({ data, auditContent, onRetry, isLoading }) => {
  // Enhanced Markdown parser
  const renderAudit = (markdown: string) => {
    if (!markdown) return null;

    // Helper to parse bold text **bold**
    const parseBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return markdown.split('\n').map((line, i) => {
      // Headers (Flexible #, ##, ###)
      const headerMatch = line.match(/^(#{1,3})\s+(.*)/);
      if (headerMatch) {
        const title = headerMatch[2];
        let Icon = Layers;
        if (title.includes('Suitability')) Icon = Layers;
        else if (title.includes('Scalability')) Icon = Zap;
        else if (title.includes('Security')) Icon = Shield;
        else if (title.includes('Complexity')) Icon = Server;
        else if (title.includes('Adjustments')) Icon = AlertTriangle;

        return (
          <div key={i} className="flex items-center gap-3 mt-8 mb-4 pb-2 border-b border-neutral-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-1.5 bg-neutral-800 rounded">
                <Icon className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        );
      }
      // List items
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return (
            <li key={i} className="ml-4 flex items-start gap-2 mb-2 animate-in fade-in duration-500" style={{ animationDelay: `${i * 10}ms` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-2 flex-shrink-0" />
                <span className="text-neutral-300 text-sm leading-relaxed">{parseBold(content)}</span>
            </li>
        );
      }
      // Empty lines
      if (line.trim().length === 0) return <div key={i} className="h-2" />;
      
      // Paragraphs
      return <p key={i} className="text-neutral-300 text-sm leading-relaxed mb-1 animate-in fade-in duration-500">{parseBold(line)}</p>;
    });
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-12">
      <ScrollReveal>
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-neutral-400" />
                    Technology Stack
                </h2>
                <p className="text-sm text-neutral-500">Current selection and AI-driven architectural audit.</p>
            </div>
        </div>
      </ScrollReveal>

      {/* Top Grid: Current Stack */}
      <ScrollReveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.techStack.map((tech, idx) => {
                const Icon = getTechIcon(tech.category);
                return (
                    <div key={idx} className="bg-[#0A0A0A] border border-neutral-800 p-4 rounded-lg hover:border-neutral-600 transition-all group">
                        <div className="mb-3 p-2 w-fit rounded bg-neutral-900 group-hover:bg-white group-hover:text-black transition-colors text-neutral-400">
                            <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-semibold text-white mb-1">{tech.name}</h4>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{tech.category}</p>
                    </div>
                )
            })}
          </div>
      </ScrollReveal>

      {/* Bottom Area: Audit */}
      {/* REMOVED SCROLLREVEAL FROM CONTAINER TO PREVENT CONTENT HIDING */}
      <div className="flex-1 bg-[#0A0A0A] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-neutral-800 p-4 bg-neutral-900/50 backdrop-blur flex justify-between items-center">
            <h3 className="text-sm font-semibold text-white">Architectural Audit Report</h3>
            {isLoading && <span className="text-xs text-neutral-500 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Analyzing...</span>}
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-neutral-400 text-sm animate-pulse">Performing deep-dive analysis on {data.techStack.length} technologies...</p>
                </div>
            ) : !auditContent ? (
                 <div className="flex flex-col items-center justify-center h-48 space-y-4">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                    <p className="text-neutral-400 text-sm">Audit generation failed or timed out.</p>
                    <button 
                        onClick={onRetry}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Retry Analysis
                    </button>
                 </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {renderAudit(auditContent)}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TechStackTab;

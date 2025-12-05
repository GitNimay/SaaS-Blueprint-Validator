import React from 'react';
import { X, Copy, FileText, Check } from 'lucide-react';
import { ProjectData } from '../../types';

interface PRDModalProps {
  data: ProjectData;
  isOpen: boolean;
  onClose: () => void;
}

export const PRDModal: React.FC<PRDModalProps> = ({ data, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const prdContent = `
# Product Requirements Document: ${data.title}
**Version:** 1.0 | **Status:** Draft | **Generated:** ${new Date().toLocaleDateString()}

## 1. Executive Summary
${data.description}
* **Tagline:** ${data.tagline}
* **Market Opportunity:** ${data.marketStats.som} SOM within a ${data.marketStats.tam} TAM.

## 2. Problem Statement
Users currently face significant challenges with existing solutions, primarily:
${data.personas.map(p => p.painPoints.map(pp => `* [${p.role}] ${pp}`).join('\n')).join('\n')}

## 3. Solution Overview
A ${data.pricingModel.toLowerCase()} platform utilizing:
${data.techStack.map(t => `* ${t.name} (${t.category})`).join('\n')}

## 4. Key Features (MVP)
${data.kanban.backlog.map(t => `* [${t.tag}] ${t.title}`).join('\n')}
${data.kanban.inProgress.map(t => `* [${t.tag}] ${t.title}`).join('\n')}

## 5. Strategic Analysis (SWOT)
* **Strengths:** ${data.swot.strengths.join(', ')}
* **Risks:** ${data.swot.threats.join(', ')}

## 6. Success Metrics (KPIs)
* Revenue Target (Year 3): $${data.revenue[2].revenue}k
* User Base Target (Year 3): ${data.revenue[2].users} users
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(prdContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
             </div>
             <div>
                <h3 className="text-white font-semibold">Generated PRD</h3>
                <p className="text-xs text-neutral-500">Markdown format ready for Notion/Jira</p>
             </div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/50">
            <pre className="text-sm font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed">
                {prdContent}
            </pre>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-neutral-800 bg-neutral-900 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
                Close
            </button>
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-neutral-200 transition-colors"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Markdown'}
            </button>
        </div>
      </div>
    </div>
  );
};

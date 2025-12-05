
import React from 'react';
import { X, Server, Shield, Zap, AlertTriangle, Layers } from 'lucide-react';

interface TechAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  isLoading: boolean;
}

export const TechAnalysisModal: React.FC<TechAnalysisModalProps> = ({ isOpen, onClose, content, isLoading }) => {
  if (!isOpen) return null;

  // Simple Markdown parser for specific headers to add styling
  const renderContent = (markdown: string) => {
    if (!markdown) return null;
    
    return markdown.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '');
        let Icon = Layers;
        if (title.includes('Suitability')) Icon = Layers;
        if (title.includes('Scalability')) Icon = Zap;
        if (title.includes('Security')) Icon = Shield;
        if (title.includes('Complexity')) Icon = Server;
        if (title.includes('Adjustments')) Icon = AlertTriangle;

        return (
          <div key={i} className="flex items-center gap-2 mt-6 mb-3 pb-2 border-b border-neutral-800">
            <Icon className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        );
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-neutral-300 text-sm mb-1 leading-relaxed">{line.substring(2)}</li>;
      }
      if (line.trim().length === 0) {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-neutral-300 text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-500/10 rounded-lg">
                <Server className="w-5 h-5 text-purple-400" />
             </div>
             <div>
                <h3 className="text-white font-semibold">Tech Stack Deep Dive</h3>
                <p className="text-xs text-neutral-500">AI-Powered Architectural Audit</p>
             </div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-black/40">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-neutral-400 text-sm animate-pulse">Analyzing architecture vectors...</p>
                </div>
            ) : (
                <div className="prose prose-invert max-w-none">
                    {renderContent(content)}
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-neutral-800 bg-neutral-900 flex justify-end">
            <button onClick={onClose} className="px-5 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-neutral-200 transition-colors">
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

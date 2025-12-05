
import React, { useState, useEffect } from 'react';
import { ProjectData } from '../types';
import ValidationTab from './tabs/ValidationTab';
import BlueprintTab from './tabs/BlueprintTab';
import KanbanTab from './tabs/KanbanTab';
import MindMapTab from './tabs/MindMapTab';
import TechStackTab from './tabs/TechStackTab';
import { Copilot } from './ui/Copilot';
import { PRDModal } from './ui/PRDModal';
import { ShareModal } from './ui/ShareModal';
import { aiService, MindMapNode } from '../services/aiService';
import { LayoutGrid, Workflow, KanbanSquare, ArrowLeft, MessageSquare, ChevronDown, FileText, Server, BrainCircuit, Share2 } from 'lucide-react';

interface DashboardProps {
  data: ProjectData;
  onBack: () => void;
  onUpdate?: (data: ProjectData) => void;
  onOpenSettings?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onBack, onUpdate, onOpenSettings }) => {
  const [activeTab, setActiveTab] = useState<'validation' | 'blueprint' | 'kanban' | 'mindmap' | 'techstack'>('validation');
  
  // Modals State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isPRDOpen, setIsPRDOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Data State for Lazy Loaded Tabs
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [isMindMapLoading, setIsMindMapLoading] = useState(false);
  
  const [techAuditContent, setTechAuditContent] = useState('');
  const [isTechAuditLoading, setIsTechAuditLoading] = useState(false);

  const tabs = [
    { id: 'validation', label: 'Overview', icon: LayoutGrid },
    { id: 'blueprint', label: 'Blueprint', icon: Workflow },
    { id: 'kanban', label: 'Roadmap', icon: KanbanSquare },
    { id: 'mindmap', label: 'Mind Map', icon: BrainCircuit },
    { id: 'techstack', label: 'Tech Stack', icon: Server },
  ] as const;

  const handleGenerateMindMap = async () => {
    if (isMindMapLoading) return;
    setIsMindMapLoading(true);
    const mapData = await aiService.generateMindMap(data);
    setMindMapData(mapData);
    setIsMindMapLoading(false);
  };

  const handleGenerateTechAudit = async () => {
    if (isTechAuditLoading) return;
    setIsTechAuditLoading(true);
    const content = await aiService.generateTechAudit(data);
    setTechAuditContent(content);
    setIsTechAuditLoading(false);
  };

  // Auto-generate content when tab is activated to prevent infinite loop/re-renders in child
  useEffect(() => {
    if (activeTab === 'mindmap' && !mindMapData && !isMindMapLoading) {
        handleGenerateMindMap();
    }
    if (activeTab === 'techstack' && !techAuditContent && !isTechAuditLoading) {
        handleGenerateTechAudit();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex flex-col animate-in fade-in duration-500 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-900 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-neutral-500 hover:text-black dark:hover:text-white transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-2 hidden sm:block" />
            <div className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-500">
               <div className="w-6 h-6 rounded bg-neutral-900 dark:bg-white flex items-center justify-center shadow-lg shadow-neutral-500/20 dark:shadow-none">
                  <span className="text-white dark:text-black font-bold text-xs">{data.title.substring(0,1)}</span>
               </div>
               <div className="block">
                  <h1 className="text-sm font-semibold text-neutral-900 dark:text-white leading-none max-w-[120px] sm:max-w-xs truncate">{data.title}</h1>
               </div>
            </div>
          </div>

          {/* Desktop Tabs */}
          <nav className="hidden md:flex items-center p-1 bg-neutral-100 dark:bg-neutral-900/50 rounded-full border border-neutral-200 dark:border-neutral-800">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-out active:scale-95 ${
                            isActive 
                            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                        }`}
                    >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black dark:text-white' : 'text-neutral-400'}`} />
                        {tab.label}
                    </button>
                )
            })}
          </nav>
          
          <div className="flex items-center gap-2">
            
            {/* AI Menu Dropdown (Actions) */}
            <div className="relative">
                <button 
                    onClick={() => setIsActionsOpen(!isActionsOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${isActionsOpen ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-black dark:text-white shadow-inner' : 'bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-300'}`}
                >
                    <FileText className="w-3 h-3 text-blue-500" />
                    <span className="hidden sm:inline">Actions</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isActionsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isActionsOpen && (
                    <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsActionsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 slide-in-from-top-2">
                        <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 mb-1">
                            Export & Share
                        </div>
                        <button 
                            onClick={() => { setIsPRDOpen(true); setIsActionsOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                            Generate PRD
                        </button>

                        <button 
                            onClick={() => { setIsShareOpen(true); setIsActionsOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <Share2 className="w-3.5 h-3.5 text-orange-400" />
                            Share Project
                        </button>
                        
                        <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1 mx-2" />
                        
                        <button 
                            onClick={() => { setIsCopilotOpen(true); setIsActionsOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                            Ask Consultant
                        </button>
                    </div>
                    </>
                )}
            </div>

            {/* Quick Copilot Toggle */}
            <button 
                onClick={() => setIsCopilotOpen(true)}
                className="p-2 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-all duration-200 active:scale-95 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
                title="Open AI Copilot"
            >
                <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Mobile Tabs Scrollable */}
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 overflow-x-auto no-scrollbar scroll-smooth">
             <div className="flex px-4 gap-6 min-w-max">
                 {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`text-sm font-medium whitespace-nowrap py-3 border-b-2 transition-all ${
                                isActive ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-neutral-500'
                            }`}
                        >
                            {tab.label}
                        </button>
                    )
                })}
             </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="min-h-[600px] w-full">
            {activeTab === 'validation' && <ValidationTab data={data} />}
            {activeTab === 'blueprint' && <BlueprintTab data={data} />}
            {activeTab === 'kanban' && <KanbanTab data={data} onUpdate={onUpdate} />}
            
            {activeTab === 'mindmap' && (
                <MindMapTab 
                    data={data} 
                    mindMapData={mindMapData} 
                    onRetry={handleGenerateMindMap} 
                    isLoading={isMindMapLoading} 
                />
            )}
            
            {activeTab === 'techstack' && (
                <TechStackTab 
                    data={data} 
                    auditContent={techAuditContent} 
                    onRetry={handleGenerateTechAudit} 
                    isLoading={isTechAuditLoading} 
                />
            )}
        </div>
      </main>

      {/* AI Overlays */}
      <Copilot data={data} isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
      <PRDModal data={data} isOpen={isPRDOpen} onClose={() => setIsPRDOpen(false)} />
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        projectTitle={data.title} 
        projectId={data.id} 
      />
    </div>
  );
};

export default Dashboard;

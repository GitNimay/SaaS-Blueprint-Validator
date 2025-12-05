
import React, { useState, useEffect } from 'react';
import { Terminal, ArrowRight, Loader2, Clock, LogOut, PanelLeft, Plus, MessageSquare, History, Square, Trash2, X } from 'lucide-react';
import { UserSettings } from './ui/UserSettings';

interface SparkInputProps {
  onGenerate: (idea: string) => Promise<void>;
  onStop?: () => void;
  isLoading: boolean;
  initialValue?: string;
  autoRun?: boolean;
  recentProjects?: { id: string; title: string; created_at: string }[];
  onLoadProject?: (id: string) => void;
  onDeleteProject?: (id: string) => void;
  userEmail?: string;
  onSignOut?: () => void;
  onOpenSettings?: () => void;
}

const SparkInput: React.FC<SparkInputProps> = ({ 
  onGenerate, 
  onStop,
  isLoading, 
  initialValue = '', 
  autoRun = false,
  recentProjects = [],
  onLoadProject,
  onDeleteProject,
  userEmail,
  onSignOut,
  onOpenSettings
}) => {
  const [idea, setIdea] = useState(initialValue);
  const [loadingText, setLoadingText] = useState('Initializing system...');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // State for delete confirmation modal
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Handle Auto Run (e.g. coming back from login)
  useEffect(() => {
    if (autoRun && initialValue && !isLoading) {
       handleGenerate();
    }
  }, [autoRun]);

  // Update local state if initialValue changes
  useEffect(() => {
    if (initialValue) setIdea(initialValue);
  }, [initialValue]);

  // Collapse sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) setSidebarOpen(false);
        else setSidebarOpen(true);
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGenerate = () => {
    if (!idea.trim()) return;

    // Simulate different loading stages
    const steps = [
      "Accessing Market Data...",
      "Analyzing Competitor Vectors...",
      "Synthesizing Tech Stack...",
      "Constructing Architecture Graph...",
      "Compiling Roadmap Tickets...",
      "Finalizing Project Manifest..."
    ];

    let stepIndex = 0;
    setLoadingText(steps[0]);
    
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
          setLoadingText(steps[stepIndex]);
      } else {
          clearInterval(interval);
      }
    }, 800);

    onGenerate(idea).finally(() => clearInterval(interval));
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-black overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sidebar Backdrop for Mobile */}
      {isSidebarOpen && userEmail && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in"
            onClick={() => setSidebarOpen(false)}
          />
      )}

      {/* Sidebar */}
      {userEmail && (
        <aside 
            className={`fixed md:relative inset-y-0 left-0 z-40 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0 w-64 shadow-2xl md:shadow-none' : '-translate-x-full w-64 md:w-0 md:-translate-x-full opacity-0 md:opacity-100'}`}
        >
            {/* Mobile Close Button */}
            <div className="md:hidden absolute top-2 right-2 z-50">
                <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* New Chat Button */}
            <div className="p-4 pt-12 md:pt-4">
                <button 
                    onClick={() => { setIdea(''); if(window.innerWidth < 768) setSidebarOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white transition-all duration-200 active:scale-95 text-sm font-medium shadow-sm group"
                >
                    <Plus className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                    <span>New Project</span>
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Recent
                </div>
                {recentProjects.length === 0 ? (
                    <div className="px-3 text-xs text-neutral-600 italic">No history yet.</div>
                ) : (
                    recentProjects.map((project) => (
                        <div key={project.id} className="relative group">
                            <button
                                onClick={() => { onLoadProject?.(project.id); if(window.innerWidth < 768) setSidebarOpen(false); }}
                                className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-all duration-200 pr-8"
                            >
                                <MessageSquare className="w-4 h-4 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 flex-shrink-0 transition-colors" />
                                <div className="flex-1 overflow-hidden">
                                    <div className="truncate text-sm font-medium">{project.title}</div>
                                    <div className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono truncate">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </button>
                            {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDeleteId(project.id);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-600 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all bg-neutral-200 dark:bg-neutral-900/80 rounded"
                                title="Delete Project"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* User Footer with New Menu */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <UserSettings 
                    userEmail={userEmail} 
                    onSignOut={onSignOut || (() => {})} 
                    onOpenSettings={onOpenSettings}
                />
            </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full bg-neutral-50 dark:bg-black min-w-0 transition-colors duration-300">
        
        {/* Toggle Sidebar Button (Desktop - always visible, Mobile - visible when closed) */}
        {userEmail && (
            <div className={`absolute top-4 left-4 z-30 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
                <button 
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-900 active:scale-95"
                >
                    <PanelLeft className="w-5 h-5" />
                </button>
            </div>
        )}

        {/* Hero Section Centered */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none transition-colors duration-300" />

            <div className="z-10 w-full max-w-xl space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-700">
                
                <div className="text-center space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 text-xs font-mono mb-2 shadow-sm animate-in slide-in-from-top-4 duration-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>v2.5.0 Live</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white animate-in slide-in-from-bottom-2 duration-500 delay-100 leading-tight">
                    Construct your <br/>
                    <span className="text-neutral-400 dark:text-neutral-500">digital reality.</span>
                </h1>
                
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed max-w-md mx-auto animate-in slide-in-from-bottom-3 duration-500 delay-200 px-4">
                    Turn abstract ideas into concrete blueprints, technical roadmaps, and market validation instantly.
                </p>
                </div>

                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-300 px-2 md:px-0">
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
                        
                        <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 flex items-center shadow-lg dark:shadow-2xl transition-all duration-300 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 group-focus-within:ring-2 group-focus-within:ring-purple-500/20 group-focus-within:border-purple-500/50">
                            <Terminal className="w-5 h-5 text-neutral-400 dark:text-neutral-500 ml-3 mr-2 group-focus-within:text-purple-500 transition-colors hidden sm:block" />
                            <input
                                type="text"
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="Describe your SaaS idea..."
                                className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 px-3 sm:px-2 py-3 text-base font-mono"
                                disabled={isLoading}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            
                            {isLoading ? (
                                <button
                                    onClick={onStop}
                                    className="bg-red-50 hover:bg-red-100 dark:bg-red-900/50 dark:hover:bg-red-900 text-red-600 dark:text-red-200 border border-red-200 dark:border-red-900 px-3 md:px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 text-xs md:text-sm animate-in fade-in active:scale-95"
                                    title="Stop Agent"
                                >
                                    <Square className="w-3 h-3 fill-current" />
                                    Stop
                                </button>
                            ) : (
                                <button
                                    onClick={handleGenerate}
                                    disabled={!idea.trim()}
                                    className="bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black px-4 md:px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm active:scale-95"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {isLoading && (
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-500 animate-in fade-in duration-300">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>{loadingText}</span>
                    </div>
                    )}
                </div>
            </div>
            
            <div className="absolute bottom-4 md:bottom-8 text-neutral-400 dark:text-neutral-600 text-[10px] md:text-xs font-mono text-center w-full px-4">
                Powered by Google Gemini 2.0 Flash
            </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-neutral-900 dark:text-white font-semibold text-lg mb-2">Delete Project?</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                    Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                        No
                    </button>
                    <button 
                        onClick={() => {
                            if (onDeleteProject) onDeleteProject(confirmDeleteId);
                            setConfirmDeleteId(null);
                        }}
                        className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20 dark:hover:bg-red-500 dark:hover:text-white rounded-lg transition-all active:scale-95"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SparkInput;

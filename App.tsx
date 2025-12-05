
import React, { useState, useEffect, useRef } from 'react';
import SparkInput from './components/SparkInput';
import Dashboard from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { ProjectData } from './types';
import { projectService } from './services/projectService';
import { supabase } from './services/supabase';
import { Session } from '@supabase/supabase-js';
import { ThemeProvider } from './components/ui/ThemeContext';
import { SettingsModal } from './components/ui/SettingsModal';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<'input' | 'login' | 'dashboard'>('input');
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Recent projects history
  const [recentProjects, setRecentProjects] = useState<{ id: string; title: string; created_at: string }[]>([]);

  // Track if generation should be aborted
  const abortRef = useRef(false);

  // 1. Auth & Session Management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      // STICKY SESSION & SHARED LINKS: Check URL or LocalStorage
      const params = new URLSearchParams(window.location.search);
      const sharedId = params.get('project_id');
      const lastProjectId = localStorage.getItem('saas-validator-last-project');
      
      if (session) {
          if (sharedId) {
            handleLoadProject(sharedId);
          } else if (lastProjectId) {
            handleLoadProject(lastProjectId);
          }
      } else if (sharedId) {
          // If not logged in but has shared link, redirect to login then load? 
          // For now, let's show login screen but maybe save the ID to load after?
          // Or just stay on input. The user needs to login to access RLS protected data.
          setView('login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // Handle post-login redirect for shared links if needed
      if (session) {
         const params = new URLSearchParams(window.location.search);
         const sharedId = params.get('project_id');
         if (sharedId) {
             handleLoadProject(sharedId);
         }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch recent projects when session is available
  useEffect(() => {
    if (session?.user?.id) {
      loadHistory();
    } else {
      setRecentProjects([]);
    }
  }, [session]);

  const loadHistory = async () => {
    if (!session?.user?.id) return;
    const history = await projectService.getUserProjects(session.user.id);
    if (history) {
      setRecentProjects(history);
    }
  };

  // 3. Database Realtime Subscription (Only active on dashboard)
  useEffect(() => {
    if (!projectData?.id) return;

    const channel = supabase
      .channel(`project-${projectData.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectData.id}`,
        },
        (payload) => {
          const newData = payload.new.data as ProjectData;
          const merged = { ...newData, id: payload.new.id };
          console.log("Received Realtime Update:", merged);
          setProjectData(merged);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectData?.id]);

  // 4. Workflow Logic

  const handleGenerateRequest = async (idea: string) => {
    // Robust session check
    let currentSession = session;
    if (!currentSession) {
        const { data } = await supabase.auth.getSession();
        currentSession = data.session;
        if (currentSession) setSession(currentSession);
    }

    // Check if user is logged in
    if (!currentSession) {
      setView('login'); // Redirect to login
      return;
    }

    // If logged in, proceed
    setLoading(true);
    abortRef.current = false;

    // Simulate async operation to allow abort check
    const data = await projectService.createProject(idea, currentSession.user.id);
    
    // Check if user clicked stop
    if (abortRef.current) {
        setLoading(false);
        return;
    }
    
    if (data) {
      setProjectData(data);
      setView('dashboard');
      loadHistory(); // Refresh history
      
      // Save ID for sticky session
      if (data.id) localStorage.setItem('saas-validator-last-project', data.id);
    } else {
      alert("Failed to initialize project. Please try again.");
    }
    setLoading(false);
  };

  const handleStopGeneration = () => {
    abortRef.current = true;
    setLoading(false);
  };

  const handleLoadProject = async (id: string) => {
    setLoading(true);
    const data = await projectService.getProjectById(id);
    if (data) {
      setProjectData(data);
      setView('dashboard');
      // Save ID for sticky session
      localStorage.setItem('saas-validator-last-project', id);
    } else {
      // If project not found (e.g. deleted on another device or invalid link)
      // Clean up sticky session to prevent infinite load loops
      localStorage.removeItem('saas-validator-last-project');
      const url = new URL(window.location.href);
      if (url.searchParams.has('project_id')) {
          url.searchParams.delete('project_id');
          window.history.replaceState({}, '', url);
      }
      setView('input');
    }
    setLoading(false);
  };

  const handleDeleteProject = async (id: string) => {
    // Directly delete - Confirmation is handled in the UI component (SparkInput)
    const success = await projectService.deleteProject(id);
    if (success) {
        setRecentProjects(prev => prev.filter(p => p.id !== id));
        // If the deleted project is currently loaded, close it
        if (projectData?.id === id) {
            handleBack();
        }
    } else {
        alert('Failed to delete project. Please try again.');
    }
  };

  const handleLocalUpdate = async (updatedData: ProjectData) => {
    setProjectData(updatedData);
    if (updatedData.id) {
        await projectService.updateProject(updatedData.id, updatedData);
    }
  };

  const handleBack = () => {
    setView('input');
    setProjectData(null);
    loadHistory(); // Refresh history on back
    // Clear sticky session
    localStorage.removeItem('saas-validator-last-project');
    
    // Clean URL param
    const url = new URL(window.location.href);
    url.searchParams.delete('project_id');
    window.history.replaceState({}, '', url);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('input');
    setProjectData(null);
    setRecentProjects([]);
    // Clear sticky session
    localStorage.removeItem('saas-validator-last-project');
  };

  // 5. Render Views
  const Content = () => {
    if (view === 'login') {
        return <LoginPage onSuccess={() => setView('input')} />;
    }

    if (view === 'dashboard' && projectData) {
        return (
        <Dashboard 
            data={projectData} 
            onBack={handleBack} 
            onUpdate={handleLocalUpdate}
            onOpenSettings={() => setIsSettingsOpen(true)}
        />
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 text-neutral-900 dark:text-slate-200 font-sans selection:bg-cyan-500/30 transition-colors duration-300">
            <SparkInput 
                onGenerate={handleGenerateRequest} 
                onStop={handleStopGeneration}
                isLoading={loading}
                recentProjects={recentProjects}
                onLoadProject={handleLoadProject}
                onDeleteProject={handleDeleteProject}
                userEmail={session?.user?.email}
                onSignOut={handleSignOut}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />
        </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="saas-validator-theme">
        <Content />
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          userEmail={session?.user?.email} 
        />
    </ThemeProvider>
  );
};

export default App;

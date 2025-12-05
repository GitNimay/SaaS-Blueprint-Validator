
import React, { useState, useEffect } from 'react';
import { X, User, Bell, Shield, Monitor, Moon, Sun, Save, Trash2, Check, Smartphone, Mail, Globe, Clock, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { supabase } from '../../services/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

type Tab = 'profile' | 'preferences' | 'notifications' | 'security';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, userEmail }) => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    bio: '',
    language: 'English (US)',
    timezone: 'UTC-05:00 (EST)',
    emailNotifs: true,
    marketingEmails: false,
    twoFactor: false,
  });

  // Load settings from Supabase when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadUserSettings = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata) {
           const meta = user.user_metadata;
           setFormData(prev => ({
             ...prev,
             firstName: meta.firstName || '',
             lastName: meta.lastName || '',
             jobTitle: meta.jobTitle || '',
             bio: meta.bio || '',
             language: meta.language || 'English (US)',
             timezone: meta.timezone || 'UTC-05:00 (EST)',
             emailNotifs: meta.emailNotifs ?? true,
             marketingEmails: meta.marketingEmails ?? false,
             twoFactor: meta.twoFactor ?? false,
           }));
           
           // Sync theme if it was saved
           if (meta.theme && meta.theme !== theme) {
               setTheme(meta.theme);
           }
        }
      };
      loadUserSettings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
        // Save to Supabase Auth Metadata
        const { error } = await supabase.auth.updateUser({
            data: {
                ...formData,
                theme: theme // Also save current theme preference
            }
        });

        if (error) throw error;

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    } catch (err) {
        console.error("Failed to save settings:", err);
        alert("Failed to save settings. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0A0A0A] border-t sm:border border-neutral-200 dark:border-neutral-800 w-full sm:max-w-5xl h-[90vh] sm:h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        
        {/* Sidebar / Top Nav on Mobile */}
        <div className="w-full md:w-64 bg-neutral-50 dark:bg-neutral-900/50 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 flex flex-col flex-shrink-0">
          <div className="p-4 md:p-6 flex justify-between items-center md:block">
            <div>
                <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Settings</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 hidden md:block">Manage your account preferences</p>
            </div>
            {/* Mobile Close Button */}
            <button onClick={onClose} className="md:hidden p-2 text-neutral-500 hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Horizontal Scroll on Mobile, Vertical on Desktop */}
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-2 md:px-3 pb-2 md:pb-0 space-x-2 md:space-x-0 md:space-y-1 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm border border-neutral-200 dark:border-neutral-700'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-500 dark:text-blue-400' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:block mt-auto p-4 border-t border-neutral-200 dark:border-neutral-800">
             <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                    {userEmail?.substring(0,2).toUpperCase() || 'ME'}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate max-w-[120px]">
                        {userEmail || 'user@example.com'}
                    </span>
                    <span className="text-[10px] text-neutral-500">Pro Plan</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0A0A0A] overflow-hidden">
            {/* Header */}
            <div className="h-14 md:h-16 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-[#0A0A0A] flex-shrink-0">
                <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white">
                    {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-neutral-900 dark:bg-white text-white dark:text-black text-xs md:text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : saved ? (
                            <Check className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                            <Save className="w-3 h-3 md:w-4 md:h-4" />
                        )}
                        {saved ? 'Saved' : 'Save'}
                    </button>
                    <button 
                        onClick={onClose}
                        className="hidden md:block p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-2xl space-y-8 md:space-y-10 animate-in slide-in-from-bottom-2 duration-300 pb-10">
                    
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <>
                            {/* Avatar Section */}
                            <section className="space-y-4">
                                <h4 className="text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">Public Profile</h4>
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex-shrink-0">
                                        <User className="w-6 h-6 md:w-8 md:h-8 text-neutral-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            <button className="px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                                Change Avatar
                                            </button>
                                            <button className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors">
                                                Remove
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-neutral-500">
                                            JPG, GIF or PNG. Max size 800K.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Info Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">First Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Jane"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Job Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Product Manager"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Bio</label>
                                    <textarea 
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                        placeholder="Brief description for your profile."
                                    />
                                    <p className="text-[10px] text-neutral-500 text-right">Brief description for your profile.</p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* PREFERENCES TAB */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-8">
                            <section className="space-y-4">
                                <h4 className="text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">Appearance</h4>
                                
                                <div className="grid grid-cols-3 gap-2 md:gap-4">
                                    <button 
                                        onClick={() => setTheme('light')}
                                        className={`flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                                    >
                                        <div className="p-1.5 md:p-2 bg-white rounded-full shadow-sm">
                                            <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                                        </div>
                                        <span className="text-[10px] md:text-xs font-medium text-neutral-900 dark:text-white">Light Mode</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => setTheme('dark')}
                                        className={`flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                                    >
                                        <div className="p-1.5 md:p-2 bg-neutral-900 rounded-full shadow-sm">
                                            <Moon className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                                        </div>
                                        <span className="text-[10px] md:text-xs font-medium text-neutral-900 dark:text-white">Dark Mode</span>
                                    </button>

                                    <button 
                                        onClick={() => setTheme('system')}
                                        className={`flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                                    >
                                        <div className="p-1.5 md:p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full shadow-sm">
                                            <Monitor className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                                        </div>
                                        <span className="text-[10px] md:text-xs font-medium text-neutral-900 dark:text-white">System</span>
                                    </button>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h4 className="text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">Regional</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                            <Globe className="w-3 h-3" /> Language
                                        </label>
                                        <select 
                                            value={formData.language}
                                            onChange={(e) => setFormData({...formData, language: e.target.value})}
                                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option>English (US)</option>
                                            <option>English (UK)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>German</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> Timezone
                                        </label>
                                        <select 
                                            value={formData.timezone}
                                            onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option>UTC-08:00 (PST)</option>
                                            <option>UTC-05:00 (EST)</option>
                                            <option>UTC+00:00 (GMT)</option>
                                            <option>UTC+01:00 (CET)</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h4 className="text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">Email Preferences</h4>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Product Updates</p>
                                            <p className="text-xs text-neutral-500 hidden sm:block">Receive emails about new features and improvements.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setFormData({...formData, emailNotifs: !formData.emailNotifs})}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.emailNotifs ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.emailNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Marketing Emails</p>
                                            <p className="text-xs text-neutral-500 hidden sm:block">Receive offers, promotions, and partner news.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setFormData({...formData, marketingEmails: !formData.marketingEmails})}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.marketingEmails ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.marketingEmails ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <section className="space-y-4">
                                <h4 className="text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">Authentication</h4>
                                <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Two-Factor Authentication</p>
                                            <p className="text-xs text-neutral-500 hidden sm:block">Add an extra layer of security to your account.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setFormData({...formData, twoFactor: !formData.twoFactor})}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.twoFactor ? 'bg-green-600' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h4 className="text-sm font-medium text-red-500 border-b border-neutral-200 dark:border-neutral-800 pb-2">Danger Zone</h4>
                                <div className="p-3 md:p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">Delete Account</p>
                                        <p className="text-xs text-neutral-500 mt-1">Permanently remove your account and all of its content.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto">
                                        <Trash2 className="w-3 h-3" />
                                        Delete Account
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

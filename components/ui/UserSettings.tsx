
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings, CreditCard, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface UserSettingsProps {
  userEmail: string;
  onSignOut: () => void;
  onOpenSettings?: () => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ userEmail, onSignOut, onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
                {userEmail.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden text-left">
                 <span className="text-xs font-medium text-neutral-900 dark:text-white truncate max-w-[120px]">{userEmail}</span>
                 <span className="text-[10px] text-neutral-500">Pro Plan</span>
            </div>
        </div>
        <Settings className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
            
            {/* Theme Selector */}
            <div className="p-2">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 px-1">Theme</p>
                <div className="flex bg-neutral-100 dark:bg-neutral-900 rounded-lg p-1 border border-neutral-200 dark:border-neutral-800">
                    <button 
                        onClick={() => setTheme('light')}
                        className={`flex-1 flex items-center justify-center p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-white dark:bg-neutral-800 shadow-sm text-amber-500' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                        title="Light Mode"
                    >
                        <Sun className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setTheme('dark')}
                        className={`flex-1 flex items-center justify-center p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-white dark:bg-neutral-800 shadow-sm text-purple-400' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                        title="Dark Mode"
                    >
                        <Moon className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setTheme('system')}
                        className={`flex-1 flex items-center justify-center p-1.5 rounded-md transition-all ${theme === 'system' ? 'bg-white dark:bg-neutral-800 shadow-sm text-blue-400' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                        title="System"
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1 mx-2" />

            {/* Menu Items */}
            <div className="space-y-0.5">
                <button 
                    onClick={() => {
                        setIsOpen(false);
                        onOpenSettings?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors text-left"
                >
                    <User className="w-4 h-4" />
                    Account Settings
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors text-left">
                    <CreditCard className="w-4 h-4" />
                    Billing & Plans
                </button>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1 mx-2" />

            {/* Sign Out */}
            <button 
                onClick={onSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors text-left"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </div>
      )}
    </div>
  );
};

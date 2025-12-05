
import React, { useState } from 'react';
import { X, Check, Copy, Share2, Facebook, Linkedin, Twitter } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, projectTitle, projectId }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !projectId) return null;

  const shareUrl = `${window.location.origin}?project_id=${projectId}`;
  const shareText = `Check out the blueprint for ${projectTitle} I generated with AI!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      id: 'twitter',
      label: 'X (Twitter)',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-black text-white hover:bg-neutral-800'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#0077b5] text-white hover:bg-[#006396]'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877f2] text-white hover:bg-[#166fe5]'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Share2 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <h3 className="text-neutral-900 dark:text-white font-semibold">Share Project</h3>
                    <p className="text-xs text-neutral-500">Collaborate or showcase your idea</p>
                </div>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            
            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-3">
                {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <a 
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-transform hover:-translate-y-0.5 active:scale-95 ${link.color}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{link.label}</span>
                        </a>
                    );
                })}
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

            {/* Copy Link */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Project Link</label>
                <div className="flex gap-2">
                    <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 truncate font-mono">
                        {shareUrl}
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity min-w-[100px]"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

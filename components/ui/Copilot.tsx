
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, ChevronRight } from 'lucide-react';
import { ProjectData } from '../../types';
import { aiService } from '../../services/aiService';

interface CopilotProps {
  data: ProjectData;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export const Copilot: React.FC<CopilotProps> = ({ data, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'init', 
      role: 'ai', 
      text: `Hello! I'm your strategic consultant for **${data.title}**. \n\nI have full context on your ${data.pricingModel} model, tech stack, and ${data.marketStats.tam} TAM. What would you like to analyze?` 
    }
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        // Prepare simple history context
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        
        // Call Real AI Service
        const responseText = await aiService.chatWithCopilot(data, userMsg.text, history);
        
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: responseText }]);
    } catch (e) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: "Connection error. Please try again." }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-black border-l border-neutral-800 shadow-2xl z-50 transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Project Copilot</h3>
              <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> 
                Gemini 2.5 Live
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-2 hover:bg-neutral-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'ai' ? 'bg-purple-900/30 border border-purple-800 text-purple-400' : 'bg-neutral-800 border border-neutral-700 text-neutral-300'}`}>
                {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'ai' 
                  ? 'bg-neutral-900 border border-neutral-800 text-neutral-300' 
                  : 'bg-white text-black font-medium'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={line === '' ? 'h-2' : ''}>
                        {line.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part)}
                    </p>
                ))}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 animate-in fade-in duration-300">
               <div className="w-8 h-8 rounded-full bg-purple-900/30 border border-purple-800 flex items-center justify-center">
                 <Bot className="w-4 h-4 text-purple-400" />
               </div>
               <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
          )}
        </div>

        {/* Suggested Actions (if empty) */}
        {messages.length === 1 && (
            <div className="px-6 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wider font-semibold">Suggested Queries</p>
                <div className="flex flex-col gap-2">
                    {['Identify high-risk technical debt', 'Suggest a go-to-market strategy', 'How can we increase the SOM?'].map(q => (
                        <button 
                            key={q} 
                            onClick={() => { setInput(q); handleSend(); }} 
                            className="text-left text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 rounded px-3 py-2 transition-all duration-200 hover:scale-[1.02] flex justify-between group active:scale-95"
                        >
                            {q}
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-neutral-800 bg-black">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Copilot..."
              className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-neutral-600 shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white text-black rounded hover:bg-neutral-200 disabled:opacity-50 disabled:bg-neutral-700 transition-all active:scale-90"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

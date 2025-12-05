
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { Loader2, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Handle Mouse Move for Background Interaction
  useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
         mouseRef.current = { x: e.clientX, y: e.clientY };
     };
     window.addEventListener('mousemove', handleMouseMove);
     return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;
    
    // Particle System
    const dots: {x: number, y: number, baseX: number, baseY: number, opacity: number, speed: number, offset: number}[] = [];
    const spacing = 45; // Grid spacing
    
    // Initialize Grid
    for(let x = 0; x < width + spacing; x += spacing) {
        for(let y = 0; y < height + spacing; y += spacing) {
            dots.push({
                x, y,
                baseX: x,
                baseY: y,
                opacity: Math.random() * 0.2 + 0.05, // Subtle opacity
                speed: Math.random() * 0.002 + 0.0005,
                offset: Math.random() * Math.PI * 2
            });
        }
    }

    const render = () => {
        ctx.clearRect(0, 0, width, height);
        const time = Date.now();
        
        dots.forEach(dot => {
            // Mouse interaction
            const dx = mouseRef.current.x - dot.baseX;
            const dy = mouseRef.current.y - dot.baseY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Gentle floating movement
            dot.y = dot.baseY + Math.sin(time * dot.speed + dot.offset) * 8;
            dot.x = dot.baseX + Math.cos(time * dot.speed + dot.offset) * 8;
            
            let alpha = dot.opacity;
            let radius = 1;

            // Highlight and expand near mouse
            if (dist < 250) {
                alpha = dot.opacity + (1 - dist/250) * 0.5;
                radius = 1 + (1 - dist/250) * 1.5;
            }

            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.8)})`;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        animationFrameId = requestAnimationFrame(render);
    }
    
    render();
    
    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Account created! Please sign in.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-neutral-800 selection:text-white font-sans">
      
      {/* Animated Background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      
      {/* Top Nav Switcher */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-neutral-800 to-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800 shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="font-semibold tracking-tight text-sm">Sign In Flow</span>
        </div>
        <div className="flex items-center gap-1 bg-neutral-900/80 backdrop-blur-md p-1 rounded-full border border-neutral-800 shadow-2xl">
             <button 
                onClick={() => setIsSignUp(false)}
                className={`px-5 py-2 text-xs font-medium rounded-full transition-all duration-300 ${!isSignUp ? 'bg-neutral-800 text-white shadow-md border border-neutral-700' : 'text-neutral-500 hover:text-white'}`}
             >
                Login
             </button>
             <button 
                onClick={() => setIsSignUp(true)}
                className={`px-5 py-2 text-xs font-medium rounded-full transition-all duration-300 ${isSignUp ? 'bg-neutral-800 text-white shadow-md border border-neutral-700' : 'text-neutral-500 hover:text-white'}`}
             >
                Signup
             </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[420px] p-8 animate-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 bg-gradient-to-b from-white via-neutral-200 to-neutral-600 bg-clip-text text-transparent">
                {isSignUp ? 'Join the Future' : 'Welcome Developer'}
            </h1>
            <p className="text-neutral-500 text-sm font-medium">
                {isSignUp ? 'Create your workspace identifier' : 'Your sign in component'}
            </p>
        </div>

        {/* Social Auth */}
        <button className="w-full bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-white p-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 mb-8 group shadow-lg hover:border-neutral-700">
             <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
             <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Sign in with Google</span>
        </button>

        <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-900/80"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-4 text-neutral-600 font-medium tracking-widest">or</span>
            </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-5">
                {/* Email Input with Floating Label */}
                <div className="relative group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-900/30 border border-neutral-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-white/20 focus:border-neutral-600 outline-none transition-all placeholder-transparent peer shadow-inner"
                        placeholder="Email"
                        id="email"
                        required
                        autoComplete="off"
                    />
                    <label 
                        htmlFor="email"
                        className={`absolute left-5 text-neutral-500 text-sm transition-all duration-200 pointer-events-none
                          peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
                          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-black peer-focus:px-2 peer-focus:text-white
                          ${email ? '-top-2.5 text-xs bg-black px-2 text-white' : ''}
                        `}
                    >
                        Email Address
                    </label>
                    {!email && (
                        <div className="absolute right-5 top-4 text-neutral-700 pointer-events-none transition-transform group-hover:translate-x-1">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    )}
                </div>
                
                {/* Password Input */}
                <div className="relative group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-900/30 border border-neutral-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-white/20 focus:border-neutral-600 outline-none transition-all placeholder-transparent peer shadow-inner"
                        placeholder="Password"
                        id="password"
                        required
                    />
                    <label 
                        htmlFor="password"
                        className={`absolute left-5 text-neutral-500 text-sm transition-all duration-200 pointer-events-none
                          peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
                          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-black peer-focus:px-2 peer-focus:text-white
                          ${password ? '-top-2.5 text-xs bg-black px-2 text-white' : ''}
                        `}
                    >
                        Password
                    </label>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 text-red-400 text-xs bg-red-950/20 p-4 rounded-xl border border-red-900/50 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {message && (
                <div className="flex items-center gap-3 text-green-400 text-xs bg-green-950/20 p-4 rounded-xl border border-green-900/50 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{message}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </>
                )}
            </button>
        </form>

        <p className="text-center text-[10px] text-neutral-600 mt-10 max-w-xs mx-auto leading-relaxed">
            By signing up, you agree to the <a href="#" className="underline hover:text-neutral-400 transition-colors">MSA</a>, <a href="#" className="underline hover:text-neutral-400 transition-colors">Product Terms</a>, <a href="#" className="underline hover:text-neutral-400 transition-colors">Policies</a>, <a href="#" className="underline hover:text-neutral-400 transition-colors">Privacy Notice</a>, and <a href="#" className="underline hover:text-neutral-400 transition-colors">Cookie Notice</a>.
        </p>
      </div>
    </div>
  );
};

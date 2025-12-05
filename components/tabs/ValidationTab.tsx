
import React from 'react';
import { ProjectData } from '../../types';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    AreaChart, Area, CartesianGrid, LineChart, Line
} from 'recharts';
import { Target, TrendingUp, Users, AlertCircle, Check, Zap, Globe, Layers, ArrowUpRight, DollarSign, Activity, Lock, Cpu, Search } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

interface ValidationTabProps {
  data: ProjectData;
}

const ValidationTab: React.FC<ValidationTabProps> = ({ data }) => {
  // Safeguard against missing or partial data from AI
  const safeValidation = data.validation || {
      problem: 0, solution: 0, market: 0, unfairAdvantage: 0, businessModel: 0, timing: 0
  };

  const chartData = [
    { subject: 'Problem', A: safeValidation.problem, fullMark: 100 },
    { subject: 'Solution', A: safeValidation.solution, fullMark: 100 },
    { subject: 'Market', A: safeValidation.market, fullMark: 100 },
    { subject: 'Moat', A: safeValidation.unfairAdvantage, fullMark: 100 },
    { subject: 'Model', A: safeValidation.businessModel, fullMark: 100 },
    { subject: 'Timing', A: safeValidation.timing, fullMark: 100 },
  ];

  const marketStats = data.marketStats || { value: [0, 0, 0], tam: 'N/A', sam: 'N/A', som: 'N/A' };
  const marketData = [
    { name: 'TAM', value: marketStats.value?.[0] || 100, display: marketStats.tam, fill: '#3b82f6' }, // Blue
    { name: 'SAM', value: marketStats.value?.[1] || 50, display: marketStats.sam, fill: '#8b5cf6' }, // Violet
    { name: 'SOM', value: marketStats.value?.[2] || 10, display: marketStats.som, fill: '#f97316' }, // Orange
  ];

  const overallScore = Math.round(
    (Object.values(safeValidation) as number[]).reduce((a: number, b: number) => a + b, 0) / 6
  );

  // Safe Revenue Access
  const revenueData = data.revenue && data.revenue.length > 0 ? data.revenue : [{ year: 'Y1', revenue: 0, users: 0 }];
  const getRevenue = (idx: number) => revenueData[idx]?.revenue ?? 0;
  
  // Calculate growth safely
  const startRev = getRevenue(1) || 1; // Avoid division by zero
  const endRev = getRevenue(revenueData.length - 1);
  const growthRate = ((endRev / startRev) * 100).toFixed(0);

  return (
    <div className="pb-12 animate-in fade-in duration-500">
      
      {/* Header Section with Mini-Sparklines or Key Data */}
      <div className="flex items-end justify-between mb-6 px-1">
        <div>
            <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Project Validation</h2>
            <p className="text-xs text-neutral-500 font-mono mt-1">AI-GENERATED FEASIBILITY REPORT • {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-medium text-green-600 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Analysis
            </span>
        </div>
      </div>

      {/* Bento Grid Layout - The "Border Grid" Technique */}
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
            
            {/* 1. Viability Score (Large) */}
            <div className="col-span-1 md:col-span-3 bg-white dark:bg-[#09090b] p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300 min-h-[180px]">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-24 h-24 text-neutral-500" />
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Viability</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-neutral-900 dark:text-white tracking-tighter">{overallScore}</span>
                        <span className="text-lg text-neutral-400 font-light">/100</span>
                    </div>
                 </div>
                 <div className="mt-4">
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-neutral-900 dark:bg-white transition-all duration-1000 ease-out" style={{ width: `${overallScore}%` }} />
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-2">
                        Weighted average of 6 key indicators.
                    </p>
                 </div>
            </div>

            {/* 2. Revenue Projection (Wide Chart) */}
            <div className="col-span-1 md:col-span-6 bg-white dark:bg-[#09090b] p-6 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300 min-h-[220px]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Projected ARR</span>
                    </div>
                    <div className="text-xs font-mono text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                        +{growthRate}% Growth
                    </div>
                </div>
                <div className="flex-1 min-h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#888888" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#888888" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', fontSize: '12px', color: '#fff' }}
                                itemStyle={{ color: '#a1a1aa' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value: number) => [`$${value}k`, 'Revenue']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#52525b" 
                                strokeWidth={2} 
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-900">
                    <div className="text-center">
                        <p className="text-[10px] text-neutral-400">Year 1</p>
                        <p className="text-xs font-mono font-medium text-neutral-900 dark:text-white">${getRevenue(0)}k</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-neutral-400">Year 3</p>
                        <p className="text-xs font-mono font-medium text-neutral-900 dark:text-white">${getRevenue(2)}k</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-neutral-400">Year 5</p>
                        <p className="text-xs font-mono font-medium text-neutral-900 dark:text-white">${getRevenue(4)}k</p>
                    </div>
                </div>
            </div>

            {/* 3. Market Stats (Vertical Stack) */}
            <div className="col-span-1 md:col-span-3 bg-white dark:bg-[#09090b] p-6 flex flex-col justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300 min-h-[220px]">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Market Depth</span>
                </div>
                <div className="space-y-5">
                    {marketData.map((item, idx) => (
                        <div key={item.name} className="space-y-1.5 group">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{item.name}</span>
                                <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white">{item.display}</span>
                            </div>
                            <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-1000 ease-out" 
                                    style={{ 
                                        width: `${Math.min(100, (item.value / (marketData[0].value || 1)) * 100)}%`,
                                        backgroundColor: item.fill 
                                    }} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Radar Chart (Square) */}
            <div className="col-span-1 md:col-span-4 bg-white dark:bg-[#09090b] p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300 min-h-[250px]">
                 <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Assessment Vector</span>
                </div>
                <div className="h-[200px] w-full -ml-4">
                    <ResponsiveContainer width="110%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                            <PolarGrid stroke="#27272a" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', fontSize: '10px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Radar
                                name="Score"
                                dataKey="A"
                                stroke="#d4d4d8"
                                strokeWidth={2}
                                fill="#d4d4d8"
                                fillOpacity={0.2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 5. Pricing & Strategy (Square) */}
            <div className="col-span-1 md:col-span-4 bg-white dark:bg-[#09090b] p-6 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300 min-h-[250px]">
                 <div className="flex items-center gap-2 mb-6">
                    <DollarSign className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Strategy DNA</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1 content-start">
                    <div className="p-3 border border-neutral-100 dark:border-neutral-800 rounded bg-neutral-50 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
                        <p className="text-[10px] text-neutral-500 uppercase mb-1">Pricing Model</p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{data.pricingModel || 'Subscription'}</p>
                    </div>
                    <div className="p-3 border border-neutral-100 dark:border-neutral-800 rounded bg-neutral-50 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
                        <p className="text-[10px] text-neutral-500 uppercase mb-1">Target</p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">B2B / Pro</p>
                    </div>
                    <div className="col-span-2 p-3 border border-neutral-100 dark:border-neutral-800 rounded bg-neutral-50 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
                        <p className="text-[10px] text-neutral-500 uppercase mb-2">Unfair Advantage</p>
                        <div className="flex items-start gap-2">
                            <Lock className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-snug line-clamp-2">
                                {data.swot?.strengths?.[0] || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Tech Stack (Square) */}
            <div className="col-span-1 md:col-span-4 bg-white dark:bg-[#09090b] p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300 min-h-[250px]">
                 <div className="flex items-center gap-2 mb-6">
                    <Layers className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Technical Foundation</span>
                </div>
                <div className="grid grid-cols-2 gap-2 content-start">
                    {data.techStack && data.techStack.slice(0,6).map((tech) => (
                        <div key={tech.name} className="flex items-center gap-2 p-2 rounded border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 cursor-default">
                             <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
                             <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7. Competitor Analysis (Wide Table) */}
            <div className="col-span-1 md:col-span-8 bg-white dark:bg-[#09090b] p-0 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300">
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Competitive Landscape</span>
                    </div>
                </div>
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                                <th className="px-6 py-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800">Competitor</th>
                                <th className="px-6 py-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800">Price Point</th>
                                <th className="px-6 py-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800">Weakness</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {data.competitors && data.competitors.map((comp, i) => (
                                <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                                    <td className="px-6 py-3 text-xs font-medium text-neutral-900 dark:text-white">{comp.name}</td>
                                    <td className="px-6 py-3 text-xs font-mono text-neutral-500">{comp.price}</td>
                                    <td className="px-6 py-3 text-xs text-neutral-600 dark:text-neutral-400">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 whitespace-nowrap">
                                            {comp.featureGap}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 8. SWOT Grid (Small Quadrants) */}
            <div className="col-span-1 md:col-span-4 bg-white dark:bg-[#09090b] p-6 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300 min-h-[250px]">
                <div className="flex items-center gap-2 mb-4">
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">SWOT Matrix</span>
                </div>
                <div className="grid grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden flex-1">
                     <div className="bg-white dark:bg-neutral-900/50 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-500 block mb-1">STRENGTHS</span>
                        <p className="text-[10px] text-neutral-600 dark:text-neutral-400 leading-tight line-clamp-3">{data.swot?.strengths?.[0]}</p>
                     </div>
                     <div className="bg-white dark:bg-neutral-900/50 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-500 block mb-1">WEAKNESSES</span>
                        <p className="text-[10px] text-neutral-600 dark:text-neutral-400 leading-tight line-clamp-3">{data.swot?.weaknesses?.[0]}</p>
                     </div>
                     <div className="bg-white dark:bg-neutral-900/50 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-500 block mb-1">OPPORTUNITIES</span>
                        <p className="text-[10px] text-neutral-600 dark:text-neutral-400 leading-tight line-clamp-3">{data.swot?.opportunities?.[0]}</p>
                     </div>
                     <div className="bg-white dark:bg-neutral-900/50 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-500 block mb-1">THREATS</span>
                        <p className="text-[10px] text-neutral-600 dark:text-neutral-400 leading-tight line-clamp-3">{data.swot?.threats?.[0]}</p>
                     </div>
                </div>
            </div>

            {/* 9. Personas (Horizontal Strip) */}
            <div className="col-span-1 md:col-span-12 bg-white dark:bg-[#09090b] p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Target Personas</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.personas && data.personas.map((p, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-white dark:hover:bg-neutral-900 transition-all duration-200 cursor-default">
                            <div className="w-10 h-10 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 text-sm font-bold text-neutral-600 dark:text-neutral-400">
                                {p.role.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{p.role}</h4>
                                    <span className="text-[10px] text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-1 rounded">{p.age}</span>
                                </div>
                                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">"{p.bio}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </ScrollReveal>

    </div>
  );
};

export default ValidationTab;

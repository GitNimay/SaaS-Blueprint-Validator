
// Data Models

export interface Ticket {
  id: string;
  title: string;
  tag: 'Frontend' | 'Backend' | 'Design' | 'Marketing' | 'DevOps' | 'Database';
}

export interface KanbanColumn {
  id: string;
  title: string;
  tickets: Ticket[];
}

export interface ValidationMetrics {
  problem: number;
  solution: number;
  market: number;
  unfairAdvantage: number;
  businessModel: number;
  timing: number;
}

export interface BlueprintNode {
  id: string;
  label: string;
  details?: string; // New field for node sub-text
  type?: string;
  position: { x: number; y: number };
}

export interface BlueprintEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Blueprint {
  id: string;
  name: string;
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Persona {
  role: string;
  age: string;
  bio: string;
  painPoints: string[];
}

export interface MarketStats {
  tam: string; // Total Addressable Market
  sam: string; // Serviceable Available Market
  som: string; // Serviceable Obtainable Market
  value: number[]; // For chart scaling
}

export interface RevenueProjection {
  year: string;
  revenue: number;
  users: number;
}

export interface Competitor {
  name: string;
  price: string;
  featureGap: string;
}

export interface ProjectData {
  id?: string; // Database ID
  title: string;
  tagline: string;
  description: string;
  validation: ValidationMetrics;
  swot: SwotAnalysis;
  personas: Persona[];
  marketStats: MarketStats;
  revenue: RevenueProjection[];
  competitors: Competitor[];
  suggestions: string[];
  techStack: {
    name: string;
    category: string;
    icon: string; // Lucide icon name mapping
  }[];
  pricingModel: 'Subscription' | 'Freemium' | 'One-Time' | 'Marketplace';
  kanban: {
    backlog: Ticket[];
    todo: Ticket[];
    inProgress: Ticket[];
    review: Ticket[];
    done: Ticket[];
  };
  blueprints: Blueprint[];
}

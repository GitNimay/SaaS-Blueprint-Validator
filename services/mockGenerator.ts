
import { ProjectData, Ticket, Blueprint, BlueprintNode, BlueprintEdge } from '../types';

const techStackPool = {
  web: [
    { name: 'React', category: 'Frontend', icon: 'Code' },
    { name: 'Tailwind CSS', category: 'Styling', icon: 'Palette' },
    { name: 'Node.js', category: 'Backend', icon: 'Server' },
    { name: 'PostgreSQL', category: 'Database', icon: 'Database' },
  ],
  mobile: [
    { name: 'React Native', category: 'Mobile', icon: 'Smartphone' },
    { name: 'Firebase', category: 'Backend', icon: 'Cloud' },
    { name: 'Redux', category: 'State', icon: 'Cpu' },
  ],
  ai: [
    { name: 'Python', category: 'Backend', icon: 'Code' },
    { name: 'FastAPI', category: 'API', icon: 'Server' },
    { name: 'OpenAI API', category: 'AI', icon: 'Brain' },
    { name: 'Pinecone', category: 'Vector DB', icon: 'Database' },
  ]
};

const prefixes = ['Nova', 'Flux', 'Hyper', 'Zen', 'Echo', 'Rapid', 'Smart', 'Omni'];
const suffixes = ['Flow', 'Base', 'Hub', 'Sync', 'ify', 'ly', 'Dash', 'Pilot'];

const generateTitle = (idea: string): string => {
  const seed = idea.length;
  const pre = prefixes[seed % prefixes.length];
  const suf = suffixes[(seed * 2) % suffixes.length];
  
  if (idea.toLowerCase().includes('dog') || idea.toLowerCase().includes('pet')) return 'PawPilot';
  if (idea.toLowerCase().includes('finance') || idea.toLowerCase().includes('money')) return 'WealthFlow';
  if (idea.toLowerCase().includes('food') || idea.toLowerCase().includes('recipe')) return 'ChefSync';
  
  return `${pre}${suf}`;
};

export const generateProjectData = (idea: string): ProjectData => {
  const lowerIdea = idea.toLowerCase();
  
  // 1. Determine Context
  const isMobile = lowerIdea.includes('app') || lowerIdea.includes('mobile');
  const isAI = lowerIdea.includes('ai') || lowerIdea.includes('gpt') || lowerIdea.includes('smart');
  const isEcom = lowerIdea.includes('shop') || lowerIdea.includes('store') || lowerIdea.includes('sell');

  // 2. Tech Stack Selection
  let selectedStack = [...techStackPool.web];
  if (isMobile) selectedStack = [...techStackPool.mobile];
  if (isAI) selectedStack = [...techStackPool.web, ...techStackPool.ai];

  // 3. Ticket Generation
  const commonTickets: Ticket[] = [
    { id: 't-1', title: 'Setup Repo & CI/CD', tag: 'DevOps' },
    { id: 't-2', title: 'Design System Setup', tag: 'Design' },
    { id: 't-3', title: 'User Authentication', tag: 'Backend' },
  ];

  const specificTickets: Ticket[] = [];
  if (isMobile) {
    specificTickets.push(
      { id: 'm-1', title: 'App Store Screenshots', tag: 'Design' },
      { id: 'm-2', title: 'Push Notifications', tag: 'Frontend' }
    );
  } else {
    specificTickets.push(
      { id: 'w-1', title: 'Landing Page Hero', tag: 'Frontend' },
      { id: 'w-2', title: 'SEO Optimization', tag: 'Marketing' }
    );
  }

  if (isAI) {
    specificTickets.push(
      { id: 'a-1', title: 'Prompt Engineering', tag: 'Backend' },
      { id: 'a-2', title: 'Vector Embeddings Setup', tag: 'Backend' }
    );
  }
  
  if (isEcom) {
    specificTickets.push(
       { id: 'e-1', title: 'Stripe Integration', tag: 'Backend' },
       { id: 'e-2', title: 'Product Catalog Schema', tag: 'Database' }
    );
  }

  // 4. Blueprints Generation (4 Diagrams)
  
  // --- 1. Enterprise System Architecture ---
  const archNodes: BlueprintNode[] = [
    { id: 'cl-1', label: 'Web Client', details: 'React / Next.js', type: 'client', position: { x: 0, y: 100 } },
    { id: 'cl-2', label: 'Mobile App', details: 'React Native', type: 'client', position: { x: 0, y: 300 } },
    { id: 'ed-1', label: 'CDN / WAF', details: 'Cloudflare', type: 'edge', position: { x: 350, y: 200 } },
    { id: 'gw-1', label: 'Load Balancer', details: 'AWS ALB', type: 'gateway', position: { x: 650, y: 200 } },
    { id: 'gw-2', label: 'API Gateway', details: 'Kong / Traefik', type: 'gateway', position: { x: 900, y: 200 } },
    { id: 'ms-1', label: 'Auth Service', details: 'OAuth2 / JWT', type: 'service', position: { x: 1250, y: 0 } },
    { id: 'ms-2', label: 'Core API', details: 'Node.js Cluster', type: 'service', position: { x: 1250, y: 150 } },
    { id: 'ms-3', label: 'Payment Svc', details: 'Stripe Webhooks', type: 'service', position: { x: 1250, y: 300 } },
    { id: 'ms-4', label: 'Notification', details: 'Email / Push', type: 'service', position: { x: 1250, y: 450 } },
    { id: 'mb-1', label: 'Event Bus', details: 'Kafka / RabbitMQ', type: 'infrastructure', position: { x: 1600, y: 225 } },
    { id: 'db-1', label: 'Identity DB', details: 'PostgreSQL', type: 'database', position: { x: 1950, y: 0 } },
    { id: 'db-2', label: 'Primary DB', details: 'PostgreSQL (HA)', type: 'database', position: { x: 1950, y: 150 } },
    { id: 'db-3', label: 'Cache Cluster', details: 'Redis Sentinel', type: 'database', position: { x: 1600, y: 50 } },
    { id: 'db-4', label: 'Object Store', details: 'S3 Buckets', type: 'database', position: { x: 1950, y: 350 } },
  ];

  const archEdges: BlueprintEdge[] = [
    { id: 'e-1', source: 'cl-1', target: 'ed-1', label: 'HTTPS' },
    { id: 'e-2', source: 'cl-2', target: 'ed-1', label: 'HTTPS' },
    { id: 'e-3', source: 'ed-1', target: 'gw-1', label: '443' },
    { id: 'e-4', source: 'gw-1', target: 'gw-2', label: 'Internal' },
    { id: 'e-5', source: 'gw-2', target: 'ms-1', label: '/auth' },
    { id: 'e-6', source: 'gw-2', target: 'ms-2', label: '/api' },
    { id: 'e-7', source: 'gw-2', target: 'ms-3', label: '/pay' },
    { id: 'e-8', source: 'gw-2', target: 'ms-4', label: 'gRPC' },
    { id: 'e-9', source: 'ms-1', target: 'db-1', label: 'Read/Write' },
    { id: 'e-10', source: 'ms-2', target: 'db-2', label: 'SQL' },
    { id: 'e-11', source: 'ms-2', target: 'db-3', label: 'Cache' },
    { id: 'e-12', source: 'ms-3', target: 'db-2', label: 'Tx' },
    { id: 'e-13', source: 'ms-2', target: 'mb-1', label: 'Pub' },
    { id: 'e-14', source: 'ms-3', target: 'mb-1', label: 'Pub' },
    { id: 'e-15', source: 'mb-1', target: 'ms-4', label: 'Sub' },
  ];

  if (isAI) {
    archNodes.push(
        { id: 'ms-ai', label: 'Inference Engine', details: 'Python / Torch', type: 'service', position: { x: 1250, y: 600 } },
        { id: 'db-vec', label: 'Vector Store', details: 'Pinecone', type: 'database', position: { x: 1950, y: 600 } },
        { id: 'ext-llm', label: 'LLM API', details: 'OpenAI / Anthropic', type: 'external', position: { x: 1600, y: 700 } }
    );
    archEdges.push(
        { id: 'e-ai-1', source: 'gw-2', target: 'ms-ai', label: '/generate' },
        { id: 'e-ai-2', source: 'ms-ai', target: 'db-vec', label: 'Embeddings' },
        { id: 'e-ai-3', source: 'ms-ai', target: 'ext-llm', label: 'Stream' }
    );
  }

  // --- 2. User Journey Map ---
  const userNodes: BlueprintNode[] = [
    { id: 'u-1', label: 'Organic Search', details: 'Google / SEO', type: 'client', position: { x: 0, y: 200 } },
    { id: 'u-2', label: 'Landing Page', details: 'Value Prop', type: 'client', position: { x: 300, y: 200 } },
    { id: 'u-3', label: 'Pricing View', details: 'Comparison', type: 'client', position: { x: 550, y: 100 } },
    { id: 'u-4', label: 'Sign Up Flow', details: 'Magic Link', type: 'client', position: { x: 800, y: 200 } },
    { id: 'u-5', label: 'Onboarding', details: 'Workspace Setup', type: 'client', position: { x: 1050, y: 200 } },
    { id: 'u-6', label: 'First Action', details: 'Activation', type: 'service', position: { x: 1300, y: 200 } },
    { id: 'u-7', label: 'Dashboard', details: 'Retention', type: 'service', position: { x: 1550, y: 200 } },
    { id: 'u-8', label: 'Email Nurture', details: 'Re-engagement', type: 'gateway', position: { x: 550, y: 350 } },
  ];

  const userEdges: BlueprintEdge[] = [
    { id: 'eu-1', source: 'u-1', target: 'u-2' },
    { id: 'eu-2', source: 'u-2', target: 'u-3' },
    { id: 'eu-3', source: 'u-2', target: 'u-4' },
    { id: 'eu-4', source: 'u-3', target: 'u-4' },
    { id: 'eu-5', source: 'u-4', target: 'u-5' },
    { id: 'eu-6', source: 'u-5', target: 'u-6' },
    { id: 'eu-7', source: 'u-6', target: 'u-7' },
    { id: 'eu-8', source: 'u-2', target: 'u-8', label: 'Exit' },
    { id: 'eu-9', source: 'u-8', target: 'u-4', label: 'Click' },
  ];

  // --- 3. Database Schema (ERD) ---
  const erdNodes: BlueprintNode[] = [
    { id: 'tbl-1', label: 'Users', details: 'id, email, password_hash', type: 'database', position: { x: 0, y: 150 } },
    { id: 'tbl-2', label: 'Profiles', details: 'user_id, first_name, avatar', type: 'database', position: { x: 300, y: 50 } },
    { id: 'tbl-3', label: 'Organizations', details: 'id, name, plan_tier', type: 'database', position: { x: 300, y: 250 } },
    { id: 'tbl-4', label: 'Memberships', details: 'user_id, org_id, role', type: 'database', position: { x: 600, y: 150 } },
    { id: 'tbl-5', label: 'Projects', details: 'id, org_id, data_json', type: 'database', position: { x: 600, y: 350 } },
    { id: 'tbl-6', label: 'Audit_Logs', details: 'id, actor_id, action', type: 'database', position: { x: 900, y: 250 } },
  ];

  const erdEdges: BlueprintEdge[] = [
    { id: 'rel-1', source: 'tbl-1', target: 'tbl-2', label: '1:1' },
    { id: 'rel-2', source: 'tbl-1', target: 'tbl-4', label: '1:N' },
    { id: 'rel-3', source: 'tbl-3', target: 'tbl-4', label: '1:N' },
    { id: 'rel-4', source: 'tbl-3', target: 'tbl-5', label: '1:N' },
    { id: 'rel-5', source: 'tbl-1', target: 'tbl-6', label: '1:N' },
  ];

  // --- 4. CI/CD Pipeline ---
  const cicdNodes: BlueprintNode[] = [
    { id: 'git', label: 'GitHub Repo', details: 'Main Branch', type: 'pipeline', position: { x: 0, y: 200 } },
    { id: 'ci-1', label: 'Lint & Test', details: 'Jest / ESLint', type: 'pipeline', position: { x: 300, y: 200 } },
    { id: 'ci-2', label: 'Build Image', details: 'Docker Build', type: 'pipeline', position: { x: 600, y: 200 } },
    { id: 'ci-3', label: 'Security Scan', details: 'Snyk / Sonar', type: 'pipeline', position: { x: 600, y: 350 } },
    { id: 'reg', label: 'Registry', details: 'ECR / DockerHub', type: 'pipeline', position: { x: 900, y: 200 } },
    { id: 'cd-1', label: 'Dev Deploy', details: 'K8s Dev Cluster', type: 'pipeline', position: { x: 1200, y: 100 } },
    { id: 'cd-2', label: 'Staging Deploy', details: 'K8s Staging', type: 'pipeline', position: { x: 1200, y: 300 } },
    { id: 'cd-3', label: 'Prod Approval', details: 'Manual Gate', type: 'gateway', position: { x: 1500, y: 300 } },
    { id: 'cd-4', label: 'Prod Deploy', details: 'Blue/Green', type: 'pipeline', position: { x: 1800, y: 300 } },
  ];

  const cicdEdges: BlueprintEdge[] = [
    { id: 'p-1', source: 'git', target: 'ci-1', label: 'Push' },
    { id: 'p-2', source: 'ci-1', target: 'ci-2', label: 'Pass' },
    { id: 'p-3', source: 'ci-1', target: 'ci-3', label: 'Async' },
    { id: 'p-4', source: 'ci-2', target: 'reg', label: 'Push' },
    { id: 'p-5', source: 'reg', target: 'cd-1', label: 'Auto' },
    { id: 'p-6', source: 'reg', target: 'cd-2', label: 'Auto' },
    { id: 'p-7', source: 'cd-2', target: 'cd-3', label: 'Ready' },
    { id: 'p-8', source: 'cd-3', target: 'cd-4', label: 'Approve' },
  ];


  const blueprints: Blueprint[] = [
    { id: 'system-arch', name: 'Architecture', nodes: archNodes, edges: archEdges },
    { id: 'user-journey', name: 'User Journey', nodes: userNodes, edges: userEdges },
    { id: 'db-schema', name: 'Database Schema', nodes: erdNodes, edges: erdEdges },
    { id: 'cicd', name: 'CI/CD Pipeline', nodes: cicdNodes, edges: cicdEdges },
  ];

  // 5. Validation Scores & Complex Analysis
  const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

  return {
    title: generateTitle(idea),
    tagline: `The ultimate solution for ${lowerIdea.split(' ').slice(0, 3).join(' ')}...`,
    description: idea,
    validation: {
      problem: r(70, 95),
      solution: r(60, 90),
      market: r(50, 95),
      unfairAdvantage: r(40, 80),
      businessModel: r(65, 90),
      timing: r(70, 99),
    },
    swot: {
      strengths: ['First-mover advantage in niche', 'Scalable tech stack', 'Low operational overhead'],
      weaknesses: ['Limited initial marketing budget', 'High dependency on third-party APIs', 'Small team size'],
      opportunities: ['Expansion into enterprise markets', 'Partnerships with existing platforms', 'Viral growth potential'],
      threats: ['Rapidly changing AI regulations', 'Big tech competitors entering space', 'Platform risk (if dependent on Twitter/IG)']
    },
    personas: [
      {
        role: "The Early Adopter",
        age: "25-34",
        bio: "Tech-savvy, always looking for efficiency tools. Willing to pay for premium features if they save time.",
        painPoints: ["Current solutions are too slow", "UI/UX is clunky in competitors", "Lacks automation"]
      },
      {
        role: "The Decision Maker",
        age: "35-50",
        bio: "Focused on ROI and team productivity. Needs reliability and security compliance.",
        painPoints: ["Difficulty scaling processes", "Fragmented data sources", "High cost of manual labor"]
      }
    ],
    marketStats: {
        tam: "$14.2B",
        sam: "$3.1B",
        som: "$150M",
        value: [100, 22, 1.1] 
    },
    revenue: [
        { year: 'Year 1', revenue: 0, users: 0 },
        { year: 'Year 2', revenue: 50, users: 1000 },
        { year: 'Year 3', revenue: 250, users: 5000 },
        { year: 'Year 4', revenue: 800, users: 15000 },
        { year: 'Year 5', revenue: 2500, users: 45000 },
    ],
    competitors: [
        { name: "LegacyCorp", price: "High ($$$)", featureGap: "Clunky UX, No AI" },
        { name: "StartUp X", price: "Low ($)", featureGap: "Limited Integrations" },
        { name: "Manual Process", price: "Free (Time)", featureGap: "High Effort, Error Prone" },
    ],
    suggestions: [
      'Consider a "Freemium" tier to reduce barrier to entry.',
      'Focus on a niche subset of users first before scaling broadly.',
      'Add social proof elements (testimonials) early in the design.',
    ],
    techStack: selectedStack,
    pricingModel: isEcom ? 'Marketplace' : (isMobile ? 'Freemium' : 'Subscription'),
    kanban: {
      backlog: [...commonTickets, ...specificTickets],
      todo: [],
      inProgress: [],
      review: [],
      done: [],
    },
    blueprints,
  };
};

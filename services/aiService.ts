
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectData } from "../types";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Strict Schema Definition to prevent JSON errors
const projectDataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    tagline: { type: Type.STRING },
    description: { type: Type.STRING },
    validation: {
      type: Type.OBJECT,
      properties: {
        problem: { type: Type.NUMBER },
        solution: { type: Type.NUMBER },
        market: { type: Type.NUMBER },
        unfairAdvantage: { type: Type.NUMBER },
        businessModel: { type: Type.NUMBER },
        timing: { type: Type.NUMBER },
      },
      required: ['problem', 'solution', 'market', 'unfairAdvantage', 'businessModel', 'timing']
    },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['strengths', 'weaknesses', 'opportunities', 'threats']
    },
    personas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          age: { type: Type.STRING },
          bio: { type: Type.STRING },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['role', 'age', 'bio', 'painPoints']
      }
    },
    marketStats: {
        type: Type.OBJECT,
        properties: {
            tam: { type: Type.STRING },
            sam: { type: Type.STRING },
            som: { type: Type.STRING },
            value: { type: Type.ARRAY, items: { type: Type.NUMBER } }
        },
        required: ['tam', 'sam', 'som', 'value']
    },
    revenue: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                year: { type: Type.STRING },
                revenue: { type: Type.NUMBER },
                users: { type: Type.NUMBER }
            },
            required: ['year', 'revenue', 'users']
        }
    },
    competitors: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING },
                featureGap: { type: Type.STRING }
            },
            required: ['name', 'price', 'featureGap']
        }
    },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    techStack: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                icon: { type: Type.STRING }
            },
            required: ['name', 'category', 'icon']
        }
    },
    pricingModel: { type: Type.STRING, enum: ['Subscription', 'Freemium', 'One-Time', 'Marketplace'] },
    kanban: {
        type: Type.OBJECT,
        properties: {
            backlog: { 
                type: Type.ARRAY, 
                items: { 
                    type: Type.OBJECT, 
                    properties: { 
                        id: { type: Type.STRING }, 
                        title: { type: Type.STRING }, 
                        tag: { type: Type.STRING, enum: ['Frontend', 'Backend', 'Design', 'Marketing', 'DevOps', 'Database'] } 
                    },
                    required: ['id', 'title', 'tag']
                } 
            },
            todo: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, tag: { type: Type.STRING } } } },
            inProgress: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, tag: { type: Type.STRING } } } },
            review: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, tag: { type: Type.STRING } } } },
            done: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, tag: { type: Type.STRING } } } },
        },
        required: ['backlog']
    },
    blueprints: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                nodes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            label: { type: Type.STRING },
                            details: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['client', 'gateway', 'service', 'database', 'edge', 'external', 'pipeline'] },
                            position: {
                                type: Type.OBJECT,
                                properties: {
                                    x: { type: Type.NUMBER },
                                    y: { type: Type.NUMBER }
                                },
                                required: ['x', 'y']
                            }
                        },
                        required: ['id', 'label', 'details', 'type', 'position']
                    }
                },
                edges: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            source: { type: Type.STRING },
                            target: { type: Type.STRING },
                            label: { type: Type.STRING }
                        },
                        required: ['id', 'source', 'target']
                    }
                }
            },
            required: ['id', 'name', 'nodes', 'edges']
        }
    }
  },
  required: ['title', 'tagline', 'description', 'validation', 'swot', 'personas', 'marketStats', 'revenue', 'competitors', 'suggestions', 'techStack', 'pricingModel', 'kanban', 'blueprints']
};

// Fixed-depth schema for Mind Map to prevent infinite recursion and "Unterminated string" errors
// We define 3 levels explicitely: Root -> Main Branches -> Sub Branches -> (Stop)
const mindMapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    label: { type: Type.STRING },
    details: { type: Type.STRING },
    children: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            label: { type: Type.STRING },
            details: { type: Type.STRING },
            children: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        details: { type: Type.STRING },
                        children: {
                             type: Type.ARRAY,
                             items: {
                                type: Type.OBJECT,
                                properties: {
                                    label: { type: Type.STRING },
                                    details: { type: Type.STRING }
                                },
                                required: ['label']
                             }
                        }
                    },
                    required: ['label']
                }
            }
        },
        required: ['label']
      }
    }
  },
  required: ['label']
};

const SYSTEM_PROMPT = `
You are an expert SaaS Architect and Product Manager. 
Generate a comprehensive SaaS project structure based on the user's idea.

IMPORTANT BLUEPRINT RULES:
You MUST generate exactly 4 blueprints in the 'blueprints' array:
1. "System Architecture": High-level infrastructure (Client -> Gateway -> Services -> DB).
2. "User Journey": Steps a user takes (Landing -> Signup -> Action -> Value).
3. "Database Schema": Key tables/entities (Users, Orders, Items) and relationships. Use type 'database' for nodes.
4. "CI/CD Pipeline": Deployment flow (Git -> Build -> Test -> Deploy). Use type 'pipeline' for nodes.

Layout Rules for Blueprints:
1. You MUST calculate 'position' {x, y} for every node.
2. Organize nodes in logical layers from Left to Right.
3. X coordinates should increment by approx 300 for each layer (e.g., Client x=0, Edge x=300, Gateway x=600...).
4. Y coordinates should space out nodes in the same layer to avoid overlap.
`;

export interface MindMapNode {
  label: string;
  details?: string;
  children?: MindMapNode[];
}

// Robust JSON Cleaner to handle AI conversational filler
const cleanJson = (text: string) => {
  if (!text) return "";
  
  // 1. Remove Markdown Code Blocks
  let clean = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1').trim();
  
  // 2. Extract JSON object if surrounded by text
  const firstOpen = clean.indexOf('{');
  const lastClose = clean.lastIndexOf('}');
  
  if (firstOpen !== -1 && lastClose !== -1) {
    clean = clean.substring(firstOpen, lastClose + 1);
  }
  
  return clean;
};

export const aiService = {
  async generateProjectData(idea: string): Promise<ProjectData | null> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a SaaS project structure for the idea: "${idea}".`,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: projectDataSchema,
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (!text) return null;

      // Clean and Parse JSON
      const jsonStr = cleanJson(text);
      const data = JSON.parse(jsonStr);
      
      // Validation & Fallbacks
      if (!data.kanban) data.kanban = { backlog: [], todo: [], inProgress: [], review: [], done: [] };
      if (!data.kanban.inProgress) data.kanban.inProgress = [];
      if (!data.kanban.done) data.kanban.done = [];
      if (!data.kanban.todo) data.kanban.todo = [];
      if (!data.kanban.review) data.kanban.review = [];
      
      if (!data.blueprints) data.blueprints = [];
      if (!data.personas) data.personas = [];
      if (!data.techStack) data.techStack = [];

      return data as ProjectData;

    } catch (error) {
      console.error("AI Generation Failed:", error);
      return null;
    }
  },

  async chatWithCopilot(contextData: ProjectData, message: string, history: {role: string, text: string}[]): Promise<string> {
    try {
      // Construct a chat session with context
      const systemContext = `
        You are an expert SaaS Consultant for the project "${contextData.title}".
        Project Context:
        - Description: ${contextData.description}
        - Tech Stack: ${contextData.techStack.map(t => t.name).join(', ')}
        - Pricing: ${contextData.pricingModel}
        - Target Personas: ${contextData.personas.map(p => p.role).join(', ')}
        
        Answer the user's questions specifically about this project. Be concise, professional, and insightful.
      `;
      
      const prompt = `
        ${systemContext}

        Current User Question: ${message}
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return response.text || "I couldn't generate a response at the moment.";
    } catch (error) {
        console.error("Copilot Error:", error);
        return "Sorry, I'm having trouble connecting to the AI consultant right now.";
    }
  },

  async generateTechAudit(data: ProjectData): Promise<string> {
    try {
      const prompt = `
        Perform a critical "Tech Stack Audit" for the following SaaS project:
        Title: ${data.title}
        Description: ${data.description}
        Current Stack: ${data.techStack.map(t => t.name).join(', ')}

        Provide the output in rigorous Markdown format with the following sections:
        
        ## 1. Suitability Assessment
        Why is this stack a good (or bad) fit for the specific domain?
        
        ## 2. Scalability Analysis
        Identify potential bottlenecks if users scale to 100k+.
        
        ## 3. Security Implications
        What specific security concerns does this stack/architecture raise?
        
        ## 4. Complexity vs. Velocity
        Is this stack over-engineered or under-engineered for an MVP?
        
        ## 5. Recommended Adjustments
        List specific libraries or services to add or remove to improve the project.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "Unable to generate audit.";
    } catch (error) {
      console.error("Tech Audit Error:", error);
      return "Error generating tech stack audit. Please try again.";
    }
  },

  async generateMindMap(data: ProjectData): Promise<MindMapNode | null> {
    try {
      const prompt = `
        Generate a hierarchical Mind Map for the SaaS project "${data.title}".
        The Mind Map should branch out from the Central Idea into major categories (e.g., Core Features, Go-to-Market, Revenue Streams, Infrastructure, Target Audience).
        
        Rules:
        1. Keep the JSON structure strict: label, details, children.
        2. Depth MUST be limited to 3 levels (Root -> Categories -> Sub-items).
        3. Do not generate excessively long strings for 'details'.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { 
            responseMimeType: 'application/json',
            responseSchema: mindMapSchema // Use new fixed-depth schema
        }
      });

      const text = response.text;
      if (!text) return null;

      try {
        const jsonStr = cleanJson(text);
        const parsed = JSON.parse(jsonStr);
        // Basic validation
        if (!parsed.label) return null; 
        return parsed as MindMapNode;
      } catch (e) {
          console.error("JSON Parse Error in MindMap", e);
          return null;
      }

    } catch (error) {
      console.error("Mind Map Error:", error);
      return null;
    }
  }
};

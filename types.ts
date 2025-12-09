export enum AgentStatus {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  systemPrompt: string;
  cluster: 'Visionaries' | 'Artificers' | 'Guardians';
  trigger: string;
  tools: string[];
  outputFormat: string; // e.g., 'JSON', 'Markdown', 'HTML'
}

export interface AgentState {
  config: AgentConfig;
  status: AgentStatus;
  lastRun: string | null;
  currentOutput: string | null;
  logs: string[];
}

export interface GlobalConfig {
  domain: string;
  niche: string;
  apiKeys: {
    grok: string;
    dataForSeo: string;
    gemini: string; // Using Gemini to simulate the "Grok" behavior in this demo
  };
}

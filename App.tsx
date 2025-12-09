import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AgentWorkspace from './components/AgentWorkspace';
import PreviewPanel from './components/PreviewPanel';
import SettingsModal from './components/SettingsModal';
import { AgentState, GlobalConfig, AgentStatus } from './types';
import { INITIAL_AGENTS } from './constants';
import { Hexagon } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [agents, setAgents] = useState<AgentState[]>(() => 
    INITIAL_AGENTS.map(config => ({
      config,
      status: AgentStatus.IDLE,
      lastRun: null,
      currentOutput: null,
      logs: []
    }))
  );

  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({
    domain: '',
    niche: '',
    apiKeys: {
      grok: '',
      dataForSeo: '',
      gemini: process.env.API_KEY || ''
    }
  });

  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- Handlers ---
  const handleConfigChange = (key: keyof GlobalConfig, value: string) => {
    setGlobalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateAgent = (id: string, updates: Partial<AgentState>) => {
    setAgents(prev => prev.map(a => 
      a.config.id === id ? { ...a, ...updates } : a
    ));
  };

  const handleUpdateAgentConfig = (id: string, updates: any) => {
    setAgents(prev => prev.map(a => 
        a.config.id === id ? { ...a, config: { ...a.config, ...updates } } : a
      ));
  }

  const handleApiSave = (newKeys: Partial<GlobalConfig['apiKeys']>) => {
    setGlobalConfig(prev => ({
      ...prev,
      apiKeys: { ...prev.apiKeys, ...newKeys }
    }));
  };

  const activeAgent = agents.find(a => a.config.id === activeAgentId);

  return (
    <div className="flex flex-col h-screen bg-mage-900 text-gray-200 font-sans selection:bg-mage-accent selection:text-white overflow-hidden">
      {/* Top Header */}
      <TopBar 
        config={globalConfig} 
        onConfigChange={handleConfigChange} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation (Left) */}
        <Sidebar 
          agents={agents} 
          activeAgentId={activeAgentId} 
          onSelectAgent={setActiveAgentId} 
        />

        {/* Main Workspace (Center) */}
        {activeAgent ? (
          <AgentWorkspace 
            agent={activeAgent} 
            globalConfig={globalConfig}
            onUpdateAgent={handleUpdateAgent}
            onUpdateConfig={handleUpdateAgentConfig}
            allAgents={agents}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-mage-900/50 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mage-800/20 to-transparent pointer-events-none" />
            
            <div className="w-32 h-32 bg-mage-800/50 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(139,92,246,0.1)] border border-mage-700/50 backdrop-blur-sm">
              <Hexagon className="w-16 h-16 text-mage-accent/80" />
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">System Ready</h2>
            <p className="text-gray-400 max-w-lg leading-relaxed text-lg mb-8">
              The Infinite Affiliate Machine is idle. Select a Mage to begin the content loop.
            </p>
            
            <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
              {agents.map(a => (
                <button 
                  key={a.config.id}
                  onClick={() => setActiveAgentId(a.config.id)}
                  className="bg-mage-800/40 border border-mage-700/50 p-6 rounded-xl hover:bg-mage-800 hover:border-mage-accent/50 transition-all group text-left"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-mage-accent transition-colors">{a.config.name}</h3>
                  <p className="text-xs text-gray-500">{a.config.role}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview Panel (Right) */}
        <PreviewPanel agent={activeAgent} />
      </div>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        config={globalConfig}
        onSave={handleApiSave}
      />
    </div>
  );
};

export default App;
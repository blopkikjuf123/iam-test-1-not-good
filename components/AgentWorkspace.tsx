import React, { useState, useEffect } from 'react';
import { AgentState, GlobalConfig, AgentStatus } from '../types';
import { Play, Save, RotateCcw, Terminal, Zap } from 'lucide-react';
import { generateAgentOutput } from '../services/geminiService';

interface AgentWorkspaceProps {
  agent: AgentState;
  globalConfig: GlobalConfig;
  onUpdateAgent: (id: string, updates: Partial<AgentState>) => void;
  onUpdateConfig: (id: string, updates: any) => void;
  // We can pass output from other agents here
  allAgents: AgentState[];
}

const AgentWorkspace: React.FC<AgentWorkspaceProps> = ({ agent, globalConfig, onUpdateAgent, onUpdateConfig, allAgents }) => {
  const [promptBuffer, setPromptBuffer] = useState(agent.config.systemPrompt);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    setPromptBuffer(agent.config.systemPrompt);
  }, [agent.config.id, agent.config.systemPrompt]);

  const handleSavePrompt = () => {
    onUpdateConfig(agent.config.id, { systemPrompt: promptBuffer });
  };

  const handleExecute = async () => {
    if (!globalConfig.apiKeys.gemini) {
      alert("Please set your Gemini API Key in the top right settings to run the simulation.");
      return;
    }

    setIsExecuting(true);
    onUpdateAgent(agent.config.id, { status: AgentStatus.WORKING });

    // Gather context from previous agents
    let context = "";
    if (agent.config.id === 'mage_crafter') {
        const prospector = allAgents.find(a => a.config.id === 'mage_prospector');
        if (prospector?.currentOutput) {
            context = `Use this Content Queue JSON: ${prospector.currentOutput}`;
        }
    } else if (agent.config.id === 'mage_architect') {
        const crafter = allAgents.find(a => a.config.id === 'mage_crafter');
        if (crafter?.currentOutput) {
            context = `Embed this Article HTML: ${crafter.currentOutput}`;
        }
    }

    try {
      const output = await generateAgentOutput(
        globalConfig.apiKeys.gemini,
        agent.config.name,
        promptBuffer,
        globalConfig.domain,
        globalConfig.niche,
        context
      );

      onUpdateAgent(agent.config.id, {
        status: AgentStatus.COMPLETED,
        currentOutput: output,
        lastRun: new Date().toISOString()
      });
    } catch (error) {
      onUpdateAgent(agent.config.id, { status: AgentStatus.ERROR });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-mage-900/50 min-w-0">
      {/* Workspace Header */}
      <div className="px-8 py-6 border-b border-mage-700 bg-mage-900">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
              {agent.config.name}
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{agent.config.backstory}</p>
          </div>
          
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 font-bold transition-all border ${
              isExecuting 
                ? 'bg-mage-700 text-gray-500 border-transparent cursor-not-allowed' 
                : 'bg-mage-accent text-white border-violet-400 hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]'
            }`}
           >
             {isExecuting ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
             {isExecuting ? 'Mage Working...' : 'Run Mage Protocol'}
           </button>
        </div>
      </div>

      {/* Configuration Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          
            {/* Directives Editor */}
            <div className="bg-mage-800 rounded-lg p-1 border border-mage-700 shadow-xl flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b border-mage-700 bg-mage-900/50 rounded-t-lg">
                    <h3 className="text-sm font-bold text-mage-accent uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> System Instructions
                    </h3>
                    <button 
                    onClick={handleSavePrompt}
                    className="text-xs flex items-center gap-1 bg-mage-700 hover:bg-mage-600 px-3 py-1.5 rounded transition-colors text-white"
                    >
                    <Save className="w-3 h-3" /> Update Prompt
                    </button>
                </div>
                
                <textarea
                    value={promptBuffer}
                    onChange={(e) => setPromptBuffer(e.target.value)}
                    className="w-full h-[500px] bg-[#0d1321] text-gray-300 font-mono text-sm p-6 outline-none leading-relaxed resize-none rounded-b-lg"
                    spellCheck={false}
                />
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'COMPLETED' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    Status: {agent.status}
                </div>
                <span>•</span>
                <div>Goal: {agent.config.goal}</div>
                <span>•</span>
                <div>Trigger: {agent.config.trigger}</div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AgentWorkspace;
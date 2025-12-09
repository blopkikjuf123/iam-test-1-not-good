import React from 'react';
import { AgentState } from '../types';
import { Pickaxe, Scroll, Castle, Hammer } from 'lucide-react';

interface SidebarProps {
  agents: AgentState[];
  activeAgentId: string | null;
  onSelectAgent: (id: string) => void;
}

const MageIcon = ({ id }: { id: string }) => {
  switch (id) {
    case 'mage_founder': return <Hammer className="w-5 h-5" />;
    case 'mage_prospector': return <Pickaxe className="w-5 h-5" />;
    case 'mage_crafter': return <Scroll className="w-5 h-5" />;
    case 'mage_architect': return <Castle className="w-5 h-5" />;
    default: return <Pickaxe className="w-5 h-5" />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ agents, activeAgentId, onSelectAgent }) => {
  return (
    <div className="w-64 bg-mage-900 border-r border-mage-700 flex flex-col h-[calc(100vh-64px)] overflow-y-auto shrink-0">
      <div className="p-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">The Quadrivium</h2>
        
        <div className="space-y-2">
          {agents.map((agent) => (
            <button
              key={agent.config.id}
              onClick={() => onSelectAgent(agent.config.id)}
              className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 border ${
                activeAgentId === agent.config.id
                  ? 'bg-mage-800 text-white border-mage-accent shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                  : 'bg-transparent text-gray-400 border-transparent hover:bg-mage-800 hover:text-gray-200'
              }`}
            >
              <div className={`p-2 rounded-md ${activeAgentId === agent.config.id ? 'bg-mage-accent text-white' : 'bg-mage-800 text-gray-500'}`}>
                <MageIcon id={agent.config.id} />
              </div>
              <div className="overflow-hidden">
                <span className="block font-bold text-sm truncate">{agent.config.name}</span>
                <span className="block text-xs text-gray-500 truncate opacity-80">{agent.config.role}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-mage-700">
        <div className="bg-mage-800 p-3 rounded-lg border border-mage-700">
           <p className="text-xs text-gray-400 font-mono mb-1">System Status</p>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-bold text-white">Ouroboros Loop: Active</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
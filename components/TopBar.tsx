import React from 'react';
import { Settings, Cpu, Globe, Target } from 'lucide-react';
import { GlobalConfig } from '../types';

interface TopBarProps {
  config: GlobalConfig;
  onConfigChange: (key: keyof GlobalConfig, value: string) => void;
  onOpenSettings: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ config, onConfigChange, onOpenSettings }) => {
  return (
    <div className="h-16 bg-mage-900 border-b border-mage-700 flex items-center justify-between px-6 shadow-md z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-mage-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <Cpu className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider text-white">I.A.M.</h1>
          <p className="text-xs text-mage-accent font-mono uppercase">Infinite Affiliate Machine</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center gap-6 mx-12">
        <div className="flex items-center gap-2 bg-mage-800 px-4 py-2 rounded-md border border-mage-700 w-64">
          <Globe className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={config.domain}
            onChange={(e) => onConfigChange('domain', e.target.value)}
            placeholder="example.com"
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500 font-mono"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-mage-800 px-4 py-2 rounded-md border border-mage-700 w-64">
          <Target className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={config.niche}
            onChange={(e) => onConfigChange('niche', e.target.value)}
            placeholder="e.g., Personal Finance, Crypto"
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500 font-mono"
          />
        </div>
      </div>

      <button
        onClick={onOpenSettings}
        className="p-2 hover:bg-mage-800 rounded-full transition-colors text-gray-400 hover:text-white"
        title="API Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};

export default TopBar;
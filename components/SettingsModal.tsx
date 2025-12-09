import React, { useState } from 'react';
import { X, Key } from 'lucide-react';
import { GlobalConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GlobalConfig;
  onSave: (updates: Partial<GlobalConfig['apiKeys']>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [keys, setKeys] = useState(config.apiKeys);

  if (!isOpen) return null;

  const handleChange = (key: keyof typeof keys, value: string) => {
    setKeys(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(keys);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-mage-800 border border-mage-700 w-full max-w-md rounded-xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-mage-accent" /> API Configuration
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase font-bold">Gemini API Key (Required for Simulation)</label>
            <input
              type="password"
              value={keys.gemini}
              onChange={(e) => handleChange('gemini', e.target.value)}
              className="w-full bg-mage-900 border border-mage-700 rounded px-3 py-2 text-white focus:border-mage-accent outline-none"
              placeholder="AIzaSy..."
            />
            <p className="text-xs text-gray-500">Used to power the 12 Mages in this demo environment.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase font-bold">Grok API Key (Optional)</label>
            <input
              type="password"
              value={keys.grok}
              onChange={(e) => handleChange('grok', e.target.value)}
              className="w-full bg-mage-900 border border-mage-700 rounded px-3 py-2 text-white focus:border-mage-accent outline-none"
              placeholder="xai-..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase font-bold">DataForSEO API Key (Optional)</label>
            <input
              type="password"
              value={keys.dataForSeo}
              onChange={(e) => handleChange('dataForSeo', e.target.value)}
              className="w-full bg-mage-900 border border-mage-700 rounded px-3 py-2 text-white focus:border-mage-accent outline-none"
              placeholder="User:Password"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-mage-accent hover:bg-violet-600 text-white px-6 py-2 rounded font-bold transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
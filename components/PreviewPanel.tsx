import React, { useState } from 'react';
import { Eye, Code, FileJson, LayoutTemplate, Globe } from 'lucide-react';
import { AgentState } from '../types';

interface PreviewPanelProps {
  agent: AgentState | undefined;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ agent }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  if (!agent) {
    return (
      <div className="w-1/3 bg-mage-900 border-l border-mage-700 flex items-center justify-center text-gray-500">
        <p className="text-sm">Select a Mage to view output</p>
      </div>
    );
  }

  const renderContent = () => {
    if (!agent.currentOutput) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-50 p-8 text-center">
          <LayoutTemplate className="w-16 h-16 mb-4" />
          <p className="text-sm">No artifacts generated yet.</p>
          <p className="text-xs mt-2">Configure and run the Mage to see results.</p>
        </div>
      );
    }

    // JSON View (The Prospector)
    if (agent.config.outputFormat === 'JSON' || (viewMode === 'code' && agent.config.outputFormat === 'JSON')) {
       return (
        <pre className="p-4 text-xs font-mono text-green-400 overflow-auto h-full whitespace-pre-wrap">
          {agent.currentOutput}
        </pre>
       );
    }

    // Code View (Raw HTML/MD)
    if (viewMode === 'code') {
      return (
        <pre className="p-4 text-xs font-mono text-blue-300 overflow-auto h-full whitespace-pre-wrap">
          {agent.currentOutput}
        </pre>
      );
    }

    // Visual Preview (Web/HTML)
    if (viewMode === 'preview') {
      if (agent.config.id === 'mage_prospector') {
        // Special visualizer for JSON Queue
        let data = [];
        try {
            data = JSON.parse(agent.currentOutput);
            if (!Array.isArray(data)) data = [data]; // Handle single object or array
        } catch (e) {
            return <div className="p-4 text-red-400">Invalid JSON Output</div>;
        }
        return (
            <div className="p-4 space-y-3 h-full overflow-y-auto">
                {data.map((item: any, idx: number) => (
                    <div key={idx} className="bg-mage-800 border border-mage-700 p-3 rounded hover:border-mage-accent transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-white text-sm">{item.keyword}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${item.intent === 'buy' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>{item.intent}</span>
                        </div>
                        <div className="text-xs text-gray-400 flex gap-4">
                            <span>📍 {item.city || 'National'}</span>
                            <span>🛠 {item.tool || 'None'}</span>
                        </div>
                    </div>
                ))}
            </div>
        )
      }

      // HTML Render (Crafter / Architect)
      return (
        <div className="h-full bg-white relative">
            <div className="absolute top-0 left-0 right-0 bg-gray-100 text-gray-500 text-[10px] px-2 py-1 border-b flex justify-between">
                <span>Localhost Preview</span>
                <span>100%</span>
            </div>
            <iframe 
                srcDoc={agent.currentOutput}
                title="Preview"
                className="w-full h-full pt-6"
                sandbox="allow-scripts"
            />
        </div>
      );
    }
  };

  return (
    <div className="w-[450px] bg-mage-900 border-l border-mage-700 flex flex-col h-[calc(100vh-64px)] shadow-2xl z-20 shrink-0">
      {/* Panel Header */}
      <div className="h-12 border-b border-mage-700 flex items-center justify-between px-4 bg-mage-800">
        <h3 className="font-bold text-gray-300 text-sm flex items-center gap-2">
            <Eye className="w-4 h-4 text-mage-accent" />
            Viewport
        </h3>
        <div className="flex bg-mage-900 rounded p-1 border border-mage-700">
          <button 
            onClick={() => setViewMode('preview')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'preview' ? 'bg-mage-700 text-white' : 'text-gray-500 hover:text-white'}`}
            title="Visual Preview"
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'code' ? 'bg-mage-700 text-white' : 'text-gray-500 hover:text-white'}`}
            title="Source Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden bg-[#0d1321]">
        {renderContent()}
      </div>

      {/* Panel Footer / File Info */}
      <div className="h-8 bg-mage-900 border-t border-mage-700 flex items-center px-4 justify-between text-[10px] text-gray-500 font-mono">
        <span>{agent.config.outputFormat}</span>
        <span>{agent.lastRun ? new Date(agent.lastRun).toLocaleTimeString() : '--:--'}</span>
      </div>
    </div>
  );
};

export default PreviewPanel;
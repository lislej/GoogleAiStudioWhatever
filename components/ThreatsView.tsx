
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  FileX, 
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Threat } from '../types';
import { analyzeThreat } from '../services/geminiService';

interface ThreatsViewProps {
  threats: Threat[];
}

const ThreatsView: React.FC<ThreatsViewProps> = ({ threats }) => {
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (threat: Threat) => {
    setSelectedThreat(threat);
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeThreat(threat.signature);
      setAnalysis(result);
    } catch (e) {
      setAnalysis("Failed to connect to threat intelligence service.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (threats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-emerald-500/10 p-6 rounded-full mb-6">
          <ShieldCheck size={64} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No Threats Detected</h3>
        <p className="text-zinc-500 max-w-md">
          Great! Your system is currently clean. All scanned files passed signature and heuristic analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Detected Threats</h2>
          <p className="text-zinc-500 mt-1">Found {threats.length} potential risk(s) in your system.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-rose-900/20">
            Quarantine All
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {threats.map((threat) => (
            <div 
              key={threat.id}
              onClick={() => handleAnalyze(threat)}
              className={`group cursor-pointer p-4 rounded-xl border transition-all ${
                selectedThreat?.id === threat.id 
                  ? 'bg-rose-500/10 border-rose-500/50' 
                  : 'bg-[#0f0f12] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="bg-rose-500/20 p-2 rounded-lg text-rose-500">
                  <ShieldAlert size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-zinc-100 truncate">{threat.signature}</h4>
                  <p className="text-xs font-mono text-zinc-500 mt-1 truncate">{threat.filePath}</p>
                </div>
                <div className="text-rose-500 group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 min-h-[400px] flex flex-col">
          {selectedThreat ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-bold">Threat Intelligence</h3>
              </div>
              
              <div className="bg-zinc-900/50 rounded-xl p-4 mb-6 border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Analyzing Signature</span>
                <p className="font-mono text-emerald-400 mt-1">{selectedThreat.signature}</p>
              </div>

              <div className="flex-1 text-zinc-300 leading-relaxed text-sm">
                {isAnalyzing ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-4 bg-zinc-800 rounded w-full"></div>
                    <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                  </div>
                ) : analysis ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    {analysis.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                ) : (
                  <div className="text-zinc-500 italic">Select a threat to begin deep intelligence analysis.</div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-2.5 rounded-lg border border-zinc-700 text-sm font-medium">
                  Ignore
                </button>
                <button className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-rose-900/20">
                  Quarantine File
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <Search size={48} className="mb-4" />
              <p>Select a threat from the list to analyze its origin and risk factor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatsView;

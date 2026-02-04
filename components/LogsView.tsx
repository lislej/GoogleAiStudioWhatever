
import React, { useState } from 'react';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Search,
  Filter
} from 'lucide-react';
import { LogEntry } from '../types';

interface LogsViewProps {
  logs: LogEntry[];
}

const LogsView: React.FC<LogsViewProps> = ({ logs }) => {
  const [filter, setFilter] = useState('');

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) ||
    log.level.includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
          <p className="text-zinc-500 mt-1">Real-time engine events and processing stream.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl border border-zinc-700 transition-colors">
            <Download size={18} />
          </button>
          <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-rose-400 rounded-xl border border-zinc-700 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input 
          type="text" 
          placeholder="Filter logs by level or message..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-[#0f0f12] border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
      </div>

      <div className="flex-1 bg-[#0c0c0e] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-inner">
        <div className="bg-zinc-900 px-4 py-2 flex items-center gap-2 border-b border-zinc-800">
          <Terminal size={14} className="text-zinc-500" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">ClamAV Runtime Terminal</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1.5 custom-scrollbar">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, idx) => (
              <div key={idx} className="flex gap-4 group hover:bg-white/5 p-1 rounded transition-colors">
                <span className="text-zinc-600 select-none whitespace-nowrap">[{log.timestamp}]</span>
                <span className={`font-bold w-16 uppercase text-xs ${
                  log.level === 'error' ? 'text-rose-500' : 
                  log.level === 'warn' ? 'text-amber-500' : 
                  log.level === 'success' ? 'text-emerald-500' : 'text-blue-500'
                }`}>
                  {log.level}
                </span>
                <span className="text-zinc-300 break-all">{log.message}</span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600">
              <Filter size={32} className="mb-2 opacity-20" />
              <p>No logs match the current filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsView;

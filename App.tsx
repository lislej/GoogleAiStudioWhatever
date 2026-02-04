
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  AlertTriangle, 
  Terminal, 
  Settings, 
  Activity,
  Cpu,
  HardDrive,
  Database
} from 'lucide-react';
import DashboardView from './components/DashboardView';
import ScannerView from './components/ScannerView';
import ThreatsView from './components/ThreatsView';
import LogsView from './components/LogsView';
import { ViewType, LogEntry, Threat } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [isDbUpdating, setIsDbUpdating] = useState(false);

  // Mock initial logs
  useEffect(() => {
    addLog('info', 'ClamAV Sentinel service initialized.');
    addLog('success', 'Virus database loaded (Version: 26901).');
  }, []);

  const addLog = (level: LogEntry['level'], message: string) => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }, ...prev].slice(0, 100));
  };

  const updateDatabase = async () => {
    setIsDbUpdating(true);
    addLog('info', 'Checking for virus database updates...');
    await new Promise(r => setTimeout(r, 2000));
    addLog('success', 'Database is already up to date (Daily-27123).');
    setIsDbUpdating(false);
  };

  const NavItem = ({ icon: Icon, label, view }: { icon: any, label: string, view: ViewType }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all ${
        activeView === view 
          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30' 
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col bg-[#0c0c0e]">
        <div className="p-6 flex items-center space-x-3 border-b border-zinc-800">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Sentinel</h1>
            <p className="text-xs text-zinc-500 font-mono">v1.2.0-stable</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem icon={LayoutDashboard} label="Dashboard" view="dashboard" />
          <NavItem icon={ShieldCheck} label="Scan System" view="scanner" />
          <NavItem icon={AlertTriangle} label="Detected Threats" view="threats" />
          <NavItem icon={Terminal} label="System Logs" view="logs" />
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={updateDatabase}
            disabled={isDbUpdating}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors border border-zinc-700 disabled:opacity-50"
          >
            <Database size={16} className={isDbUpdating ? 'animate-spin' : ''} />
            <span>{isDbUpdating ? 'Updating DB...' : 'Update Signatures'}</span>
          </button>
          
          <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Engine Health</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Memory</span>
                <span className="text-zinc-200">142MB</span>
              </div>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[15%]"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header Decoration */}
        <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10">
          <Activity size={120} className="text-emerald-500" />
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {activeView === 'dashboard' && <DashboardView onNavigate={setActiveView} />}
          {activeView === 'scanner' && (
            <ScannerView 
              onLog={(lvl, msg) => addLog(lvl, msg)} 
              onThreatDetected={(t) => setThreats(prev => [t, ...prev])} 
            />
          )}
          {activeView === 'threats' && <ThreatsView threats={threats} />}
          {activeView === 'logs' && <LogsView logs={logs} />}
          {activeView === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Settings</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <p className="text-zinc-400">Configuration panel for ClamAV daemon...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;


import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  FileSearch, 
  AlertCircle,
  TrendingUp,
  Cpu,
  MemoryStick as Memory,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ViewType } from '../types';

const data = [
  { name: 'Mon', threats: 2 },
  { name: 'Tue', threats: 1 },
  { name: 'Wed', threats: 5 },
  { name: 'Thu', threats: 2 },
  { name: 'Fri', threats: 0 },
  { name: 'Sat', threats: 0 },
  { name: 'Sun', threats: 1 },
];

interface DashboardViewProps {
  onNavigate: (view: ViewType) => void;
}

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-[#0f0f12] border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg bg-zinc-900 text-${color}-400`}>
        <Icon size={20} />
      </div>
      <div className="text-xs text-zinc-500 font-medium">Live Update</div>
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm text-zinc-500">{label}</div>
  </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-zinc-500 mt-1">Real-time system health and threat intelligence.</p>
        </div>
        <button 
          onClick={() => onNavigate('scanner')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-900/20"
        >
          Run Fast Scan
        </button>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={ShieldCheck} label="Protection Status" value="Secure" color="emerald" />
        <StatCard icon={FileSearch} label="Files Analyzed" value="1.2M+" color="blue" />
        <StatCard icon={AlertCircle} label="Active Threats" value="0" color="rose" />
        <StatCard icon={Clock} label="Uptime" value="12d 4h" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Trend Chart */}
        <div className="lg:col-span-2 bg-[#0f0f12] border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <TrendingUp size={18} className="text-emerald-500" />
              <span>Threat History (7 Days)</span>
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorThreats)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Load */}
        <div className="bg-[#0f0f12] border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold">Engine Resources</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 flex items-center gap-2"><Cpu size={14}/> CPU Usage</span>
                <span className="text-zinc-200">2.4%</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[12%]"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 flex items-center gap-2"><Memory size={14}/> RAM Usage</span>
                <span className="text-zinc-200">142 MB</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[25%]"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 flex items-center gap-2"><Activity size={14}/> I/O Wait</span>
                <span className="text-zinc-200">Low</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[4%]"></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-xs text-zinc-500 italic">
              "System stability is optimal. ClamAV daemon is responding within 15ms."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

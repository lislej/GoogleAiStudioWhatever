
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Play, 
  Square, 
  Pause, 
  RotateCw,
  Search,
  CheckCircle2,
  FileWarning
} from 'lucide-react';
import { ScanStatus, LogEntry, Threat } from '../types';

interface ScannerViewProps {
  onLog: (level: LogEntry['level'], message: string) => void;
  onThreatDetected: (threat: Threat) => void;
}

const ScannerView: React.FC<ScannerViewProps> = ({ onLog, onThreatDetected }) => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [scannedCount, setScannedCount] = useState(0);
  const [threatsFound, setThreatsFound] = useState(0);
  
  const scanIntervalRef = useRef<number | null>(null);

  const startScan = () => {
    setStatus('scanning');
    setProgress(0);
    setScannedCount(0);
    setThreatsFound(0);
    onLog('info', 'Starting system-wide deep scan...');
  };

  const stopScan = () => {
    if (scanIntervalRef.current) window.clearInterval(scanIntervalRef.current);
    setStatus('idle');
    setProgress(0);
    setCurrentFile('');
    onLog('warn', 'Scan aborted by user.');
  };

  useEffect(() => {
    if (status === 'scanning') {
      const mockDirectories = [
        '/usr/bin', '/etc/systemd', '/var/log', '/home/user/downloads', '/root', '/opt/bin', '/tmp/.cache'
      ];
      const mockFiles = [
        'index.js', 'main.py', 'kernel.sys', 'payload.exe', 'script.sh', 'config.json', 'backup.zip'
      ];

      scanIntervalRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            window.clearInterval(scanIntervalRef.current!);
            setStatus('completed');
            onLog('success', 'Deep scan completed. System is clean.');
            return 100;
          }
          
          const dir = mockDirectories[Math.floor(Math.random() * mockDirectories.length)];
          const file = mockFiles[Math.floor(Math.random() * mockFiles.length)];
          const fullPath = `${dir}/${file}`;
          setCurrentFile(fullPath);
          setScannedCount(c => c + Math.floor(Math.random() * 50) + 1);
          
          // Randomly trigger a mock threat for demonstration
          if (Math.random() > 0.99) {
            const signature = `Win.Virus.FakeTest-${Math.floor(Math.random() * 999)}`;
            onThreatDetected({
              id: Math.random().toString(36),
              filePath: fullPath,
              signature,
              severity: 'high'
            });
            setThreatsFound(t => t + 1);
            onLog('error', `Threat detected: ${signature} in ${fullPath}`);
          }

          return prev + 0.5;
        });
      }, 100);
    } else {
      if (scanIntervalRef.current) window.clearInterval(scanIntervalRef.current);
    }
    return () => { if (scanIntervalRef.current) window.clearInterval(scanIntervalRef.current); };
  }, [status]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">ClamScan Engine</h2>
        <p className="text-zinc-500 mt-2">High-performance virus scanning for cross-platform systems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
        <div className="relative flex justify-center">
          {/* Circular Progress Visualization */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-zinc-800"
              />
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 110}
                strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
                strokeLinecap="round"
                className={`transition-all duration-300 ${threatsFound > 0 ? 'text-rose-500' : 'text-emerald-500'}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold font-mono">{Math.floor(progress)}%</span>
              <span className="text-xs uppercase tracking-widest text-zinc-500 mt-1">
                {status === 'scanning' ? 'Scanning...' : status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Total Files</span>
              <span className="text-zinc-100 font-mono">{scannedCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Threats Found</span>
              <span className={`font-mono font-bold ${threatsFound > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {threatsFound}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Duration</span>
              <span className="text-zinc-100 font-mono">00:04:12</span>
            </div>
          </div>

          <div className="flex gap-4">
            {status === 'idle' || status === 'completed' ? (
              <button 
                onClick={startScan}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all"
              >
                <Play size={20} fill="currentColor" />
                Start Scan
              </button>
            ) : (
              <button 
                onClick={stopScan}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-zinc-700 transition-all"
              >
                <Square size={18} fill="currentColor" />
                Stop Scan
              </button>
            )}
            
            <button className="px-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-zinc-700 transition-all">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {status === 'scanning' && (
        <div className="bg-[#0f0f12] border border-zinc-800 rounded-xl p-4 animate-pulse">
          <div className="flex items-center space-x-3 mb-2">
            <div className="animate-spin text-emerald-500">
              <RotateCw size={14} />
            </div>
            <span className="text-xs font-mono text-zinc-400">Analyzing:</span>
          </div>
          <div className="text-sm font-mono text-zinc-300 truncate">
            {currentFile || 'Accessing filesystem...'}
          </div>
        </div>
      )}

      {status === 'completed' && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex items-center gap-4 text-emerald-400">
          <CheckCircle2 size={32} />
          <div>
            <h4 className="font-bold">Scan Complete</h4>
            <p className="text-sm opacity-80">No threats detected. Your system is secure.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerView;

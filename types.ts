
export type ScanStatus = 'idle' | 'scanning' | 'paused' | 'completed' | 'failed';

export interface ScanResult {
  id: string;
  timestamp: string;
  filesScanned: number;
  threatsDetected: number;
  duration: string;
  status: 'clean' | 'infected';
}

export interface Threat {
  id: string;
  filePath: string;
  signature: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export type ViewType = 'dashboard' | 'scanner' | 'threats' | 'logs' | 'settings';

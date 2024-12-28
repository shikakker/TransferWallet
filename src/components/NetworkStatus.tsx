import React from 'react';
import { Activity } from 'lucide-react';
import { NetworkStatus as NetworkStatusType } from '../types';

interface NetworkStatusProps {
  status: NetworkStatusType;
}

export function NetworkStatus({ status }: NetworkStatusProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2">
      <Activity className={`w-4 h-4 ${
        status.status === 'healthy' ? 'text-green-500' :
        status.status === 'degraded' ? 'text-yellow-500' :
        'text-red-500'
      }`} />
      <span className="text-sm font-medium">
        Network: {status.status} ({status.latency}ms)
      </span>
    </div>
  );
}
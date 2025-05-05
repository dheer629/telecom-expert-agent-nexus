
import { LogEntry as LogEntryType } from '@/utils/LoggingService';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface LogEntryProps {
  entry: LogEntryType;
}

const LogEntry = ({ entry }: LogEntryProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'debug': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  const hasDetails = entry.details !== undefined;
  
  return (
    <div className={cn(
      'mb-1 border rounded p-2 text-sm',
      getLevelColor(entry.level)
    )}>
      <div className="flex items-center">
        <div className="font-mono text-xs mr-2">[{formatTime(entry.timestamp)}]</div>
        <div className="flex-grow font-medium">{entry.message}</div>
        {hasDetails && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-black/5 rounded"
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>
      
      {expanded && hasDetails && (
        <div className="mt-2 pt-2 border-t border-current/20 font-mono text-xs whitespace-pre-wrap overflow-auto max-h-64">
          {typeof entry.details === 'string' ? entry.details : JSON.stringify(entry.details, null, 2)}
        </div>
      )}
    </div>
  );
};

export default LogEntry;


import { useState, useEffect } from 'react';
import { Logger, LogEntry as LogEntryType } from '@/utils/LoggingService';
import LogEntry from './LogEntry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Terminal, Trash2, Download } from 'lucide-react';

const LogPanel = () => {
  const [logs, setLogs] = useState<LogEntryType[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  
  useEffect(() => {
    const unsubscribe = Logger.subscribe(updatedLogs => {
      setLogs(updatedLogs);
    });
    
    return unsubscribe;
  }, []);
  
  const filteredLogs = filterLevel === 'all'
    ? logs
    : logs.filter(log => log.level === filterLevel);
  
  const clearLogs = () => {
    Logger.clearLogs();
  };
  
  const downloadLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toISOString()}] ${log.level.toUpperCase()}: ${log.message} ${log.details ? JSON.stringify(log.details) : ''}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="border-telecom-primary/10 shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Terminal className="w-5 h-5 mr-2 text-telecom-primary" />
          System Logs
        </CardTitle>
        <div className="flex space-x-2">
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Filter logs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Logs</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
              <SelectItem value="warning">Warnings</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={downloadLogs} title="Download logs">
            <Download size={16} />
          </Button>
          <Button size="sm" variant="outline" onClick={clearLogs} title="Clear logs">
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="bg-white/50 border rounded p-2 max-h-[300px] overflow-y-auto space-y-1 text-sm">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <LogEntry key={index} entry={log} />
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">No logs to display</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogPanel;

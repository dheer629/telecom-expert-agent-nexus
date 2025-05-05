
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
import { Terminal, Trash2, Download, Network, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const LogPanel = () => {
  const [logs, setLogs] = useState<LogEntryType[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showApiOnly, setShowApiOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const unsubscribe = Logger.subscribe(updatedLogs => {
      setLogs(updatedLogs);
    });
    
    return unsubscribe;
  }, []);
  
  const filteredLogs = logs
    .filter(log => filterLevel === 'all' || log.level === filterLevel)
    .filter(log => !showApiOnly || (log.details && 
        typeof log.details === 'object' && 
        (log.details.endpoint || log.details.method || log.message?.toLowerCase().includes('api'))))
    .filter(log => !searchTerm || 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())));
  
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
  
  // Count logs by type for the summary
  const logCounts = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const apiCallCount = logs.filter(log => 
    log.details && 
    typeof log.details === 'object' && 
    (log.details.endpoint || log.details.method || log.message?.toLowerCase().includes('api'))
  ).length;
  
  return (
    <Card className="border-telecom-primary/10 shadow-md h-full overflow-hidden flex flex-col">
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
          <Button 
            size="sm" 
            variant={showApiOnly ? "default" : "outline"} 
            onClick={() => setShowApiOnly(!showApiOnly)} 
            title="Show API calls only"
            className={showApiOnly ? "bg-telecom-primary text-white" : ""}
          >
            <Network size={16} className="mr-1" />
            API
          </Button>
          <Button size="sm" variant="outline" onClick={downloadLogs} title="Download logs">
            <Download size={16} />
          </Button>
          <Button size="sm" variant="outline" onClick={clearLogs} title="Clear logs">
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <div className="px-3 py-2 flex items-center gap-2 border-b border-gray-100">
        <div className="flex items-center gap-1 flex-wrap">
          <Badge variant="outline" className="text-xs bg-gray-50">
            Total: {logs.length}
          </Badge>
          {logCounts.info > 0 && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              Info: {logCounts.info}
            </Badge>
          )}
          {logCounts.debug > 0 && (
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
              Debug: {logCounts.debug}
            </Badge>
          )}
          {logCounts.warning > 0 && (
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              Warnings: {logCounts.warning}
            </Badge>
          )}
          {logCounts.error > 0 && (
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
              Errors: {logCounts.error}
            </Badge>
          )}
          {apiCallCount > 0 && (
            <Badge variant="outline" className="text-xs bg-telecom-primary/10 text-telecom-primary border-telecom-primary/20">
              API Calls: {apiCallCount}
            </Badge>
          )}
        </div>
        <div className="flex-grow">
          <div className="relative">
            <Filter className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
            <Input
              placeholder="Search logs..."
              className="pl-9 h-9 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 overflow-y-auto flex-grow">
        <div className="bg-white/50 border rounded p-2 h-full overflow-y-auto space-y-1 text-sm">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <LogEntry key={index} entry={log} />
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">
              {logs.length > 0 
                ? 'No logs match your current filters'
                : 'No logs to display'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogPanel;

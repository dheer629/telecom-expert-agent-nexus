
// A simple logging service that captures logs for display in the UI
type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  details?: any;
}

class LoggingService {
  private static instance: LoggingService;
  private logs: LogEntry[] = [];
  private subscribers: ((logs: LogEntry[]) => void)[] = [];
  
  private constructor() {}
  
  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }
  
  public log(level: LogLevel, message: string, details?: any) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      details,
    };
    
    this.logs.push(entry);
    this.notifySubscribers();
    
    // Also log to console for debugging during development
    console[level](message, details || '');
  }
  
  public info(message: string, details?: any) {
    this.log('info', message, details);
  }
  
  public warn(message: string, details?: any) {
    this.log('warning', message, details);
  }
  
  public error(message: string, details?: any) {
    this.log('error', message, details);
  }
  
  public debug(message: string, details?: any) {
    this.log('debug', message, details);
  }
  
  public apiCall(method: string, endpoint: string, params?: any, response?: any, error?: any) {
    const level = error ? 'error' : 'info';
    const message = error 
      ? `API ${method} to ${endpoint} failed` 
      : `API ${method} to ${endpoint} completed`;
      
    this.log(level, message, {
      method,
      endpoint,
      params,
      response: response || null,
      error: error || null,
      timestamp: new Date().toISOString()
    });
  }
  
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  public clearLogs() {
    this.logs = [];
    this.notifySubscribers();
  }
  
  public subscribe(callback: (logs: LogEntry[]) => void) {
    this.subscribers.push(callback);
    // Immediately notify the new subscriber with current logs
    callback(this.getLogs());
    
    // Return an unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
  
  private notifySubscribers() {
    const currentLogs = this.getLogs();
    this.subscribers.forEach(callback => callback(currentLogs));
  }
}

export const Logger = LoggingService.getInstance();

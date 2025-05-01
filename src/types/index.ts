
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

// Export the document types from DocumentTypes.ts
export * from './DocumentTypes';

export type OperationMode = 
  | 'Telecom Expert Chat'
  | 'Deep Research'
  | 'DB Stats & Optimize'
  | 'DB Summary & Suggested Qs';

export interface User {
  id: string;
  email: string;
}

export interface AppState {
  chatHistory: ChatMessage[];
  chatDocs: string[];
  chatAttachments: Record<string, boolean>;
  authenticated: boolean;
  user: User | null;
  operationMode: OperationMode;
}

export interface ModelOption {
  name: string;
  maxTokens: number;
  description: string;
}

export interface TelecomExpertResult {
  answer: string;
  chainOfThought?: string;
  citations?: string[];
  actionPlans?: string[];
}

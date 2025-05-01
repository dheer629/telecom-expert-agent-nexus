import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, ChatMessage, OperationMode, User } from '@/types';

interface AppContextProps extends AppState {
  addMessage: (message: ChatMessage) => void;
  setAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  addDocChunk: (chunk: string) => void;
  addAttachment: (key: string) => void;
  setOperationMode: (mode: OperationMode) => void;
  clearChatHistory: () => void;
  clearDocuments: () => void;
}

const initialState: AppState = {
  chatHistory: [],
  chatDocs: [],
  chatAttachments: {},
  authenticated: false,
  user: null,
  operationMode: 'Telecom Expert Chat',
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    // Check for saved state in localStorage
    const savedState = localStorage.getItem('telecomAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        return {
          ...initialState,
          ...parsedState,
        };
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
    return initialState;
  });

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('telecomAppState', JSON.stringify({
      authenticated: state.authenticated,
      user: state.user,
      operationMode: state.operationMode,
    }));
  }, [state.authenticated, state.user, state.operationMode]);

  const addMessage = (message: ChatMessage) => {
    setState((prev) => {
      // If this is updating an existing assistant message, replace it
      if (message.role === 'assistant' && prev.chatHistory.length > 0 && 
          prev.chatHistory[prev.chatHistory.length - 1].role === 'assistant') {
        const updatedHistory = [...prev.chatHistory];
        updatedHistory[updatedHistory.length - 1] = message;
        return {
          ...prev,
          chatHistory: updatedHistory,
        };
      }
      
      // Otherwise add as a new message
      return {
        ...prev,
        chatHistory: [...prev.chatHistory, message],
      };
    });
  };

  const setAuthenticated = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      authenticated: value,
    }));
  };

  const setUser = (user: User | null) => {
    setState((prev) => ({
      ...prev,
      user,
    }));
  };

  const addDocChunk = (chunk: string) => {
    console.log("Adding document chunk:", chunk.substring(0, 30) + "...");
    setState((prev) => ({
      ...prev,
      chatDocs: [...prev.chatDocs, chunk],
    }));
  };

  const addAttachment = (key: string) => {
    setState((prev) => ({
      ...prev,
      chatAttachments: { ...prev.chatAttachments, [key]: true },
    }));
  };

  const setOperationMode = (mode: OperationMode) => {
    setState((prev) => ({
      ...prev,
      operationMode: mode,
    }));
  };

  const clearChatHistory = () => {
    setState((prev) => ({
      ...prev,
      chatHistory: [],
    }));
  };
  
  const clearDocuments = () => {
    setState((prev) => ({
      ...prev,
      chatDocs: [],
      chatAttachments: {},
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addMessage,
        setAuthenticated,
        setUser,
        addDocChunk,
        addAttachment,
        setOperationMode,
        clearChatHistory,
        clearDocuments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

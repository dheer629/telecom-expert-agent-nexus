
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, ChatMessage, OperationMode, User } from '@/types';

interface AppContextProps extends AppState {
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  addDocChunk: (chunk: string) => void;
  addAttachment: (key: string) => void;
  setOperationMode: (mode: OperationMode) => void;
  clearChatHistory: () => void;
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
    }));
  }, [state.authenticated, state.user]);

  const addMessage = (message: ChatMessage) => {
    setState((prev) => ({
      ...prev,
      chatHistory: [...prev.chatHistory, message],
    }));
  };
  
  const updateLastMessage = (content: string) => {
    setState((prev) => {
      if (prev.chatHistory.length === 0) return prev;
      
      const updatedHistory = [...prev.chatHistory];
      const lastIndex = updatedHistory.length - 1;
      
      // Only update if the last message is from the assistant
      if (updatedHistory[lastIndex].role === 'assistant') {
        updatedHistory[lastIndex] = {
          ...updatedHistory[lastIndex],
          content: content,
        };
      }
      
      return {
        ...prev,
        chatHistory: updatedHistory,
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

  return (
    <AppContext.Provider
      value={{
        ...state,
        addMessage,
        updateLastMessage,
        setAuthenticated,
        setUser,
        addDocChunk,
        addAttachment,
        setOperationMode,
        clearChatHistory,
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


import { ChatMessage } from '@/types';

export const formatTimestamp = (): string => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const createUserMessage = (content: string): ChatMessage => {
  return {
    role: 'user',
    content,
    timestamp: formatTimestamp(),
  };
};

export const createAssistantMessage = (content: string): ChatMessage => {
  return {
    role: 'assistant',
    content,
    timestamp: formatTimestamp(),
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        resolve(text || '');
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const mockApiCall = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

export const simulateTyping = (
  text: string,
  onUpdate: (text: string) => void,
  delay = 20
): Promise<void> => {
  return new Promise((resolve) => {
    let currentText = '';
    const characters = text.split('');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index >= characters.length) {
        clearInterval(interval);
        resolve();
        return;
      }
      
      currentText += characters[index];
      onUpdate(currentText);
      index++;
    }, delay);
  });
};

export const modelOptions = [
  {
    name: "mistralai/Mixtral-8x22B-Instruct-v0.1",
    maxTokens: 65536,
    description: "For long context, very large model."
  },
  {
    name: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    maxTokens: 32768,
    description: "Compact version of Mixtral."
  },
  {
    name: "mistralai/Mistral-Nemo-Instruct-2407",
    maxTokens: 32768,
    description: "Fair for tool calling."
  },
  {
    name: "Eri/Mistral-Nemo-Instruct-2407-CPI-3GPP-241213",
    maxTokens: 32768,
    description: "For specific telecom tasks."
  },
  {
    name: "Eri/Mixtral-8x7B-Instruct-v0.1/uc731-pt-241001",
    maxTokens: 32768,
    description: "Variant for telecom."
  },
  {
    name: "Microsoft/phi-4",
    maxTokens: 16384,
    description: "Advanced reasoning with lower token limit."
  },
  {
    name: "Qwen/Qwen2.5-32B-Instruct",
    maxTokens: 12288,
    description: "Likely best for tool calling."
  },
  {
    name: "Qwen/Qwen2.5-14B-Instruct-1M",
    maxTokens: 262144,
    description: "Good for long context (256k tokens)."
  },
  {
    name: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    maxTokens: 12288,
    description: "Fast reasoning, efficient."
  },
  {
    name: "deepseek-ai/DeepSeek-R1",
    maxTokens: 32768,
    description: "Advanced reasoning; scrutinise output."
  }
];

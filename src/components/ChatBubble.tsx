
import { ChatMessage } from '@/types';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { role, content, timestamp } = message;
  
  if (role === 'assistant') {
    return (
      <div className="assistant-bubble fade-in">
        <div className="flex items-start">
          <Bot className="w-5 h-5 mr-2 text-telecom-secondary mt-1" />
          <div>
            <div className="assistant-content">{content}</div>
            {timestamp && <div className="bubble-timestamp">{timestamp}</div>}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="user-bubble fade-in">
      <div className="flex items-start">
        <div className="w-full">
          <div className="user-content">{content}</div>
          {timestamp && <div className="bubble-timestamp">{timestamp}</div>}
        </div>
        <User className="w-5 h-5 ml-2 text-gray-500 mt-1" />
      </div>
    </div>
  );
};

export default ChatBubble;

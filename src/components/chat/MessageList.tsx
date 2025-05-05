
import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import ChatBubble from '../ChatBubble';
import MessageIcon from '../icons/MessageIcon';

interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 bg-gray-50/50 rounded-lg border border-gray-100">
        <MessageIcon className="h-20 w-20 mb-6 text-telecom-primary/40" />
        <h3 className="text-xl font-medium text-telecom-secondary">No messages yet</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md text-center">
          Start a conversation with the Telecom Expert to get tailored insights and information
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-telecom-light/10 rounded-lg border border-gray-100">
      {messages.map((msg, index) => (
        <ChatBubble key={index} message={msg} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;

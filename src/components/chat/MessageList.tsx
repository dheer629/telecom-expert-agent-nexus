
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
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <MessageIcon className="h-16 w-16 mb-4" />
        <h3 className="text-lg font-medium">No messages yet</h3>
        <p className="text-sm">Start a conversation with the Telecom Expert</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <ChatBubble key={index} message={msg} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;

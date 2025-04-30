
import { useRef, useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import ChatBubble from './ChatBubble';
import DocumentUploader from './DocumentUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Plus, SendHorizontal, Save, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { createUserMessage, createAssistantMessage, simulateTyping } from '@/utils/helpers';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { chatHistory, addMessage } = useApp();
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = async (userQuery: string) => {
    setIsTyping(true);
    
    let currentText = '';
    const updateAssistantResponse = (text: string) => {
      currentText = text;
      // Update the last message in chat history which is the assistant's response
      const assistantMessage = createAssistantMessage(text);
      addMessage(assistantMessage);
    };
    
    // Add empty assistant message to show typing indicator
    addMessage(createAssistantMessage(''));
    
    // Simulate typing effect
    const sampleResponses = [
      "Based on the telecom architecture principles, I would recommend implementing a distributed core network with edge computing capabilities. This approach significantly reduces latency for IoT applications while maintaining high reliability.",
      "The 5G network slicing technology you're asking about allows operators to create multiple virtual networks over a shared physical infrastructure. Each slice can be optimized for specific use cases with different performance requirements.",
      "In telecom network planning, the key considerations should include capacity forecasting, coverage optimization, and interference management. I'd suggest starting with a detailed RF survey to understand the propagation characteristics in your deployment area."
    ];
    
    const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    await simulateTyping(randomResponse, updateAssistantResponse, 10);
    
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;
    
    const userMessage = createUserMessage(message);
    addMessage(userMessage);
    setMessage('');
    
    await generateResponse(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContinueAnswer = async () => {
    if (chatHistory.length === 0 || isTyping) return;
    
    toast({
      title: 'Continuing answer',
      description: 'Generating additional information...',
    });
    
    setIsTyping(true);
    
    // Find the last assistant message
    const lastAssistantMessage = [...chatHistory]
      .reverse()
      .find(msg => msg.role === 'assistant');
      
    if (lastAssistantMessage) {
      const continuationText = "Additionally, it's important to consider the scalability aspects of your telecom infrastructure. As user demand grows, your network should be able to adapt without significant reconfiguration. Modern telecom architectures employ virtualized network functions (VNFs) that can be scaled horizontally as needed.";
      
      let currentText = '';
      const updateAssistantResponse = (text: string) => {
        currentText = text;
        addMessage(createAssistantMessage(text));
      };
      
      // Add empty assistant message to show typing indicator
      addMessage(createAssistantMessage(''));
      
      await simulateTyping(continuationText, updateAssistantResponse, 10);
    }
    
    setIsTyping(false);
  };
  
  const handleSaveTranscript = () => {
    if (chatHistory.length === 0) {
      toast({
        title: 'Nothing to save',
        description: 'No conversation to save',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Transcript saved',
      description: 'Conversation transcript has been saved successfully',
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageIcon className="h-16 w-16 mb-4" />
            <h3 className="text-lg font-medium">No messages yet</h3>
            <p className="text-sm">Start a conversation with the Telecom Expert</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))
        )}
        <div ref={messageEndRef} />
      </div>
      
      <Card className="mt-4 border-t">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="search-enabled"
              checked={searchEnabled}
              onCheckedChange={(checked) => setSearchEnabled(checked as boolean)}
            />
            <label
              htmlFor="search-enabled"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Search Internet for additional context
            </label>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Input
                placeholder="Ask a telecom question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="pr-10"
              />
              {isTyping && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || isTyping}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex space-x-2 mt-3">
            <Button 
              variant="outline" 
              onClick={handleContinueAnswer}
              disabled={chatHistory.length === 0 || isTyping}
              className="flex-1"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Continue Answer
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSaveTranscript}
              disabled={chatHistory.length === 0}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Transcript
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Message icon component
const MessageIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default ChatInterface;

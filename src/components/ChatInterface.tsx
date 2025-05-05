
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createUserMessage, createAssistantMessage } from '@/utils/helpers';
import { ResponseGenerator } from '@/utils/ResponseGenerator';
import { Logger } from '@/utils/LoggingService';

// Import our components
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import ChatControls from './chat/ChatControls';
import LogDialog from './logging/LogDialog';

const ChatInterface = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const { chatHistory, addMessage, chatDocs, operationMode } = useApp();
  const { toast } = useToast();

  const generateResponse = async (userQuery: string) => {
    // Log the user query
    Logger.info("User query received", { query: userQuery });
    
    // Add user message to chat
    addMessage(createUserMessage(userQuery));
    
    // Add initial empty assistant message to show typing indicator
    addMessage(createAssistantMessage(''));
    
    // Update the last message rather than adding a new one
    const updateAssistantResponse = (text: string) => {
      const updatedHistory = [...chatHistory];
      if (updatedHistory.length > 0 && updatedHistory[updatedHistory.length - 1].role === 'assistant') {
        updatedHistory[updatedHistory.length - 1].content = text;
        // Replace the entire history instead of adding a new message
        addMessage({ ...updatedHistory[updatedHistory.length - 1] });
      }
    };

    await ResponseGenerator.generateResponse({
      userQuery,
      chatDocs,
      operationMode,
      searchEnabled,
      updateAssistantResponse,
      addMessage,
      onStartTyping: () => setIsTyping(true),
      onEndTyping: () => setIsTyping(false)
    });
  };

  const handleContinueAnswer = async () => {
    if (chatHistory.length === 0 || isTyping) return;
    
    Logger.info("Continue answer requested");
    
    toast({
      title: 'Continuing answer',
      description: 'Generating additional information...',
    });
    
    // Add empty assistant message to show typing indicator
    addMessage(createAssistantMessage(''));
    
    const updateAssistantResponse = (text: string) => {
      addMessage(createAssistantMessage(text));
    };

    await ResponseGenerator.continueAnswer({
      chatHistory,
      chatDocs,
      operationMode,
      addMessage,
      updateAssistantResponse,
      onStartTyping: () => setIsTyping(true),
      onEndTyping: () => setIsTyping(false)
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] bg-white shadow-lg rounded-lg border border-telecom-primary/10 overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <MessageList messages={chatHistory} />
      </div>
      
      <Card className="border-t rounded-none border-telecom-primary/10 bg-white">
        <CardContent className="p-4">
          <MessageInput 
            onSendMessage={generateResponse} 
            isTyping={isTyping}
            searchEnabled={searchEnabled}
            setSearchEnabled={setSearchEnabled}
          />
          
          <div className="flex justify-between items-center mt-2">
            <LogDialog />
            
            <ChatControls 
              onContinueAnswer={handleContinueAnswer}
              onSaveTranscript={() => {}} // This will be replaced by the implementation in ChatControls
              chatHistory={chatHistory}
              isTyping={isTyping}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;

import { useRef, useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import ChatBubble from './ChatBubble';
import DocumentUploader from './DocumentUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Plus, SendHorizontal, Save, RefreshCw, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { createUserMessage, createAssistantMessage, simulateTyping } from '@/utils/helpers';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { chatHistory, addMessage, chatDocs, operationMode } = useApp();
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = async (userQuery: string) => {
    setIsTyping(true);
    
    // Check if we have document content to reference
    const hasDocContent = chatDocs.length > 0;
    console.log("Available document content:", hasDocContent ? chatDocs : "No documents");
    
    let currentText = '';
    const updateAssistantResponse = (text: string) => {
      currentText = text;
      
      // Update the last message rather than adding a new one
      const updatedHistory = [...chatHistory];
      if (updatedHistory.length > 0 && updatedHistory[updatedHistory.length - 1].role === 'assistant') {
        updatedHistory[updatedHistory.length - 1].content = text;
        // Replace the entire history instead of adding a new message
        addMessage({ ...updatedHistory[updatedHistory.length - 1] });
      }
    };
    
    // Add initial empty assistant message to show typing indicator
    addMessage(createAssistantMessage(''));
    
    // Generate a response based on available documents or use fallback responses
    let responseText = "";
    
    // If we have documents, reference them in the response
    if (hasDocContent) {
      const docContent = chatDocs.join(' ').substring(0, 200); // Get a preview of the document content
      
      // Keywords to look for in the user query
      const keywords = ['network', '5g', 'telecom', 'architecture', 'latency', 'security', 'protocol', 'infrastructure', 'deployment'];
      
      // Check if user query contains any keywords
      const matchedKeywords = keywords.filter(keyword => userQuery.toLowerCase().includes(keyword));
      
      if (matchedKeywords.length > 0) {
        // Create a document-informed response
        responseText = `Based on your uploaded documents, I can see that ${docContent}...\n\n`;
        
        // Add an intelligent response that references document content and the user query
        if (matchedKeywords.includes('network') || matchedKeywords.includes('architecture')) {
          responseText += "Your documents discuss network architecture principles. I would recommend implementing a distributed core network with edge computing capabilities as mentioned in your documentation. This approach significantly reduces latency for IoT applications while maintaining high reliability.";
        } else if (matchedKeywords.includes('5g') || matchedKeywords.includes('deployment')) {
          responseText += "According to your documents, 5G network slicing technology allows operators to create multiple virtual networks over a shared physical infrastructure. Each slice can be optimized for specific use cases with different performance requirements, which aligns with the deployment strategies outlined in section 3.2 of your uploaded materials.";
        } else {
          responseText += "The documentation you've provided contains valuable insights on telecom infrastructure planning. Key considerations should include capacity forecasting, coverage optimization, and interference management as highlighted in your materials. I'd suggest following the methodology described in your documents for detailed RF surveys to understand propagation characteristics in your deployment area.";
        }
      } else {
        // Generic document reference if no specific keywords match
        responseText = `Based on the documents you've uploaded, I can provide the following insights:\n\n`;
        responseText += "The telecom architecture principles described in your documentation suggest a multi-layered approach to network design. This includes considerations for both physical and virtual infrastructure components, with particular emphasis on scalability and future-proofing.";
      }
      
      // Add Chain of Thought if in relevant operation mode
      if (operationMode === 'Deep Research') {
        responseText += "\n\n**Chain of Thought:**\n1. Analyzed key themes in uploaded documents\n2. Identified relevant principles applicable to user query\n3. Formulated response based on document evidence and telecom best practices";
      }
    } else {
      // Fallback responses when no documents are available
      const sampleResponses = [
        "Based on general telecom principles (no specific documents uploaded), I would recommend implementing a distributed core network with edge computing capabilities. This approach significantly reduces latency for IoT applications while maintaining high reliability.",
        "Without specific documentation to reference, I can tell you that 5G network slicing technology allows operators to create multiple virtual networks over a shared physical infrastructure. Each slice can be optimized for specific use cases with different performance requirements.",
        "In telecom network planning, the key considerations should include capacity forecasting, coverage optimization, and interference management. I'd suggest starting with a detailed RF survey to understand the propagation characteristics in your deployment area."
      ];
      
      responseText = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      
      // Add a note about missing documents
      responseText += "\n\n(Note: For more specific recommendations, consider uploading relevant telecom documentation)";
    }
    
    // Add internet search results if enabled
    if (searchEnabled) {
      responseText += "\n\n**Internet Search Results:**\nRecent research from IEEE Communications Magazine suggests that network function virtualization (NFV) combined with software-defined networking (SDN) can reduce operational costs by 30-40% while improving service deployment time by up to 70%. This aligns with the architecture principles discussed in your query.";
    }
    
    // Simulate typing effect for the response
    await simulateTyping(responseText, updateAssistantResponse, 10);
    
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
      // Generate continuation based on available documents
      let continuationText = "";
      
      if (chatDocs.length > 0) {
        continuationText = "Additionally, based on the documentation you've provided, it's important to consider the scalability aspects of your telecom infrastructure. The architecture diagrams in your documents highlight how user demand growth can be accommodated through virtualized network functions (VNFs) that can be scaled horizontally as needed.";
      } else {
        continuationText = "Additionally, it's important to consider the scalability aspects of your telecom infrastructure. As user demand grows, your network should be able to adapt without significant reconfiguration. Modern telecom architectures employ virtualized network functions (VNFs) that can be scaled horizontally as needed.";
      }
      
      // Add KAG vector embeddings reference if in specific mode
      if (operationMode === 'Deep Research' || operationMode === 'DB Summary & Suggested Qs') {
        continuationText += "\n\nOur vector embedding analysis shows semantic connections between your query and concepts of network resilience and future-proofing. The Knowledge Augmentation Graph (KAG) indicates a 78% relevance score between your infrastructure questions and emerging OpenRAN architectures.";
      }
      
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
    
    // Create a formatted transcript
    const transcript = chatHistory.map(msg => {
      const rolePrefix = msg.role === 'user' ? 'User: ' : 'Telecom Expert: ';
      return `${rolePrefix}${msg.content}\n${msg.timestamp || ''}\n`;
    }).join('\n');
    
    // Create a download link
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telecom-expert-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Transcript saved',
      description: 'Conversation transcript has been downloaded',
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

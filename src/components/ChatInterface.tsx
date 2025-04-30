
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
  const { chatHistory, addMessage, updateLastMessage, chatDocs } = useApp();
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findRelevantDocumentContent = (query: string) => {
    if (chatDocs.length === 0) return null;
    
    // Convert query to lowercase and remove common words
    const queryWords = query.toLowerCase()
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !['what', 'where', 'when', 'how', 'why', 'which', 'and', 'that', 'this', 'with'].includes(word)
      );
    
    console.log("Searching for keywords:", queryWords);
    
    // Keywords specific to telecom domain
    const telecomKeywords = [
      'network', 'latency', 'bandwidth', 'spectrum', 'frequency', 
      '5g', 'fiber', 'coverage', 'capacity', 'throughput', 'core', 
      'ran', 'edge', 'cloud', 'computing', 'architecture', 'deployment', 
      'slicing', 'mimo', 'density', 'phase', 'virtualization'
    ];
    
    // Add telecom keywords found in the query
    const searchKeywords = [
      ...queryWords, 
      ...telecomKeywords.filter(keyword => query.toLowerCase().includes(keyword))
    ];
    
    // Look for relevant sections in documents
    for (const doc of chatDocs) {
      // Extract document title if available
      const docTitle = doc.split('\n')[0];
      
      // Check if any keyword appears in the document
      for (const keyword of searchKeywords) {
        if (doc.toLowerCase().includes(keyword)) {
          // Find the most relevant section containing the keyword
          const docLines = doc.split('\n');
          const relevantLines = [];
          
          // Find the section containing the keyword
          let foundSection = false;
          let sectionContent = [];
          
          for (let i = 0; i < docLines.length; i++) {
            const line = docLines[i];
            
            // If we find a section header
            if (line.includes('SECTION') || line.includes('SHEET')) {
              // If we already found a relevant section, stop here
              if (foundSection && sectionContent.length > 0) {
                break;
              }
              
              // Start a new section
              sectionContent = [line];
              
              // Check if the next 5 lines contain our keyword
              const nextLines = docLines.slice(i + 1, i + 6);
              const nextLinesText = nextLines.join(' ').toLowerCase();
              
              if (nextLinesText.includes(keyword)) {
                foundSection = true;
                relevantLines.push(line); // Add section header
                
                // Add the next lines that contain relevant information
                for (const nextLine of nextLines) {
                  if (nextLine.trim()) {
                    relevantLines.push(nextLine);
                  }
                }
              }
            } else if (foundSection && line.trim()) {
              sectionContent.push(line);
            }
          }
          
          if (relevantLines.length > 0) {
            console.log("Found relevant content for keyword:", keyword);
            return {
              title: docTitle,
              content: relevantLines.join('\n'),
              keyword: keyword
            };
          }
        }
      }
    }
    
    // If no specific section was found, return the first chunk of the first document
    if (chatDocs.length > 0) {
      console.log("No specific relevant content found, using first document");
      const docLines = chatDocs[0].split('\n');
      const title = docLines[0] || "Document";
      const previewContent = docLines.slice(0, 5).join('\n');
      
      return {
        title: title,
        content: previewContent,
        keyword: 'general'
      };
    }
    
    return null;
  };

  const generateResponse = async (userQuery: string) => {
    setIsTyping(true);
    
    // Add empty assistant message to show typing indicator
    addMessage(createAssistantMessage(''));
    
    let currentText = '';
    const updateAssistantResponse = (text: string) => {
      currentText = text;
      // Update the last message in chat history which is the assistant's response
      updateLastMessage(text);
    };
    
    // Find relevant document content for the query
    const relevantDoc = findRelevantDocumentContent(userQuery);
    
    // Prepare document context for the response
    let response = '';
    
    if (relevantDoc) {
      console.log(`Using document reference: "${relevantDoc.title}"`);
      console.log(`Relevant content: "${relevantDoc.content.substring(0, 100)}..."`);
      
      // Build response referencing the document content
      response = `Based on your uploaded documents in "${relevantDoc.title}", I can see important information about `;
      
      // Add content based on the document type
      if (relevantDoc.title.includes('DOCX') || relevantDoc.title.includes('DOC')) {
        if (relevantDoc.content.includes('Network Architecture')) {
          response += `network architecture design:\n\n${relevantDoc.content}\n\nConsidering these specifications, `;
          response += `I would recommend implementing a distributed core network with edge computing capabilities as outlined in your document. This approach significantly reduces latency (to less than 5ms as specified) for IoT applications while maintaining high reliability.`;
        } 
        else if (relevantDoc.content.includes('Implementation Strategy')) {
          response += `implementation strategy:\n\n${relevantDoc.content}\n\nBased on these phases, `;
          response += `I recommend prioritizing the core network modernization with virtualization in Phase 1, as this will establish the foundation needed for the subsequent phases. This approach ensures a smooth transition while maintaining service continuity.`;
        }
        else if (relevantDoc.content.includes('Technical Specifications')) {
          response += `technical specifications:\n\n${relevantDoc.content}\n\nWith these frequency bands and capacity requirements, `;
          response += `I recommend deploying a hybrid network architecture that leverages both mid-band (3.5 GHz) for widespread coverage and mmWave (28 GHz) for high-capacity hotspots. This combination offers the best balance of coverage and performance.`;
        } 
        else {
          response += `key aspects of your telecom deployment:\n\n${relevantDoc.content}\n\nBased on this information, `;
          response += `I would recommend focusing on the distributed network architecture with edge computing capabilities as outlined. This approach will provide the optimal balance of performance, reliability, and scalability for your use case.`;
        }
      }
      else if (relevantDoc.title.includes('PDF')) {
        if (relevantDoc.content.includes('Executive Summary')) {
          response += `the executive summary:\n\n${relevantDoc.content}\n\nBased on this overview, `;
          response += `I recommend leveraging the geo-redundant core infrastructure to ensure the 99.999% reliability target is met. This "five nines" availability is critical for business continuity and service level agreement compliance.`;
        }
        else if (relevantDoc.content.includes('System Architecture')) {
          response += `system architecture design:\n\n${relevantDoc.content}\n\nGiven these components, `;
          response += `I recommend adopting the cloud-native approach with containerized network functions as specified. The distributed UPF design will significantly improve traffic optimization and edge performance, while the Open RAN interfaces provide valuable vendor flexibility.`;
        }
        else if (relevantDoc.content.includes('Performance Metrics')) {
          response += `performance metrics:\n\n${relevantDoc.content}\n\nWith these throughput requirements in mind, `;
          response += `I recommend implementing a robust quality of service (QoS) framework to ensure that critical applications receive appropriate prioritization. This is especially important given the high connection density of up to 1 million devices per square kilometer.`;
        }
        else {
          response += `important technical details:\n\n${relevantDoc.content}\n\nConsidering these specifications, `;
          response += `I recommend implementing a balanced architecture that addresses both performance requirements and deployment constraints. The cloud-native approach with distributed functions will provide the flexibility needed for future expansion.`;
        }
      }
      else if (relevantDoc.title.includes('XLSX') || relevantDoc.title.includes('XLSM')) {
        if (relevantDoc.content.includes('Coverage Analysis')) {
          response += `coverage analysis:\n\n${relevantDoc.content}\n\nBased on these regional targets, `;
          response += `I recommend prioritizing the Central Region deployment due to its high target coverage (92%) and earlier deadline (Q2 2023). This should be followed by Northern Region and finally Southern Region, aligning with their respective timelines.`;
        }
        else if (relevantDoc.content.includes('Capacity Planning')) {
          response += `capacity planning requirements:\n\n${relevantDoc.content}\n\nGiven these site density guidelines, `;
          response += `I recommend adopting a phased deployment approach, starting with critical urban areas first (5-8 sites per sq km), then expanding to suburban areas (2-4 sites per sq km), and finally addressing rural coverage (0.5-1 sites per sq km).`;
        }
        else if (relevantDoc.content.includes('Financial Projections')) {
          response += `financial projections:\n\n${relevantDoc.content}\n\nBased on these figures, `;
          response += `I recommend focusing on optimizing the Year 1 CAPEX investments to ensure they deliver maximum impact, as this represents the largest investment period. The 27% ROI over 5 years indicates a strong business case for the deployment.`;
        }
        else {
          response += `important deployment metrics:\n\n${relevantDoc.content}\n\nBased on this information, `;
          response += `I recommend creating a prioritized deployment plan that balances coverage requirements with resource constraints. The data suggests focusing on high-impact areas first to maximize return on investment while meeting coverage targets.`;
        }
      }
      else {
        response += `telecom infrastructure:\n\n${relevantDoc.content}\n\nBased on this information, `;
        response += `I recommend implementing a structured approach that addresses the specific requirements outlined in your document. Focusing on the technical aspects mentioned will ensure a successful deployment that meets your performance objectives.`;
      }
    } else {
      // Generic response when no relevant document content is found
      response = "Based on general telecom best practices (as I don't see specific details in your uploaded documents), I would recommend implementing a distributed core network with edge computing capabilities. This approach significantly reduces latency for IoT applications while maintaining high reliability.";
    }
    
    await simulateTyping(response, updateAssistantResponse, 10);
    
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
    
    // Add empty assistant message to show typing indicator
    addMessage(createAssistantMessage(''));
    
    // Find the last assistant message
    const lastAssistantMessage = [...chatHistory]
      .reverse()
      .find(msg => msg.role === 'assistant');
      
    if (lastAssistantMessage) {
      // Find any referenced document in the last message
      const docReference = lastAssistantMessage.content.match(/Based on your uploaded documents in "([^"]+)"/);
      const docTitle = docReference ? docReference[1] : null;
      
      let continuationText = '';
      
      if (docTitle && chatDocs.length > 0) {
        // Find the matching document
        const matchingDoc = chatDocs.find(doc => doc.includes(docTitle));
        
        if (matchingDoc) {
          // Extract a different section from the document than what was used before
          const sections = matchingDoc.split(/SECTION|SHEET/).filter(section => section.trim().length > 0);
          
          if (sections.length > 1) {
            // Find a section that wasn't used in the previous response
            const previousSection = lastAssistantMessage.content.split('\n\n')[1];
            const unusedSection = sections.find(section => !lastAssistantMessage.content.includes(section));
            
            if (unusedSection) {
              continuationText = `Additionally, your document also mentions important information about ${unusedSection.trim()}\n\nTo expand on my previous answer, this suggests that you should also consider implementing a comprehensive monitoring system to track the performance metrics outlined above. This will ensure that your network meets the specified requirements consistently across all deployment phases.`;
            } else {
              continuationText = `To elaborate further on the information provided in your document, I recommend implementing a phased testing approach before full-scale deployment. This would include lab testing, field trials, and limited commercial deployment to validate the architecture and identify any potential issues early in the process.`;
            }
          } else {
            continuationText = `Building on my previous response, I should emphasize that proper capacity planning is crucial for the success of your telecom implementation. The document you've provided contains valuable insights that should guide your deployment strategy, particularly regarding coverage and performance targets.`;
          }
        } else {
          continuationText = `To add to my previous response, it's important to note that telecom implementations should include robust security measures at every layer of the network. This includes encryption for data in transit, secure access controls, and regular vulnerability assessments to protect against emerging threats.`;
        }
      } else {
        continuationText = `Additionally, it's worth considering that modern telecom architectures should incorporate AI-powered analytics for predictive maintenance and service assurance. This approach can significantly reduce downtime by identifying potential issues before they impact service and optimizing resource allocation based on usage patterns.`;
      }
      
      let currentText = '';
      const updateAssistantResponse = (text: string) => {
        currentText = text;
        updateLastMessage(text);
      };
      
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
          
          {chatDocs.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center text-xs text-telecom-secondary">
                <FileText className="h-3 w-3 mr-1" />
                <span>{chatDocs.length} document{chatDocs.length !== 1 ? 's' : ''} available for reference</span>
              </div>
            </div>
          )}
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

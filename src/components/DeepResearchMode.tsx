
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Search, Zap, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import DocumentUploader from './DocumentUploader';
import ChatBubble from './ChatBubble';
import { createUserMessage, createAssistantMessage, simulateTyping } from '@/utils/helpers';

const DeepResearchMode = () => {
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const { addMessage } = useApp();
  const { toast } = useToast();

  const handleResearch = async () => {
    if (!query.trim() || isResearching) return;
    
    setIsResearching(true);
    const userMessage = createUserMessage(query);
    addMessage(userMessage);
    
    toast({
      title: 'Research in progress',
      description: 'Performing deep research analysis...',
    });
    
    // Simulate research response
    const researchResponse = `
Based on your query about 5G network architecture evolution, here's my in-depth analysis:

ANSWER:
5G network architecture represents a significant evolution from previous generations, particularly in its service-based architecture (SBA) approach. The key innovations include:

1. Network slicing capabilities that allow customized virtual networks for different use cases
2. Control and user plane separation (CUPS) enabling more flexible deployment models
3. Edge computing integration reducing latency for time-sensitive applications
4. Cloud-native implementation of network functions improving scalability

This architecture enables operators to support diverse requirements from enhanced mobile broadband (eMBB) to ultra-reliable low-latency communications (URLLC) and massive machine-type communications (mMTC).

ACTION PLANS:
1. For operators migrating from 4G to 5G:
   - Begin with NSA (Non-Standalone) deployment leveraging existing 4G EPC
   - Gradually transition to SA (Standalone) with 5G Core
   - Implement orchestration platforms for network slicing management

2. For vendors developing 5G solutions:
   - Focus on containerized microservices architecture
   - Ensure compliance with 3GPP standards (Release 15, 16, and 17)
   - Develop solutions for automated lifecycle management

3. For enterprise adoption:
   - Evaluate private 5G network deployment options
   - Consider hybrid models with MNO partnerships
   - Identify specific use cases that benefit from 5G capabilities
`;

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
    await simulateTyping(researchResponse, updateAssistantResponse, 5);
    
    setIsResearching(false);
    setQuery('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Zap className="w-5 h-5 mr-2 text-telecom-accent" />
            Deep Research Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="research-query" className="text-sm font-medium">
                Enter your deep research query
              </label>
              <div className="flex space-x-2">
                <Input
                  id="research-query"
                  placeholder="E.g., Analyze the evolution of 5G network architecture and its implications..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isResearching}
                  className="flex-grow"
                />
                <Button
                  onClick={handleResearch}
                  disabled={!query.trim() || isResearching}
                  className="bg-telecom-primary hover:bg-telecom-secondary"
                >
                  {isResearching ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  <span className="ml-2">{isResearching ? 'Researching...' : 'Research'}</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable-search"
                checked={searchEnabled}
                onCheckedChange={(checked) => setSearchEnabled(checked as boolean)}
              />
              <label
                htmlFor="enable-search"
                className="text-sm font-medium leading-none"
              >
                Enable Internet Search
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <DocumentUploader />
      
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-telecom-primary" />
          Research Results
        </h3>
        <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
          {/* This will render chat bubbles like the ChatInterface component */}
        </div>
      </div>
    </div>
  );
};

export default DeepResearchMode;

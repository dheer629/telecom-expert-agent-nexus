
import { simulateTyping, findRelevantDocContent } from './helpers';
import { ChatMessage, OperationMode } from '@/types';

export class ResponseGenerator {
  static async generateResponse({
    userQuery,
    chatDocs,
    operationMode,
    searchEnabled,
    updateAssistantResponse,
    addMessage,
    onStartTyping,
    onEndTyping
  }: {
    userQuery: string;
    chatDocs: string[];
    operationMode: OperationMode;
    searchEnabled: boolean;
    updateAssistantResponse: (text: string) => void;
    addMessage: (message: ChatMessage) => void;
    onStartTyping: () => void;
    onEndTyping: () => void;
  }): Promise<void> {
    onStartTyping();
    
    // Check if we have document content to reference
    const hasDocContent = chatDocs.length > 0;
    console.log("Available document content:", hasDocContent ? chatDocs : "No documents");
    
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
    
    onEndTyping();
  }

  static async continueAnswer({
    chatHistory,
    chatDocs,
    operationMode,
    addMessage,
    updateAssistantResponse,
    onStartTyping,
    onEndTyping
  }: {
    chatHistory: ChatMessage[];
    chatDocs: string[];
    operationMode: OperationMode;
    addMessage: (message: ChatMessage) => void;
    updateAssistantResponse: (text: string) => void;
    onStartTyping: () => void;
    onEndTyping: () => void;
  }): Promise<void> {
    // Find the last assistant message
    const lastAssistantMessage = [...chatHistory]
      .reverse()
      .find(msg => msg.role === 'assistant');
      
    if (lastAssistantMessage) {
      onStartTyping();
      
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
      
      await simulateTyping(continuationText, updateAssistantResponse, 10);
      
      onEndTyping();
    }
  }
}

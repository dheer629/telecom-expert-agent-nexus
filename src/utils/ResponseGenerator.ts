// Existing code, but now with added logging
import { ChatMessage, OperationMode } from "@/types";
import { createAssistantMessage } from "./helpers";
import { Logger } from "./LoggingService";

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
  }) {
    Logger.info("Generating response", { 
      userQuery, 
      operationMode, 
      searchEnabled,
      docsCount: chatDocs.length 
    });
    onStartTyping();

    try {
      // Simulate typing of the response
      let fullResponse = '';
      
      // Here you would normally make an API call to your LLM service
      // For now, we'll simulate a response based on the operation mode
      switch (operationMode) {
        case 'Telecom Expert Chat':
          fullResponse = `Based on my analysis${searchEnabled ? ' and internet search' : ''}, the 5G network architecture consists of several key components including the Radio Access Network (RAN), User Plane Function (UPF), and Control Plane functions. 
          
The main advantages of 5G include:
- Enhanced Mobile Broadband (eMBB) providing higher data rates
- Ultra-Reliable Low Latency Communications (URLLC) for time-critical applications
- Massive Machine Type Communications (mMTC) for IoT connectivity
          
${chatDocs.length > 0 ? 'I found relevant information in your uploaded documents that supports this response.' : 'Consider uploading technical documentation for more specific answers.'}`;
          break;
          
        case 'Deep Research':
          fullResponse = `# Deep Research Analysis
          
## Key Findings on 5G Network Architecture
Based on comprehensive analysis of available sources${searchEnabled ? ', including recent technical publications and standards documents from internet search,' : ''}, the 5G network architecture represents a significant evolution from previous generations.

### Core Architectural Components:
1. Service-Based Architecture (SBA) that enables modularity
2. Network slicing for dedicated virtual networks based on use case
3. Multi-access Edge Computing (MEC) for reduced latency

### Technical Implementation Challenges:
- Spectrum allocation complexity
- Integration with legacy 4G infrastructure
- Security considerations for network slicing

${chatDocs.length > 0 ? 'The uploaded documentation provides valuable insights on implementation challenges and mitigation strategies.' : 'For more detailed analysis, technical specifications would be beneficial.'}`;
          break;
          
        default:
          fullResponse = `I'm currently in ${operationMode} mode. Please specify what information you need about telecom networks or systems.`;
      }
      
      Logger.debug("Response generated successfully");
      
      // Simulate gradual typing for UI
      await simulateTypingForUI(fullResponse, updateAssistantResponse);
    } catch (error) {
      Logger.error("Error generating response", error);
      updateAssistantResponse("I'm sorry, there was an error generating a response. Please try again.");
    } finally {
      onEndTyping();
    }
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
  }) {
    Logger.info("Continuing answer", { 
      operationMode,
      docsCount: chatDocs.length,
      historyLength: chatHistory.length
    });
    onStartTyping();
    
    try {
      // Extract the last user and assistant messages for context
      const lastUserMessage = chatHistory.filter(m => m.role === 'user').pop();
      const lastAssistantMessage = chatHistory.filter(m => m.role === 'assistant').pop();
      
      Logger.debug("Context for continuation", {
        userMessage: lastUserMessage?.content,
        assistantMessage: lastAssistantMessage?.content.substring(0, 100) + '...'
      });
      
      // Here you would make an API call to your LLM service for continuation
      // For now, we'll simulate a continuation response
      const continuationResponse = `To expand on the previous points about 5G architecture:

The separation of control plane and user plane (CUPS) is a key design principle that enables more flexible deployment options and better scaling.

Additional benefits include:
- Network Function Virtualization (NFV) allowing software-based network functions
- Software-Defined Networking (SDN) for centralized network control
- Dynamic network slicing to support diverse use cases simultaneously

Implementation typically follows either Non-Standalone (NSA) or Standalone (SA) approaches, with many operators taking a phased approach starting with NSA and evolving to SA.

${chatDocs.length > 0 ? 'Your uploaded documentation provides specific examples of successful implementation strategies.' : 'For more technical details, industry standard documents would be useful to review.'}`;

      // Simulate gradual typing for UI
      await simulateTypingForUI(continuationResponse, updateAssistantResponse);
      Logger.debug("Continuation generated successfully");
    } catch (error) {
      Logger.error("Error continuing response", error);
      updateAssistantResponse("I'm sorry, there was an error continuing the response. Please try again.");
    } finally {
      onEndTyping();
    }
  }
}

// Helper function to simulate typing effect for UI
async function simulateTypingForUI(text: string, updateCallback: (text: string) => void) {
  const words = text.split(' ');
  let currentText = '';
  
  // Log the start of typing simulation
  Logger.debug("Starting typing simulation", { textLength: text.length });
  
  for (let i = 0; i < words.length; i++) {
    currentText += (i === 0 ? '' : ' ') + words[i];
    updateCallback(currentText);
    
    // Random delay between 10-30ms per word for a natural typing effect
    const delay = Math.floor(Math.random() * 20) + 10;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Occasionally log progress for very long responses
    if (i % 50 === 0 && i > 0) {
      Logger.debug(`Typing simulation progress: ${i}/${words.length} words`);
    }
  }
  
  Logger.debug("Typing simulation completed");
}

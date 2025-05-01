
import { Button } from '@/components/ui/button';
import { ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types';

interface ChatControlsProps {
  onContinueAnswer: () => void;
  onSaveTranscript: () => void;
  chatHistory: ChatMessage[];
  isTyping: boolean;
}

const ChatControls = ({ 
  onContinueAnswer, 
  onSaveTranscript, 
  chatHistory, 
  isTyping 
}: ChatControlsProps) => {
  const { toast } = useToast();

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
    <div className="flex space-x-2 mt-3">
      <Button 
        variant="outline" 
        onClick={onContinueAnswer}
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
  );
};

export default ChatControls;

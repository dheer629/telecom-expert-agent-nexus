
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  searchEnabled: boolean;
  setSearchEnabled: (enabled: boolean) => void;
}

const MessageInput = ({ 
  onSendMessage, 
  isTyping, 
  searchEnabled, 
  setSearchEnabled 
}: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim() || isTyping) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
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
    </>
  );
};

export default MessageInput;


import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';
import LogPanel from './LogPanel';

const LogDialog = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 hover:bg-telecom-primary/10 border-telecom-primary/20"
          title="View system logs and API calls"
        >
          <Terminal className="h-4 w-4 text-telecom-primary" />
          System Logs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center">
            <Terminal className="h-5 w-5 mr-2 text-telecom-primary" />
            System Logs & API Monitoring
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <LogPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogDialog;

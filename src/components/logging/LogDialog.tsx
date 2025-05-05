
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
          className="gap-2"
        >
          <Terminal className="h-4 w-4" />
          System Logs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>System Logs</DialogTitle>
        </DialogHeader>
        <LogPanel />
      </DialogContent>
    </Dialog>
  );
};

export default LogDialog;

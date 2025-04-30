
import { useApp } from '@/context/AppContext';
import { OperationMode } from '@/types';
import { MessageSquare, Search, BarChart, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ModeSelector = () => {
  const { operationMode, setOperationMode } = useApp();

  const modeOptions: { 
    value: OperationMode; 
    icon: React.ReactNode; 
    title: string; 
    description: string;
  }[] = [
    {
      value: 'Telecom Expert Chat',
      icon: <MessageSquare className="w-5 h-5 text-telecom-primary" />,
      title: 'Telecom Expert Chat',
      description: 'Interactive chat with a telecom expert, enhanced by document context and conversation history.'
    },
    {
      value: 'Deep Research',
      icon: <Search className="w-5 h-5 text-telecom-primary" />,
      title: 'Deep Research',
      description: 'In-depth analysis with detailed reasoning, action plans, and internet search integration.'
    },
    {
      value: 'DB Stats & Optimize',
      icon: <BarChart className="w-5 h-5 text-telecom-primary" />,
      title: 'DB Stats & Optimize',
      description: 'View database statistics and optimize stored data.'
    },
    {
      value: 'DB Summary & Suggested Qs',
      icon: <FileText className="w-5 h-5 text-telecom-primary" />,
      title: 'DB Summary & Suggested Qs',
      description: 'Summarize stored transcripts and suggest follow-up questions.'
    }
  ];

  const handleModeChange = (value: string) => {
    setOperationMode(value as OperationMode);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Operation Modes</CardTitle>
        <CardDescription>Select how you want to interact with the Telecom Expert</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={operationMode} 
          onValueChange={handleModeChange}
          className="space-y-3"
        >
          {modeOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3 p-3 rounded-md border border-gray-200 hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label 
                htmlFor={option.value} 
                className="flex flex-1 items-center cursor-pointer"
              >
                <div className="mr-3">{option.icon}</div>
                <div>
                  <div className="font-medium">{option.title}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ModeSelector;

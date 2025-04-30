
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Cpu } from 'lucide-react';
import { modelOptions } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';

const ModelSelector = () => {
  const [selectedModel, setSelectedModel] = useState(modelOptions[9].name); // Default to the last model
  
  const formatModelName = (fullName: string) => {
    // Extract the last part of the model name for cleaner display
    const parts = fullName.split('/');
    return parts[parts.length - 1];
  };
  
  const getModelDescription = (name: string) => {
    const model = modelOptions.find(m => m.name === name);
    return model ? model.description : '';
  };
  
  const getMaxTokens = (name: string) => {
    const model = modelOptions.find(m => m.name === name);
    return model ? model.maxTokens.toLocaleString() : '';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Brain className="w-5 h-5 mr-2 text-telecom-primary" />
          LLM Model Selection
        </CardTitle>
        <CardDescription>
          Choose the model that best fits your task requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {modelOptions.map(model => (
              <SelectItem key={model.name} value={model.name}>
                <div className="flex items-center">
                  <span>{formatModelName(model.name)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-telecom-primary" />
            <span className="text-sm font-medium">Model details:</span>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 rounded-md">
            <div className="text-sm">{selectedModel}</div>
            <div className="text-xs text-muted-foreground mt-1">{getModelDescription(selectedModel)}</div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Max tokens: {getMaxTokens(selectedModel)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelSelector;

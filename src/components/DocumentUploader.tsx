
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { FilePlus, FileText, X, Check } from 'lucide-react';
import { extractTextFromFile, formatFileSize, mockApiCall } from '@/utils/helpers';
import { Progress } from '@/components/ui/progress';

const DocumentUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [processedDocs, setProcessedDocs] = useState<string[]>([]);
  const { addDocChunk, addAttachment, chatDocs } = useApp();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const extractDocumentContent = async (file: File): Promise<string> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    
    // In a real app, different extractors would be used for different file types
    // For this demo, we'll simulate extraction based on file type
    try {
      switch (fileExtension) {
        case 'txt':
          return await extractTextFromFile(file);
          
        case 'docx':
        case 'doc':
          // Simulate DOCX content extraction
          await new Promise(r => setTimeout(r, 500)); // Simulate processing time
          return `Document content extracted from ${file.name}: This is simulated content from ${file.name} that would be extracted using appropriate document parsing libraries. It contains information about telecom network architecture, 5G deployment strategies, and optimization techniques for modern telecommunications infrastructure.`;
          
        case 'pdf':
          // Simulate PDF content extraction
          await new Promise(r => setTimeout(r, 800)); // Simulate processing time
          return `PDF content extracted from ${file.name}: This PDF document discusses telecom protocols, network slicing implementation details, and security considerations for telecom infrastructure. The document includes sections on latency optimization, bandwidth management, and service level agreements for enterprise telecom deployments.`;
          
        case 'xlsx':
        case 'xlsm':
          // Simulate Excel content extraction
          await new Promise(r => setTimeout(r, 600)); // Simulate processing time
          return `Spreadsheet data extracted from ${file.name}: This spreadsheet contains technical specifications for telecom equipment, performance metrics for different network configurations, and comparative analysis of various deployment scenarios. Key metrics include latency, throughput, and reliability figures for different architecture options.`;
          
        default:
          return `Unable to extract content from ${file.name} due to unsupported format. The system has registered this file but cannot process its contents for knowledge enhancement.`;
      }
    } catch (error) {
      console.error(`Error extracting content from ${file.name}:`, error);
      return `Error processing ${file.name}. The file may be corrupted or in an unsupported format.`;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one file to upload',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setProcessedDocs([]);
    
    const initialProgress = files.reduce((acc, file) => {
      acc[file.name] = 0;
      return acc;
    }, {} as Record<string, number>);
    
    setUploadProgress(initialProgress);
    
    for (const file of files) {
      try {
        // Simulate progress updates
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: i,
          }));
          await new Promise(r => setTimeout(r, 50)); // Small delay for visual effect
        }
        
        // Extract content from the file
        const content = await extractDocumentContent(file);
        console.log(`Extracted content from ${file.name}:`, content.substring(0, 100) + '...');
        
        // Add the extracted content to the context
        addDocChunk(content);
        
        // Add to processed attachments
        const fileKey = `${file.name}_${file.size}`;
        addAttachment(fileKey);
        
        // Add to processed docs list for display
        setProcessedDocs(prev => [...prev, file.name]);
        
        toast({
          title: 'File processed successfully',
          description: `${file.name} has been added to context`,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: 'Error processing file',
          description: `Failed to process ${file.name}`,
          variant: 'destructive',
        });
      }
    }
    
    setIsUploading(false);
    setFiles([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText className="w-5 h-5 mr-2 text-telecom-primary" />
          Document Upload
        </CardTitle>
        <CardDescription>
          Upload documents to enhance the conversation context
          {chatDocs.length > 0 && (
            <span className="block text-green-600 text-xs mt-1">
              {chatDocs.length} document{chatDocs.length !== 1 ? 's' : ''} in context
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div 
            className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".docx,.doc,.pdf,.xlsx,.xlsm,.txt"
            />
            <FilePlus className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400">
              DOCX, DOC, PDF, XLSX, XLSM, TXT
            </p>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Files</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-telecom-primary" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    {isUploading ? (
                      <div className="w-24">
                        <Progress value={uploadProgress[file.name] || 0} className="h-2" />
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {processedDocs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-600">Recently Processed</h4>
              <ul className="space-y-1">
                {processedDocs.map((docName, index) => (
                  <li key={index} className="flex items-center text-sm text-green-600">
                    <Check className="w-4 h-4 mr-2" />
                    <span className="truncate">{docName}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="w-full"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Upload & Process
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;

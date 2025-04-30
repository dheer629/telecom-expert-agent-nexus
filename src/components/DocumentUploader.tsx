
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
          await new Promise(r => setTimeout(r, 100)); // Small delay for visual effect
        }
        
        // In a real app, this would process and store the file
        // For this demo, we'll just extract text from text files
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        
        if (fileExtension === 'txt') {
          const text = await extractTextFromFile(file);
          addDocChunk(text);
        } else {
          // For other file types, we'll just simulate success
          console.log(`Processing file: ${file.name}`);
          // Add mock text to demonstrate that documents are used as references
          addDocChunk(`Document content from ${file.name} would be used as reference here.`);
        }
        
        // Add to processed attachments
        const fileKey = `${file.name}_${file.size}`;
        addAttachment(fileKey);
        
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
          
          {chatDocs.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Reference Documents</h4>
                <span className="text-xs text-green-600 font-medium">{chatDocs.length} chunks available</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Documents will be used as reference to enhance responses
              </p>
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

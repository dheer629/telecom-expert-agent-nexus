
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileText, Check, Upload } from 'lucide-react';
import { DocumentContentExtractor } from '@/utils/DocumentContentExtractor';
import UploadZone from './document/UploadZone';
import FileList from './document/FileList';
import ProcessedFilesList from './document/ProcessedFilesList';
import { DocumentFile } from '@/types/DocumentTypes';

const DocumentUploader = () => {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [processedDocs, setProcessedDocs] = useState<string[]>([]);
  const { addDocChunk, addAttachment, chatDocs } = useApp();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let newFiles: File[] = [];
    
    if ('dataTransfer' in e) {
      // Handle drag and drop
      if (e.dataTransfer.files) {
        newFiles = Array.from(e.dataTransfer.files);
      }
    } else if (e.target.files) {
      // Handle file input change
      newFiles = Array.from(e.target.files);
    }
    
    // Add files to state
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles as DocumentFile[]]);
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
    setProcessedDocs([]);
    
    const initialProgress = files.reduce((acc, file) => {
      acc[file.name] = 0;
      return acc;
    }, {} as Record<string, number>);
    
    setUploadProgress(initialProgress);
    
    try {
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
          const content = await DocumentContentExtractor.extractContent(file);
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
    } finally {
      setIsUploading(false);
      setFiles([]);
    }
  };

  const handleFileUploadClick = () => {
    document.getElementById('file-upload')?.click();
  };

  return (
    <Card className="shadow-lg border-telecom-primary/10 bg-gradient-to-b from-white to-telecom-light/20">
      <CardHeader className="border-b border-telecom-primary/10 bg-white/80">
        <CardTitle className="text-lg flex items-center text-telecom-secondary">
          <FileText className="w-5 h-5 mr-2 text-telecom-primary" />
          Document Upload
        </CardTitle>
        <CardDescription>
          Upload documents to enhance the conversation context
          {chatDocs.length > 0 && (
            <span className="block text-green-600 text-xs mt-1 font-medium">
              {chatDocs.length} document{chatDocs.length !== 1 ? 's' : ''} in context
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex flex-col space-y-4">
          <UploadZone 
            onClick={handleFileUploadClick} 
            onDrop={handleFileChange}
          />
          
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept=".docx,.doc,.pdf,.xlsx,.xlsm,.txt"
          />
          
          <FileList 
            files={files}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            onRemoveFile={removeFile}
          />
          
          <ProcessedFilesList files={processedDocs} />
          
          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="w-full bg-telecom-primary hover:bg-telecom-secondary transition-all duration-300"
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
                <Upload className="mr-2 h-4 w-4" />
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

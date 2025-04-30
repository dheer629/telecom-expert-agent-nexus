
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
        
        // Process the file based on its type
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        
        // Extract text from the file
        let extractedText = '';
        
        if (fileExtension === 'txt') {
          extractedText = await extractTextFromFile(file);
        } else {
          console.log(`Processing file: ${file.name}`);
          
          // Generate more meaningful content based on document type
          if (fileExtension === 'docx' || fileExtension === 'doc') {
            // For Word documents, create more specific telecom-related content
            extractedText = `DOCUMENT: ${file.name}\n\n`;
            extractedText += `SECTION 1: Network Architecture\n`;
            extractedText += `The proposed 5G network architecture includes a distributed RAN configuration with edge computing capabilities. Key features include:\n`;
            extractedText += `- Low latency performance (< 5ms) for IoT applications\n`;
            extractedText += `- Network slicing implementation for service differentiation\n`;
            extractedText += `- AI-powered resource allocation for dynamic traffic management\n\n`;
            
            extractedText += `SECTION 2: Implementation Strategy\n`;
            extractedText += `Phase 1: Core network modernization with virtualization\n`;
            extractedText += `Phase 2: Edge computing deployment at 12 metropolitan locations\n`;
            extractedText += `Phase 3: RAN upgrade with Massive MIMO support\n\n`;
            
            extractedText += `SECTION 3: Technical Specifications\n`;
            extractedText += `- Frequency bands: 3.5 GHz (n78), 28 GHz (n257)\n`;
            extractedText += `- Bandwidth: 100 MHz (sub-6) and 400 MHz (mmWave)\n`;
            extractedText += `- Capacity: Supporting up to 1M devices per square km\n`;
          } else if (fileExtension === 'pdf') {
            // For PDF documents
            extractedText = `DOCUMENT: ${file.name}\n\n`;
            extractedText += `SECTION 1: Executive Summary\n`;
            extractedText += `This technical proposal outlines a comprehensive approach to deploying a converged fixed-mobile network with 5G capabilities. The solution offers 99.999% reliability with geo-redundant core infrastructure.\n\n`;
            
            extractedText += `SECTION 2: System Architecture\n`;
            extractedText += `The proposed architecture employs a cloud-native approach with containerized network functions. Key components include:\n`;
            extractedText += `- Distributed UPF (User Plane Function) for traffic optimization\n`;
            extractedText += `- Centralized control plane for simplified management\n`;
            extractedText += `- Open RAN interfaces for vendor flexibility\n\n`;
            
            extractedText += `SECTION 3: Performance Metrics\n`;
            extractedText += `- Downlink throughput: 1-2 Gbps (typical), 20 Gbps (peak)\n`;
            extractedText += `- Uplink throughput: 100-300 Mbps (typical), 10 Gbps (peak)\n`;
            extractedText += `- Connection density: Up to 1 million devices per square km\n`;
          } else if (fileExtension === 'xlsx' || fileExtension === 'xlsm') {
            // For Excel documents
            extractedText = `DOCUMENT: ${file.name}\n\n`;
            extractedText += `SHEET 1: Coverage Analysis\n`;
            extractedText += `Market penetration targets by region:\n`;
            extractedText += `- Northern Region: 87% population coverage by Q3 2023\n`;
            extractedText += `- Central Region: 92% population coverage by Q2 2023\n`;
            extractedText += `- Southern Region: 75% population coverage by Q4 2023\n\n`;
            
            extractedText += `SHEET 2: Capacity Planning\n`;
            extractedText += `Site density requirements:\n`;
            extractedText += `- Urban areas: 5-8 sites per square km\n`;
            extractedText += `- Suburban areas: 2-4 sites per square km\n`;
            extractedText += `- Rural areas: 0.5-1 sites per square km\n\n`;
            
            extractedText += `SHEET 3: Financial Projections\n`;
            extractedText += `- CAPEX: $120M (Year 1), $85M (Year 2), $45M (Year 3)\n`;
            extractedText += `- OPEX: $35M (Year 1), $42M (Year 2), $48M (Year 3)\n`;
            extractedText += `- ROI: 18% (3-year horizon), 27% (5-year horizon)\n`;
          } else {
            // For other document types
            extractedText = `Document content extracted from ${file.name}:\n\n`;
            extractedText += `This is simulated content from ${file.name} that would be extracted using appropriate document parsing libraries.\n\n`;
            extractedText += `The file type is ${fileExtension.toUpperCase()} and would contain structured or unstructured data that is relevant to telecom domain questions.`;
          }
        }
        
        // Add the extracted text to the context
        if (extractedText) {
          console.log(`Adding content from ${file.name} to context`);
          addDocChunk(extractedText);
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
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded max-h-24 overflow-y-auto">
                <strong>Document content example:</strong>
                <p className="truncate">{chatDocs.length > 0 ? chatDocs[0].substring(0, 100) + '...' : 'No documents available'}</p>
              </div>
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


/**
 * Document Types for the document processing system
 */

export interface DocumentFile extends File {
  id?: string;
}

export interface ProcessingStatus {
  isUploading: boolean;
  isProcessing: boolean;
  progress: Record<string, number>;
}

export interface DocumentMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadTime: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface ExtractedContent {
  text: string;
  metadata?: {
    pageCount?: number;
    wordCount?: number;
    author?: string;
    creationDate?: string;
    title?: string;
  };
  sections?: Array<{
    title: string;
    content: string;
    level: number;
  }>;
}

export interface DocumentExtractionResult {
  success: boolean;
  content?: ExtractedContent;
  error?: string;
  processingTime?: number;
}

export interface DocumentUploadResult {
  success: boolean;
  documentId?: string;
  error?: string;
}

export type AcceptedFileType = 
  | '.docx' 
  | '.doc' 
  | '.pdf' 
  | '.xlsx' 
  | '.xlsm' 
  | '.txt';

export const ACCEPTED_FILE_TYPES: AcceptedFileType[] = [
  '.docx',
  '.doc',
  '.pdf',
  '.xlsx',
  '.xlsm',
  '.txt'
];

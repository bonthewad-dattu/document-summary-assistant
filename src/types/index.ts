export interface DocumentSummary {
  extractedText: string;
  summary: string;
  keyPoints: string[];
  summaryLength: 'short' | 'medium' | 'long';
}

export interface ProcessingState {
  isProcessing: boolean;
  stage: 'idle' | 'uploading' | 'extracting' | 'summarizing' | 'complete' | 'error';
  progress: number;
  error?: string;
}

export interface FileUpload {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface SummaryOptions {
  length: 'short' | 'medium' | 'long';
  includeKeyPoints: boolean;
}
'use client';

import React, { useCallback, useState } from 'react';
import { validateFile, formatFileSize } from '@/lib/utils';
import { SUPPORTED_FILE_TYPES } from '@/lib/constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFile = useCallback((file: File) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    setError('');
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const supportedTypes = 'PDF, PNG, JPG, JPEG, GIF, WebP';

  return (
    <div className="w-full">
      <div
        className={`
          upload-zone p-8 text-center cursor-pointer
          ${isDragOver ? 'drag-over' : ''}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          
          <div>
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {isProcessing ? 'Processing Document...' : 'Upload Document'}
            </p>
            <p className="text-gray-600">
              Drag and drop your file here or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-2">
              PDF files: Full text extraction • Images: OCR processing
            </p>
          </div>
          
          <div className="text-sm text-gray-500 bg-white/50 rounded px-3 py-1 inline-block">
            Supported: {supportedTypes} • Max: 1GB
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};
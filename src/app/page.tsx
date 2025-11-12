'use client';

import React, { useState, useCallback } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { SummaryView } from '@/components/SummaryView';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { DocumentSummary, ProcessingState, SummaryOptions } from '@/types';

// Define API endpoints locally if not in constants
const API_ENDPOINTS = {
  PROCESS_DOCUMENT: '/api/process-document',
  GENERATE_SUMMARY: '/api/generate-summary',
};

export default function Home() {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    stage: 'idle',
    progress: 0
  });
  const [summaryData, setSummaryData] = useState<DocumentSummary | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [summaryOptions, setSummaryOptions] = useState<SummaryOptions>({
    length: 'medium',
    includeKeyPoints: true
  });

  const processDocument = useCallback(async (file: File) => {
    setProcessingState({
      isProcessing: true,
      stage: 'uploading',
      progress: 10
    });

    try {
      setFileName(file.name);

      // Step 1: Upload and process document
      setProcessingState(prev => ({ ...prev, stage: 'extracting', progress: 30 }));
      
      const formData = new FormData();
      formData.append('file', file);

      const processResponse = await fetch(API_ENDPOINTS.PROCESS_DOCUMENT, {
        method: 'POST',
        body: formData,
      });

      if (!processResponse.ok) {
        const errorData = await processResponse.json();
        throw new Error(errorData.error || 'Failed to process document');
      }

      const processResult = await processResponse.json();
      
      // Step 2: Generate summary
      setProcessingState(prev => ({ ...prev, stage: 'summarizing', progress: 70 }));

      const summaryResponse = await fetch(API_ENDPOINTS.GENERATE_SUMMARY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: processResult.extractedText,
          length: summaryOptions.length,
          includeKeyPoints: summaryOptions.includeKeyPoints
        }),
      });

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const summaryResult = await summaryResponse.json();

      // Final result
      setSummaryData({
        extractedText: processResult.extractedText,
        summary: summaryResult.summary,
        keyPoints: summaryResult.keyPoints,
        summaryLength: summaryOptions.length
      });

      setProcessingState({
        isProcessing: false,
        stage: 'complete',
        progress: 100
      });

    } catch (error) {
      console.error('Processing error:', error);
      setProcessingState({
        isProcessing: false,
        stage: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }, [summaryOptions]);

  const resetState = useCallback(() => {
    setProcessingState({
      isProcessing: false,
      stage: 'idle',
      progress: 0
    });
    setSummaryData(null);
    setFileName('');
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    processDocument(file);
  }, [processDocument]);

const getStageMessage = (stage: string) => {
  const messages = {
    uploading: 'Uploading document...',
    extracting: 'Extracting text (this may take a moment for large files)...',
    summarizing: 'Generating AI summary...',
    complete: 'Complete!',
    error: 'Error occurred'
  };
  return messages[stage as keyof typeof messages] || 'Processing...';
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              DocSum AI
            </h1>
            <p className="text-xl text-white/90">
              Transform documents into intelligent summaries with AI
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Options Panel */}
        {!processingState.isProcessing && processingState.stage === 'idle' && !summaryData && (
          <div className="professional-card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary Length
                </label>
                <select
                  value={summaryOptions.length}
                  onChange={(e) => setSummaryOptions(prev => ({
                    ...prev,
                    length: e.target.value as 'short' | 'medium' | 'long'
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="short">Short (1-2 sentences)</option>
                  <option value="medium">Medium (1 paragraph)</option>
                  <option value="long">Long (detailed)</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeKeyPoints"
                  checked={summaryOptions.includeKeyPoints}
                  onChange={(e) => setSummaryOptions(prev => ({
                    ...prev,
                    includeKeyPoints: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeKeyPoints" className="ml-2 block text-sm text-gray-700">
                  Include key points
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {!summaryData && processingState.stage !== 'complete' && (
          <div className="professional-card p-6 mb-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              isProcessing={processingState.isProcessing}
            />
          </div>
        )}

        {/* Processing State */}
        {processingState.isProcessing && (
          <div className="professional-card p-8 mb-6">
            <div className="text-center">
              <LoadingSpinner size="lg" message={getStageMessage(processingState.stage)} />
              
              {/* Progress Bar */}
              <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${processingState.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>Uploading</span>
                <span>Extracting</span>
                <span>Summarizing</span>
                <span>Complete</span>
              </div>
              
              <p className="mt-4 text-sm text-gray-600">
                Stage: {processingState.stage} • {Math.round(processingState.progress)}% complete
              </p>
              
              {/* Estimated time remaining */}
              {processingState.stage !== 'complete' && (
                <p className="mt-2 text-xs text-gray-500">
                  This usually takes 10-30 seconds depending on document size...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {processingState.stage === 'error' && processingState.error && (
          <div className="mb-6">
            <ErrorMessage
              title="Processing Error"
              message={processingState.error}
              onRetry={resetState}
            />
          </div>
        )}

        {/* Results */}
        {summaryData && processingState.stage === 'complete' && (
          <div className="space-y-6">
            <SummaryView
              summaryData={summaryData}
              fileName={fileName}
            />
            
            <div className="text-center">
              <button
                onClick={resetState}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Process Another Document
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-white/80">
            <p>DocSum AI - AI-Powered Document Summarization</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
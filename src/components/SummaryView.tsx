'use client';

import React, { useState } from 'react';
import { DocumentSummary } from '@/types';
import { truncateText } from '@/lib/utils';

interface SummaryViewProps {
  summaryData: DocumentSummary;
  fileName: string;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summaryData, fileName }) => {
  const [copiedSection, setCopiedSection] = useState<string>('');

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getLengthLabel = (length: string) => {
    const labels = {
      short: 'Short',
      medium: 'Medium', 
      long: 'Detailed'
    };
    return labels[length as keyof typeof labels] || length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="professional-card p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Summary</h2>
            <p className="text-gray-600">
              File: <span className="font-medium">{fileName}</span> • 
              Summary: <span className="font-medium">{getLengthLabel(summaryData.summaryLength)}</span>
              {/* ADDED: Processing method display */}
              {summaryData.processingMethod && (
                <> • Processing: <span className="font-medium">{summaryData.processingMethod}</span></>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Key Points */}
      {summaryData.keyPoints && summaryData.keyPoints.length > 0 && (
        <div className="professional-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Points</h3>
            <button
              onClick={() => copyToClipboard(summaryData.keyPoints.join('\n• '), 'keypoints')}
              className="btn-primary text-sm px-3 py-1"
            >
              {copiedSection === 'keypoints' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <ul className="space-y-3">
            {summaryData.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="professional-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Summary</h3>
          <button
            onClick={() => copyToClipboard(summaryData.summary, 'summary')}
            className="btn-primary text-sm px-3 py-1"
          >
            {copiedSection === 'summary' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
            {summaryData.summary}
          </p>
        </div>
      </div>

      {/* Extracted Text Preview */}
      {summaryData.extractedText && (
        <div className="professional-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Extracted Text</h3>
            <button
              onClick={() => copyToClipboard(summaryData.extractedText, 'extracted')}
              className="btn-primary text-sm px-3 py-1"
            >
              {copiedSection === 'extracted' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">
              {truncateText(summaryData.extractedText, 1500)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
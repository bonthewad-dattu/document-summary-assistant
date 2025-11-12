export const SUPPORTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for reliability

export const SUMMARY_LENGTHS = {
  short: '1-2 sentences',
  medium: '1 paragraph',
  long: 'detailed summary'
} as const;

export const API_ENDPOINTS = {
  PROCESS_DOCUMENT: '/api/process-document',
  GENERATE_SUMMARY: '/api/generate-summary',
};

export const MAX_TEXT_LENGTH = 8000;
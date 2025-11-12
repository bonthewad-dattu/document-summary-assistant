import { NextRequest, NextResponse } from 'next/server';
import { PDFParser } from '@/lib/pdfParser';
import { ocrService } from '@/lib/ocrService';
import { MAX_TEXT_LENGTH } from '@/lib/constants';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log(`Processing file: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText: string;
    let processingMethod: string;

    console.time(`Processing ${file.type}`);
    
    if (file.type === 'application/pdf') {
      // PDF processing - fast and reliable
      processingMethod = 'PDF Text Extraction';
      extractedText = await PDFParser.extractTextFromPDF(buffer);
      console.log('PDF processing completed successfully');
    } else if (file.type.startsWith('image/')) {
      // OCR processing for images
      processingMethod = 'OCR (Optical Character Recognition)';
      extractedText = await ocrService.extractTextFromImage(file);
      console.log('OCR processing completed');
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please use PDF or image files (PNG, JPG, JPEG).' },
        { status: 400 }
      );
    }

    console.timeEnd(`Processing ${file.type}`);

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the document.' },
        { status: 400 }
      );
    }

    // Optimize text length for AI processing
    const optimizedText = extractedText.length > MAX_TEXT_LENGTH 
      ? extractedText.substring(0, MAX_TEXT_LENGTH) + '... [text truncated for optimal performance]'
      : extractedText;

    return NextResponse.json({
      success: true,
      extractedText: optimizedText.trim(),
      fileType: file.type,
      fileName: file.name,
      processingMethod,
      originalLength: extractedText.length,
      optimizedLength: optimizedText.length,
      supportsOCR: file.type.startsWith('image/')
    });

  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { SummaryGenerator } from '@/lib/summaryGenerator';

export async function POST(request: NextRequest) {
  try {
    const { text, length = 'medium', includeKeyPoints = true } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text provided for summarization' },
        { status: 400 }
      );
    }

    // Limit text length to avoid token limits
    const truncatedText = text.length > 12000 ? text.substring(0, 12000) + '...' : text;

    const summary = await SummaryGenerator.generateSummary({
      text: truncatedText,
      length,
      includeKeyPoints
    });

    return NextResponse.json({
      success: true,
      ...summary
    });

  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
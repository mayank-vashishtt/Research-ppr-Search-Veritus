import { NextResponse } from 'next/server';
import { generatePaperSummary } from '@/lib/gemini-client';

export async function POST(request: Request) {
  try {
    const { title, abstract } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Paper title is required' },
        { status: 400 }
      );
    }

    const summary = await generatePaperSummary(title, abstract);

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

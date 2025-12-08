import { NextResponse } from 'next/server';
import { generateDetailedReview } from '@/lib/grok-client';

export async function POST(request: Request) {
  try {
    const { title, abstract, authors } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Paper title is required' },
        { status: 400 }
      );
    }

    const review = await generateDetailedReview(title, abstract, authors || 'Unknown');

    return NextResponse.json({ review });
  } catch (error: any) {
    console.error('Review generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate review' },
      { status: 500 }
    );
  }
}

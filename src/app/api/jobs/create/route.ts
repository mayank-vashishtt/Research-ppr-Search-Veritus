import { NextRequest, NextResponse } from 'next/server';
import { veritusClient } from '@/app/utils/veritus-client';
import { CreateJobOptions } from '@/app/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, options } = body as { 
      type: 'keywordSearch' | 'querySearch' | 'combinedSearch'; 
      options: CreateJobOptions 
    };

    if (!type || !options) {
      return NextResponse.json(
        { error: 'Missing type or options' },
        { status: 400 }
      );
    }

    const jobId = await veritusClient.createJob(type, options);
    return NextResponse.json({ jobId });
  } catch (error: any) {
    console.error('API Error createJob:', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Internal Server Error';
    return NextResponse.json({ error: message }, { status });
  }
}

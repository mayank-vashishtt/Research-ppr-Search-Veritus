import { NextRequest, NextResponse } from 'next/server';
import { veritusClient } from '@/app/utils/veritus-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    
    if (!jobId) {
       return NextResponse.json(
        { error: 'Missing jobId' },
        { status: 400 }
      );
    }

    const data: any = await veritusClient.getJobStatus(jobId);
    
    // Normalize response: If results exist but no status, assume success
    if (data.results && !data.status) {
      data.status = 'success';
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error getJobStatus:', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Internal Server Error';
    return NextResponse.json({ error: message }, { status });
  }
}

"use client";

import React, { useEffect, useState } from 'react';
import { JobStatusResponse, Paper } from '@/app/types';

interface JobPollerProps {
  jobId: string;
  onComplete: (results: Paper[]) => void;
  onError: (error: string) => void;
}

export function JobPoller({ jobId, onComplete, onError }: JobPollerProps) {
  const [status, setStatus] = useState<'queued' | 'processing' | 'success' | 'error'>('queued');
  const pollDelay = React.useRef(2000); // Start with 2s

  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error('Failed to check job status');
        
        const data: JobStatusResponse = await res.json();
        
        if (!isMounted) return;

        if (data.status === 'success' && data.results) {
          setStatus('success');
          onComplete(data.results);
        } else if (data.status === 'error') {
          setStatus('error');
          onError('Search job failed.');
        } else {
          // Still queued or processing
          setStatus('queued');
          
          // Adaptive polling: Backoff up to 10s
          const nextDelay = Math.min(pollDelay.current * 1.5, 10000);
          pollDelay.current = nextDelay;
          pollInterval = setTimeout(checkStatus, pollDelay.current);
        }
      } catch (err: any) {
        if (!isMounted) return;
        
        // If 429, just retry in a bit
        if (err.message && err.message.includes('429')) {
             pollInterval = setTimeout(checkStatus, 15000);
             return;
        }

        setStatus('error');
        onError(err.message || 'Polling error');
      }
    };

    // Initial check
    checkStatus();

    return () => {
      isMounted = false;
      if (pollInterval) clearTimeout(pollInterval);
    };
  }, [jobId, onComplete, onError]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="relative w-16 h-16 mb-6">
         <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
         <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 animate-spin"></div>
      </div>
      <h3 className="text-xl font-medium text-slate-200 mb-2">Searching Veritus Database...</h3>
      <p className="text-slate-400 max-w-md">
        We are analyzing millions of papers to find the most relevant results for your topic. This usually takes a few seconds.
      </p>
    </div>
  );
}

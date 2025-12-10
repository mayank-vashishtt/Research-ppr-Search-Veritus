"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { JobPoller } from '@/app/components/JobPoller';
import { PaperCard } from '@/app/components/PaperCard';
import { SearchBar } from '@/app/components/SearchBar';
import { EmailCaptureModal } from '@/app/components/EmailCaptureModal';
import { Paper, CreateJobOptions } from '@/app/types';

export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [topic, setTopic] = useState<string>("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const initialized = useRef(false);

  // Unwrap params
  useEffect(() => {
    // Reset state when slug changes
    initialized.current = false;
    setJobId(null);
    setPapers([]);
    setError(null);
    
    params.then(p => setTopic(decodeURIComponent(p.slug)));
  }, [params]);

  useEffect(() => {
    if (!topic) return;

    const checkAccess = async () => {
      try {
        const res = await fetch('/api/auth/status');
        const { authenticated } = await res.json();
        
        if (!authenticated) {
          setShowAuthModal(true);
          return false;
        }
        return true;
      } catch (e) {
        console.error("Auth check failed", e);
        return false;
      }
    };
    
    // Check access then decide to search
    // We store the check promise to await it in startSearch or separate logic
    // Actually, simpler: just set state. But we need to prevent startSearch.
    // Let's combine them into the startSearch effect or a ref.
  }, [topic]);

  useEffect(() => {
    if (!topic || initialized.current) return;
    // Don't mark initialized yet if we are blocked
    
    const startSearch = async () => {
      // 1. Check Auth FIRST
      try {
        const authRes = await fetch('/api/auth/status');
        const { authenticated } = await authRes.json();

        if (!authenticated) {
          setShowAuthModal(true);
          return; // STOP HERE. Do not create job.
        }
      } catch (e) {
        // Safe fail: ask for auth
        setShowAuthModal(true);
        return;
      }

      // If we get here, user is authed.
      initialized.current = true;

      try {
        // Use a simplified query wrapper that satisfies the 50-char limit but remains broad enough to avoid queue issues
        const query = `Research regarding ${topic} in the context of modern machine learning applications`;
        
        const options: CreateJobOptions = {
          query,
          limit: 100,
          enrich: true,
          year: '2020:2024'
        };

        const res = await fetch('/api/jobs/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'querySearch',
            options
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to create job');
        }

        const data = await res.json();
        setJobId(data.jobId);
      } catch (err: any) {
        setError(err.message);
      }
    };

    startSearch();
  }, [topic]);

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md px-6 py-4">
         <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
            <button 
              onClick={() => router.push('/')}
              className="text-lg font-bold text-slate-100 hover:text-cyan-400 transition-colors shrink-0"
            >
              <span className="text-cyan-500">Discovery</span>
            </button>
            
            <div className="flex-1 max-w-lg">
               <SearchBar 
                  variant="compact" 
                  initialQuery={topic}
                  placeholder="Search for another topic..." 
                />
            </div>
            
            <div className="w-8 shrink-0"></div> {/* Spacer for balance */}
         </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-sm font-medium text-cyan-500 uppercase tracking-widest mb-2">Research Results</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white capitalize">
            {topic}
          </h1>
        </div>

        {error ? (
          <div className="p-6 rounded-xl bg-red-950/20 border border-red-500/20 text-red-200 max-w-2xl">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Search Failed
            </h3>
            <p className="text-red-200/80 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-800 rounded-lg text-sm transition-colors text-white"
            >
              Try Again
            </button>
          </div>
        ) : !jobId ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 animate-pulse">
             <div className="w-12 h-12 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-4"/>
             <p>Initializing secure search environment...</p>
          </div>
        ) : !papers.length ? (
          <JobPoller 
            jobId={jobId} 
            onComplete={(results) => setPapers(results)}
            onError={(err) => setError(err)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
            
            {/* End of results */}
            <div className="col-span-full py-12 text-center text-slate-500">
               <p>End of results for "{topic}"</p>
            </div>
          </div>
        )}
      </main>
      
      <EmailCaptureModal 
        isOpen={showAuthModal} 
        onSuccess={() => setShowAuthModal(false)} 
      />
    </div>
  );
}

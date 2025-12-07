"use client";

import React, { useState } from 'react';
import { Paper } from '@/app/types';

interface PaperCardProps {
  paper: Paper;
}

export function PaperCard({ paper }: PaperCardProps) {
  const { 
    title, 
    authors, 
    abstract, 
    year, 
    impactFactor, 
    pdfLink, 
    journalName,
    v_journal_name
  } = paper;

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const displayJournal = journalName || v_journal_name || "Unknown Journal";
  const displayCitations = impactFactor?.citationCount || 0;
  
  // Format citations
  const formattedCitations = displayCitations > 1000 
    ? `${(displayCitations / 1000).toFixed(1)}k` 
    : displayCitations;

  const generateSummary = async () => {
    setLoadingSummary(true);
    setSummaryError(null);

    try {
      const response = await fetch('/api/papers/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, abstract }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setAiSummary(data.summary);
    } catch (error: any) {
      setSummaryError(error.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-xl p-6 relative overflow-hidden group">
      {/* Decorative gradient orb */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors duration-500" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Meta Row */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan-400/90 uppercase">
           <span className="bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
             {year || 'N/A'}
           </span>
           <span className="text-slate-600">•</span>
           <span className="text-slate-400 line-clamp-1 flex-1">{displayJournal}</span>
        </div>

        {/* Title & Author */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-100 leading-snug group-hover:text-cyan-100 transition-colors duration-300">
            <a href={paper.link || paper.pdfLink || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-cyan-500/50 decoration-2 underline-offset-4">
              {title}
            </a>
          </h3>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            {authors.split(',').slice(0, 3).join(', ')}{authors.split(',').length > 3 ? ' et al.' : ''}
          </p>
        </div>

        {/* Abstract Preview */}
        {abstract && (
          <p className="text-sm text-slate-400/80 leading-relaxed line-clamp-2 mix-blend-plus-lighter">
            {abstract}
          </p>
        )}

        {/* AI Summary Section */}
        {!aiSummary && !loadingSummary && (
          <button
            onClick={generateSummary}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/30 hover:to-cyan-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 transition-all duration-300 w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5 15.5 15.5"/></svg>
            Generate AI Summary
          </button>
        )}

        {loadingSummary && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20">
            <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
            <span className="text-xs text-purple-300">Generating AI summary...</span>
          </div>
        )}

        {aiSummary && (
          <div className="relative p-3 rounded-lg bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/30 backdrop-blur-sm">
            <div className="absolute top-2 right-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400/50"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5 15.5 15.5"/></svg>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400/80">AI Summary</span>
            </div>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              {aiSummary}
            </p>
          </div>
        )}

        {summaryError && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-950/20 border border-red-500/30">
            <span className="text-xs text-red-300">{summaryError}</span>
            <button
              onClick={generateSummary}
              className="text-xs text-red-400 hover:text-red-300 underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="h-px bg-slate-800/50 my-1" />

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
           {/* Metrics */}
           <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1.5" title="Citations">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                <span className="text-slate-300">{formattedCitations}</span>
              </div>
              {impactFactor?.influentialCitationCount ? (
                 <div className="flex items-center gap-1.5" title="Influential Citations">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5 15.5 15.5"/></svg>
                   <span className="text-slate-300">{impactFactor.influentialCitationCount}</span>
                </div>
              ) : null}
           </div>

           {/* PDF Button */}
           {pdfLink && (
             <a 
               href={pdfLink} 
               target="_blank" 
               rel="noopener noreferrer"
               className="
                 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-200 
                 bg-slate-800/50 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 hover:border-red-500/30
                 transition-all duration-300
               "
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 17l5-5-5-5v10z"/></svg>
               View PDF
             </a>
           )}
        </div>
      </div>
    </div>
  );
}


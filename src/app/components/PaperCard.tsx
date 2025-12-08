"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  
  const [detailedReview, setDetailedReview] = useState<string | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

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

  const generateDetailedReview = async () => {
    setLoadingReview(true);
    setReviewError(null);
    setShowReviewModal(true);

    try {
      const response = await fetch('/api/papers/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, abstract, authors }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate review');
      }

      setDetailedReview(data.review);
    } catch (error: any) {
      setReviewError(error.message);
    } finally {
      setLoadingReview(false);
    }
  };

  return (
    <>
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

        {/* View Full Review Button */}
        {aiSummary && !showReviewModal && (
          <button
            onClick={generateDetailedReview}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 hover:text-indigo-200 transition-all duration-300 w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            View Full In-Depth Review
          </button>
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

      {/* Full Review Modal - Rendered via Portal at document root */}
      {showReviewModal && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm rounded-t-2xl">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-100 line-clamp-2">{title}</h2>
                <p className="mt-1 text-sm text-slate-400">{authors.split(',').slice(0, 3).join(', ')}{authors.split(',').length > 3 ? ' et al.' : ''}</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="ml-4 p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-slate-200"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              {loadingReview && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mb-4" />
                  <p className="text-slate-300 text-sm">Generating comprehensive review...</p>
                  <p className="text-slate-500 text-xs mt-1">This may take a moment</p>
                </div>
              )}

              {reviewError && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30 mb-4">
                    <p className="text-red-300 text-sm">{reviewError}</p>
                  </div>
                  <button
                    onClick={generateDetailedReview}
                    className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-sm font-medium transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {detailedReview && (
                <div className="prose prose-invert prose-slate max-w-none">
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {detailedReview}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}


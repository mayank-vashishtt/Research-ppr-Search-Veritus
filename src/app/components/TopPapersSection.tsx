"use client";

import React from 'react';
import { PaperCard } from './PaperCard';
import { TOP_PAPERS } from '../data/topPapers';

export function TopPapersSection() {
  return (
    <section className="w-full relative z-10 mb-16">
      <div className="flex items-center gap-4 mb-8 text-amber-400/80 text-sm font-medium uppercase tracking-widest divider">
        <span className="h-px bg-amber-900/30 flex-1"></span>
        <span className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Top Papers of the Month
        </span>
        <span className="h-px bg-amber-900/30 flex-1"></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TOP_PAPERS.map((paper, index) => (
          <div key={paper.id} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <PaperCard paper={paper} />
          </div>
        ))}
      </div>
    </section>
  );
}

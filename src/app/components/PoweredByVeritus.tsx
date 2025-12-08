import Link from 'next/link';
import React from 'react';

export function PoweredByVeritus() {
  return (
    <Link 
      href="https://veritus.ai" 
      target="_blank" 
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full transition-all duration-300 group shadow-lg"
    >
      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
      <span className="text-[10px] font-medium text-slate-400 group-hover:text-cyan-400 uppercase tracking-widest transition-colors">
        Powered by Veritus
      </span>
    </Link>
  );
}

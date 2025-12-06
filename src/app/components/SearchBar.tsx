"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  variant?: 'hero' | 'compact';
  requireAuth?: boolean;
  onAuthRequired?: () => void;
}

export function SearchBar({ 
  initialQuery = "", 
  placeholder = "Search for topics, papers, or specific keywords...", 
  variant = 'hero',
  requireAuth = false,
  onAuthRequired
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check authentication if required
    if (requireAuth) {
      try {
        const res = await fetch('/api/auth/status');
        const { authenticated } = await res.json();
        
        if (!authenticated) {
          onAuthRequired?.();
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        onAuthRequired?.();
        return;
      }
    }

    router.push(`/topic/${encodeURIComponent(query.trim())}`);
  };

  const isHero = variant === 'hero';

  return (
    <form onSubmit={handleSearch} className={`relative w-full ${isHero ? 'max-w-2xl' : 'max-w-lg'}`}>
      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 ${isHero ? 'inset-0' : 'inset-0.5'}`} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 text-slate-100 
            placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 
            transition-all duration-300 rounded-full
            ${isHero ? 'py-4 pl-6 pr-14 text-lg shadow-2xl' : 'py-2.5 pl-5 pr-12 text-sm shadow-lg'}
          `}
        />
        
        <button 
          type="submit"
          className={`
            absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center 
            text-slate-400 hover:text-cyan-400 transition-colors
            ${isHero ? 'w-10 h-10' : 'w-8 h-8'}
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isHero ? 24 : 18} height={isHero ? 24 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>
    </form>
  );
}

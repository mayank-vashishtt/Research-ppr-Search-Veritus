"use client";

import { TopicCard } from '@/app/components/TopicCard';
import { SearchBar } from '@/app/components/SearchBar';
import { EmailCaptureModal } from '@/app/components/EmailCaptureModal';
import { TopPapersSection } from '@/app/components/TopPapersSection';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Paper } from '@/app/types';

export default function Home() {
  const router = useRouter();
  const { authenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Data State
  const [topAiPapers, setTopAiPapers] = useState<Paper[]>([]);
  const [topMlPapers, setTopMlPapers] = useState<Paper[]>([]);
  const [topMixedPapers, setTopMixedPapers] = useState<Paper[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [papersRes, topicsRes] = await Promise.all([
          fetch('/api/trending/papers'),
          fetch('/api/trending/topics')
        ]);

        if (papersRes.ok) {
          const papersData = await papersRes.json();
          setTopAiPapers(papersData.ai || []);
          setTopMlPapers(papersData.ml || []);
          setTopMixedPapers(papersData.mixed || []);
        }

        if (topicsRes.ok) {
          const topicsData = await topicsRes.json();
          setTrendingTopics(topicsData.topics || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTopicClick = async (topic: string) => {
    // Check authentication before navigating
    if (!authenticated) {
      setShowAuthModal(true);
      return;
    }
    router.push(`/topic/${encodeURIComponent(topic)}`);
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Reload to update auth state
    window.location.reload();
  };

  return (
    <div className="min-h-screen px-6 py-12 md:py-20 max-w-7xl mx-auto flex flex-col items-center relative">
      {!loading && !authenticated && (
        <div className="absolute top-6 right-6 z-20">
          <a href="/login" className="text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-800/50 hover:bg-cyan-950/30 px-4 py-2 rounded-full transition-all">
            Login / Verify
          </a>
        </div>
      )}

      {/* Hero Section */}
      <header className="w-full max-w-4xl mx-auto text-center flex flex-col items-center mb-16 relative z-10 fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/50 backdrop-blur-md mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">Veritus Research Engine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 mb-6 tracking-tight leading-[1.1] text-glow">
          Discover the Future <br/> of Science
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Access millions of academic papers, trending research topics, and breakthrough discoveries with our AI-powered search engine.
        </p>

        <SearchBar 
          variant="hero" 
          requireAuth={!authenticated}
          onAuthRequired={handleAuthRequired}
        />
      </header>

      {/* Featured Papers */}
      {dataLoading ? (
        <div className="w-full flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Top Trending Papers (Mixed Best) */}
          <TopPapersSection 
            title="Top Trending Papers of the Month" 
            papers={topMixedPapers}
            iconColor="text-cyan-400"
            dividerColor="bg-cyan-900/30"
          />

          {/* Top ML Papers */}
          <TopPapersSection 
            title="Top ML Trending Papers of the Month" 
            papers={topMlPapers}
            iconColor="text-emerald-400"
            dividerColor="bg-emerald-900/30"
          />

          {/* Top AI Papers */}
          <TopPapersSection 
            title="Top AI Trending Papers" 
            papers={topAiPapers}
            iconColor="text-amber-400"
            dividerColor="bg-amber-900/30"
          />
          
          {/* Trending Topics */}
          <section className="w-full relative z-10">
            <div className="flex items-center gap-4 mb-8 text-slate-500 text-sm font-medium uppercase tracking-widest divider">
              <span className="h-px bg-slate-800 flex-1"></span>
              <span>Trending Topics of the Month</span>
              <span className="h-px bg-slate-800 flex-1"></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trendingTopics.map((topic, index) => (
                <div key={topic} className={`fade-in`} style={{ animationDelay: `${100 + index * 50}ms` }}>
                  <TopicCard 
                    topic={topic} 
                    onClick={() => handleTopicClick(topic)} 
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <footer className="mt-24 w-full border-t border-slate-800 pt-8 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} Discovery Micro-App. Powered by Veritus Search API.</p>
      </footer>
      
      {/* Background Decorative Blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen opacity-60"></div>

      <EmailCaptureModal 
        isOpen={showAuthModal} 
        onSuccess={handleAuthSuccess} 
      />
    </div>
  );
}

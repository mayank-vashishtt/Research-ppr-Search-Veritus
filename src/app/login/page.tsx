"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to home or back
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen opacity-60"></div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <Link href="/" className="inline-block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
             Veritus<span className="text-slate-100">Discovery</span>
           </Link>
           <p className="text-slate-400">Academic Verification Portal</p>
        </div>

        <div className="glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
          
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Login / Verify</h1>
          
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-lg mb-6 text-sm text-cyan-200/80">
             <strong className="text-cyan-400 block mb-1">Hackathon Note:</strong> 
             Please use your university email (<code className="text-cyan-300">.edu</code>, <code className="text-cyan-300">.ac.in</code>) to help us verify academic reach.
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <input
                type="email"
                id="email"
                required
                placeholder="researcher@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center font-medium bg-red-950/20 py-2 rounded border border-red-900/30">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Enter'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
              Continue as Guest (Limited Access)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

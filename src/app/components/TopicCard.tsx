"use client";

import React from 'react';

interface TopicCardProps {
  topic: string;
  onClick: () => void;
  disabled?: boolean;
}

const gradients = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-indigo-500 to-purple-600",
  "from-rose-500 to-red-600",
];

export function TopicCard({ topic, onClick, disabled }: TopicCardProps) {
  // Use a deterministic gradient based on string length or char code for consistency
  const gradientIndex = topic.length % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/20
        bg-slate-800/50 border border-slate-700 backdrop-blur-sm
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
          {topic}
        </h3>
        <p className="mt-2 text-sm text-slate-400 group-hover:text-slate-200">
          Discover latest research
        </p>
      </div>
      <div className="absolute right-4 bottom-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

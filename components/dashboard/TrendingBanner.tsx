'use client';

import React from 'react';
import { useIdeas } from '@/context/IdeaContext';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

export default function TrendingBanner() {
  const { trendingIdeas } = useIdeas();

  const top = trendingIdeas.slice(0, 3);

  if (top.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 overflow-x-auto pb-2">
      <div className="flex gap-4 min-w-min">
        {/* Section Title / Icon */}
        <div
          className="flex items-center gap-2 flex-shrink-0 px-4 py-3 rounded-sm"
          style={{
            backgroundColor: 'var(--cork-bg)',
            color: 'var(--card-cream)',
            fontFamily: 'var(--font-courier-prime)',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
          }}
        >
          📰 EDITOR'S PICKS
        </div>

        {/* Trending Ideas */}
        {top.map((idea, index) => (
          <Card
            key={idea.id}
            className="flex-shrink-0 w-80 p-4 paper-texture rounded-sm border"
            style={{
              backgroundColor: 'var(--card-cream)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Rank Badge */}
            <div
              className="inline-flex items-center justify-center w-8 h-8 rounded-full mb-3 font-bold text-sm"
              style={{
                backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                color: index === 0 ? '#1a1a1a' : '#f5f0e8',
                fontFamily: 'var(--font-courier-prime)',
              }}
            >
              {index + 1}
            </div>

            <h4
              className="font-bold text-sm mb-2 line-clamp-2"
              style={{
                fontFamily: 'var(--font-courier-prime)',
                color: 'var(--ink-black)',
              }}
            >
              {idea.title}
            </h4>

            <p
              className="text-xs mb-3 line-clamp-2"
              style={{
                fontFamily: 'var(--font-lora)',
                color: 'var(--vintage-text)',
              }}
            >
              {idea.description}
            </p>

            {/* Category & Votes */}
            <div className="flex items-center justify-between text-xs pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-courier-prime)',
                  color: 'var(--cork-bg)',
                  fontWeight: 'bold',
                  fontSize: '0.65rem',
                  letterSpacing: '0.05em',
                }}
              >
                {idea.category}
              </span>
              <div className="flex items-center gap-1" style={{ color: 'var(--hot-red)', fontFamily: 'var(--font-courier-prime)', fontWeight: 'bold' }}>
                <span>👍 {idea.votes}</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

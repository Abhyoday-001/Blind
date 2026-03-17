'use client';

import React from 'react';
import { useIdeas } from '@/context/IdeaContext';
import { Card } from '@/components/ui/card';

export default function TrendingCard() {
  const { trendingIdeas, darkMode } = useIdeas();
  const top = trendingIdeas.slice(0, 3);

  if (top.length === 0) return null;

  return (
    <Card
      className="p-5 paper-texture rounded-sm border mb-6"
      style={{
        backgroundColor: 'var(--card-cream)',
        borderColor: 'var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="pushpin"
        style={{
          top: '8px',
          right: '12px',
          opacity: darkMode ? 0.8 : 1,
        }}
      />

      <h3
        className="text-sm font-bold mb-4 tracking-wider"
        style={{
          fontFamily: 'var(--font-courier-prime)',
          color: 'var(--hot-red)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        🔥 TRENDING
      </h3>

      <div className="space-y-3">
        {top.map((idea, idx) => (
          <div key={idea.id} className="pb-3 border-b last:border-b-0 last:pb-0" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div
                  className="text-xs font-bold mb-1"
                  style={{
                    fontFamily: 'var(--font-courier-prime)',
                    color: 'var(--olive-grey)',
                    letterSpacing: '0.1em',
                  }}
                >
                  #{idx + 1} • {idea.category}
                </div>
                <div
                  className="text-sm font-bold line-clamp-2"
                  style={{
                    fontFamily: 'var(--font-courier-prime)',
                    color: 'var(--ink-black)',
                  }}
                >
                  {idea.title}
                </div>
              </div>
              <div
                className="flex-shrink-0 text-xs font-bold"
                style={{ fontFamily: 'var(--font-courier-prime)', color: 'var(--hot-red)' }}
                title="Upvotes"
              >
                👍 {idea.votes || 0}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}


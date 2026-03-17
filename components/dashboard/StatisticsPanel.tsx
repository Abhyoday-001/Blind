'use client';

import React from 'react';
import { useIdeas } from '@/context/IdeaContext';
import { Card } from '@/components/ui/card';

export default function StatisticsPanel() {
  const { statistics, darkMode } = useIdeas();

  return (
    <Card
      className="p-5 paper-texture rounded-sm border"
      style={{
        backgroundColor: 'var(--card-cream)',
        borderColor: 'var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Memo pin */}
      <div
        className="pushpin"
        style={{
          top: '8px',
          right: '12px',
          opacity: darkMode ? 0.8 : 1,
        }}
      />

      {/* Crumpled corner effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20px',
          height: '20px',
          background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)',
          opacity: 0.5,
        }}
      />

      <h3
        className="text-sm font-bold mb-4 tracking-wider"
        style={{
          fontFamily: 'var(--font-courier-prime)',
          color: 'var(--cork-bg)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        📋 STATS
      </h3>

      <div className="space-y-4">
        {/* Total Ideas */}
        <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{
              fontFamily: 'var(--font-courier-prime)',
              color: 'var(--olive-grey)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
            }}
          >
            Total Ideas
          </p>
          <p
            className="text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-courier-prime)',
              color: 'var(--cork-bg)',
            }}
          >
            {statistics.totalIdeas}
          </p>
        </div>

        {/* Average Difficulty */}
        <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{
              fontFamily: 'var(--font-courier-prime)',
              color: 'var(--olive-grey)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
            }}
          >
            Avg Difficulty
          </p>
          <p
            className="text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-courier-prime)',
              color: 'var(--mustard)',
            }}
          >
            {statistics.avgDifficulty}
            <span className="text-xs ml-1">/5</span>
          </p>
        </div>

        {/* Average Votes */}
        <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{
              fontFamily: 'var(--font-courier-prime)',
              color: 'var(--olive-grey)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
            }}
          >
            Avg Votes
          </p>
          <p
            className="text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-courier-prime)',
              color: 'var(--hot-red)',
            }}
          >
            {statistics.avgVotes}
          </p>
        </div>

        {/* Most Popular Category */}
        {statistics.mostPopularCategory && (
          <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{
                fontFamily: 'var(--font-courier-prime)',
                color: 'var(--olive-grey)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
              }}
            >
              Popular Category
            </p>
            <p
              className="text-sm font-bold"
              style={{
                fontFamily: 'var(--font-lora)',
                color: 'var(--forest-green)',
              }}
            >
              {statistics.mostPopularCategory}
            </p>
          </div>
        )}

        {/* Massive Potential Count */}
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{
              fontFamily: 'var(--font-courier-prime)',
              color: 'var(--olive-grey)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
            }}
          >
            🚀 Massive Ideas
          </p>
          <p
            className="text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-courier-prime)',
              color: 'var(--hot-red)',
            }}
          >
            {statistics.highestMarketPotentialCount}
          </p>
        </div>
      </div>
    </Card>
  );
}

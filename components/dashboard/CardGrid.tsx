'use client';

import React from 'react';
import { useIdeas } from '@/context/IdeaContext';
import IdeaCard from './IdeaCard';
import { Empty } from '@/components/ui/empty';

export default function CardGrid({ mode = 'active' }: { mode?: 'active' | 'archived' }) {
  const { filteredIdeas, searchQuery, filters } = useIdeas();
  const { archivedIdeas } = useIdeas();

  const ideas = mode === 'archived' ? archivedIdeas : filteredIdeas;

  if (ideas.length === 0) {
    return (
      <div className="py-12">
        <Empty
          title={mode === 'archived' ? 'No archived ideas' : 'No ideas found'}
          description={
            mode === 'archived'
              ? 'Expired ideas will appear here after their review duration ends.'
              : searchQuery || filters.category !== 'All' || filters.marketPotential !== 'All' || filters.difficulty || filters.visibility !== 'All'
              ? "Try adjusting your filters or search terms to find startup ideas."
              : "No startup ideas yet. Submit the first one!"
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {ideas.map((idea, index) => (
        <IdeaCard key={idea.id} idea={idea} index={index} />
      ))}
    </div>
  );
}

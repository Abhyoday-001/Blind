'use client';

import React, { useState, useEffect } from 'react';
import { Idea } from '@/types';
import { useIdeas } from '@/context/IdeaContext';
import { ChevronDown, ThumbsUp, Eye, EyeOff, Trash2, Pencil, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditIdeaDialog from './EditIdeaDialog';

interface IdeaCardProps {
  idea: Idea;
  index: number;
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Easy',
  2: 'Moderate',
  3: 'Hard',
  4: 'Very Hard',
  5: 'Insane',
};

const DIFFICULTY_COLORS: Record<number, string> = {
  1: 'var(--forest-green)',
  2: 'var(--mustard)',
  3: 'var(--olive-grey)',
  4: 'var(--hot-red)',
  5: 'var(--hot-red)',
};

export default function IdeaCard({ idea, index }: IdeaCardProps) {
  const { upvoteIdea, toggleVisibility, deleteIdea, user, darkMode } = useIdeas();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isOwner = user?.id === idea.userId || user?.id === (idea as any).user;
  const isHot = (idea.votes || 0) >= 25;
  const popularityLabel = (idea.votes || 0) >= 25 ? 'VIRAL' : (idea.votes || 0) >= 10 ? 'POPULAR' : (idea.votes || 0) >= 3 ? 'RISING' : 'NEW';
  const [tiltAngle] = useState(() => (Math.random() - 0.5) * 4);
  const created = new Date(idea.createdAt);
  const updated = idea.updatedAt ? new Date(idea.updatedAt) : null;
  const expiry = idea.expiryTime ? new Date(idea.expiryTime) : null;
  const isExpired = !!expiry && expiry.getTime() <= Date.now();

  const handleUpvote = async () => {
    setLoading(true);
    try {
      await upvoteIdea(idea.id);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    setLoading(true);
    try {
      await toggleVisibility(idea.id);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this idea?')) {
      setLoading(true);
      try {
        await deleteIdea(idea.id);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="pin-drop"
      style={{
        animationDelay: `${index * 50}ms`,
        '--tilt-angle': `${tiltAngle}deg`,
      } as any}
    >
      <div
        className="vintage-tilt paper-texture rounded-sm shadow-lg border transition-all duration-300 hover:shadow-xl"
        style={{
          backgroundColor: 'var(--card-cream)',
          borderColor: 'var(--border)',
          transform: `rotate(${tiltAngle}deg)`,
          opacity: idea.visibilityStatus === 'hidden' ? 0.7 : 1,
        }}
      >
        <div className="pushpin" style={{ top: '12px', left: '16px', opacity: darkMode ? 0.8 : 1 }} />
        <div className="pushpin" style={{ top: '12px', right: '16px', opacity: darkMode ? 0.8 : 1 }} />

        <div className="p-5 relative">
          {isHot && <div className="stamp absolute -top-3 -right-3 z-10" style={{ color: 'var(--hot-red)' }}>🔥 HOT</div>}

          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold pr-6 text-balance" style={{ color: 'var(--ink-black)', fontFamily: 'var(--font-courier-prime)' }}>
              {idea.title}
            </h3>
            {isOwner && (
              <div className="flex gap-2">
                <EditIdeaDialog
                  idea={idea}
                  trigger={
                    <button title="Edit" className="hover:text-primary">
                      <Pencil size={16} />
                    </button>
                  }
                />
                <button onClick={handleToggleVisibility} title="Toggle Visibility" className="hover:text-primary">
                  {idea.visibilityStatus === 'active' ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={handleDelete} title="Delete" className="hover:text-destructive">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          <p className="text-sm mb-3 italic" style={{ color: 'var(--olive-grey)' }}>
            "{idea.problemStatement}"
          </p>

          <div className={`text-sm mb-4 ${expanded ? '' : 'line-clamp-2'}`} style={{ color: 'var(--vintage-text)' }}>
            {idea.description || idea.problemStatement}
          </div>

          {(idea.description?.length || 0) > 80 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs flex items-center gap-1 mb-4 hover:opacity-75 transition-opacity"
              style={{ color: 'var(--cork-bg)', fontFamily: 'var(--font-courier-prime)' }}
            >
              {expanded ? 'Show less' : 'Read more'}
              <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4 text-xs border-t pt-3" style={{ borderColor: 'var(--border)' }}>
            <div>
              <div style={{ color: 'var(--olive-grey)', fontFamily: 'var(--font-courier-prime)' }} className="font-bold">CATEGORY</div>
              <div style={{ color: 'var(--vintage-text)' }}>{idea.category}</div>
            </div>
            <div>
              <div style={{ color: 'var(--olive-grey)', fontFamily: 'var(--font-courier-prime)' }} className="font-bold">POPULARITY</div>
              <div style={{ color: 'var(--hot-red)', fontWeight: 'bold', fontFamily: 'var(--font-courier-prime)' }}>
                {popularityLabel}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--olive-grey)', fontFamily: 'var(--font-courier-prime)' }} className="font-bold">DIFFICULTY</div>
              <div style={{ color: DIFFICULTY_COLORS[idea.difficulty || 1], fontWeight: 'bold' }}>
                {DIFFICULTY_LABELS[idea.difficulty || 1]}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--olive-grey)', fontFamily: 'var(--font-courier-prime)' }} className="font-bold">MARKET</div>
              <div style={{ color: 'var(--vintage-text)' }}>{idea.marketPotential}</div>
            </div>
            <div>
              <div style={{ color: 'var(--olive-grey)', fontFamily: 'var(--font-courier-prime)' }} className="font-bold">ADDED</div>
              <div style={{ color: 'var(--vintage-text)' }}>
                {new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <ThumbsUp size={16} />
              <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-courier-prime)' }}>
                {idea.votes || 0}
              </span>
            </div>
            <Button
              onClick={handleUpvote}
              disabled={loading || idea.isArchived}
              size="sm"
              style={{
                backgroundColor: 'var(--cork-bg)',
                color: 'var(--card-cream)',
                fontFamily: 'var(--font-courier-prime)',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              {idea.isArchived ? 'ARCHIVED' : loading ? '...' : 'UPVOTE'}
            </Button>
          </div>

          <div className="mt-3 pt-3 border-t text-[11px] flex flex-wrap gap-x-4 gap-y-1 items-center" style={{ borderColor: 'var(--border)', color: 'var(--olive-grey)', fontFamily: 'var(--font-courier-prime)' }}>
            <span>Created: {created.toLocaleString()}</span>
            {updated && <span>Updated: {updated.toLocaleString()}</span>}
            {expiry && (
              <span className="inline-flex items-center gap-1" style={{ color: idea.isArchived || isExpired ? 'var(--hot-red)' : 'var(--forest-green)' }}>
                <Clock size={12} />
                Expires: {expiry.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

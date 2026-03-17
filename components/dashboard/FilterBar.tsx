'use client';

import React, { useState } from 'react';
import { useIdeas } from '@/context/IdeaContext';
import { Category, Difficulty, MarketPotential } from '@/types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { X, Filter } from 'lucide-react';

const CATEGORIES: Category[] = ['Technology', 'Health', 'Finance', 'Education', 'Entertainment', 'Social', 'Commerce', 'Other'];
const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];
const MARKET_POTENTIALS: MarketPotential[] = ['Low', 'Medium', 'High', 'Massive'];

const DIFFICULTY_NAMES = {
  1: 'Easy',
  2: 'Moderate',
  3: 'Hard',
  4: 'Very Hard',
  5: 'Insane',
};

export default function FilterBar({ showVisibility = true }: { showVisibility?: boolean }) {
  const { filters, setFilters } = useIdeas();
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.difficulty !== null ||
    filters.marketPotential !== 'All' ||
    (showVisibility && filters.visibility !== 'All');

  const handleClearFilters = () => {
    setFilters({
      category: 'All',
      difficulty: null,
      marketPotential: 'All',
      visibility: showVisibility ? 'active' : 'active',
    });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            style={{
              backgroundColor: hasActiveFilters ? 'var(--cork-bg)' : 'var(--card)',
              color: hasActiveFilters ? 'var(--card-cream)' : 'var(--foreground)',
              borderColor: 'var(--border)',
              fontFamily: 'var(--font-courier-prime)',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
            }}
          >
            <Filter size={16} className="mr-1" />
            FILTERS
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {/* Category Filter */}
          <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h4 style={{ fontFamily: 'var(--font-courier-prime)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', color: 'var(--olive-grey)' }} className="mb-2">
              CATEGORY
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setFilters({ ...filters, category: 'All' })}
                className="w-full text-left px-2 py-1 rounded text-sm hover:bg-opacity-50 transition-colors"
                style={{
                  backgroundColor: filters.category === 'All' ? 'var(--cork-bg)' : 'transparent',
                  color: filters.category === 'All' ? 'var(--card-cream)' : 'var(--foreground)',
                  fontFamily: 'var(--font-lora)',
                }}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters({ ...filters, category: cat })}
                  className="w-full text-left px-2 py-1 rounded text-sm hover:bg-opacity-50 transition-colors"
                  style={{
                    backgroundColor: filters.category === cat ? 'var(--cork-bg)' : 'transparent',
                    color: filters.category === cat ? 'var(--card-cream)' : 'var(--foreground)',
                    fontFamily: 'var(--font-lora)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h4 style={{ fontFamily: 'var(--font-courier-prime)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', color: 'var(--olive-grey)' }} className="mb-2">
              DIFFICULTY
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setFilters({ ...filters, difficulty: null })}
                className="w-full text-left px-2 py-1 rounded text-sm hover:bg-opacity-50 transition-colors"
                style={{
                  backgroundColor: filters.difficulty === null ? 'var(--cork-bg)' : 'transparent',
                  color: filters.difficulty === null ? 'var(--card-cream)' : 'var(--foreground)',
                  fontFamily: 'var(--font-lora)',
                }}
              >
                Any Difficulty
              </button>
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFilters({ ...filters, difficulty: diff })}
                  className="w-full text-left px-2 py-1 rounded text-sm hover:bg-opacity-50 transition-colors"
                  style={{
                    backgroundColor: filters.difficulty === diff ? 'var(--cork-bg)' : 'transparent',
                    color: filters.difficulty === diff ? 'var(--card-cream)' : 'var(--foreground)',
                    fontFamily: 'var(--font-lora)',
                  }}
                >
                  {diff} - {DIFFICULTY_NAMES[diff as keyof typeof DIFFICULTY_NAMES]}
                </button>
              ))}
            </div>
          </div>

          {/* Market Potential Filter */}
          <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h4 style={{ fontFamily: 'var(--font-courier-prime)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', color: 'var(--olive-grey)' }} className="mb-2">
              MARKET POTENTIAL
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setFilters({ ...filters, marketPotential: 'All' })}
                className="w-full text-left px-2 py-1 rounded text-sm hover:bg-opacity-50 transition-colors"
                style={{
                  backgroundColor: filters.marketPotential === 'All' ? 'var(--cork-bg)' : 'transparent',
                  color: filters.marketPotential === 'All' ? 'var(--card-cream)' : 'var(--foreground)',
                  fontFamily: 'var(--font-lora)',
                }}
              >
                Any Potential
              </button>
              {MARKET_POTENTIALS.map((potential) => (
                <button
                  key={potential}
                  onClick={() => setFilters({ ...filters, marketPotential: potential })}
                  className="w-full text-left px-2 py-1 rounded text-sm hover:bg-opacity-50 transition-colors"
                  style={{
                    backgroundColor: filters.marketPotential === potential ? 'var(--cork-bg)' : 'transparent',
                    color: filters.marketPotential === potential ? 'var(--card-cream)' : 'var(--foreground)',
                    fontFamily: 'var(--font-lora)',
                  }}
                >
                  {potential}
                </button>
              ))}
            </div>
          </div>

          {showVisibility && (
            <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-courier-prime)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                  color: 'var(--olive-grey)',
                }}
                className="mb-2"
              >
                VISIBILITY
              </h4>
              <div className="space-y-1">
                {(['All', 'active', 'hidden'] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => setFilters({ ...filters, visibility: value })}
                    className="w-full text-left px-2 py-1 rounded text-sm hover:bg-opacity-50 transition-colors"
                    style={{
                      backgroundColor: filters.visibility === value ? 'var(--cork-bg)' : 'transparent',
                      color: filters.visibility === value ? 'var(--card-cream)' : 'var(--foreground)',
                      fontFamily: 'var(--font-lora)',
                    }}
                  >
                    {value === 'All' ? 'All Ideas' : value === 'active' ? 'Active' : 'Hidden'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full px-3 py-2 text-left text-sm border-t flex items-center gap-2"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--hot-red)',
                fontFamily: 'var(--font-courier-prime)',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              <X size={14} />
              CLEAR ALL
            </button>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.category !== 'All' && (
            <div
              className="text-xs px-3 py-1 rounded inline-flex items-center gap-2"
              style={{ backgroundColor: 'var(--cork-bg)', color: 'var(--card-cream)', fontFamily: 'var(--font-courier-prime)' }}
            >
              {filters.category}
              <button
                onClick={() => setFilters({ ...filters, category: 'All' })}
                className="hover:opacity-70"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {filters.difficulty !== null && (
            <div
              className="text-xs px-3 py-1 rounded inline-flex items-center gap-2"
              style={{ backgroundColor: 'var(--cork-bg)', color: 'var(--card-cream)', fontFamily: 'var(--font-courier-prime)' }}
            >
              Difficulty {filters.difficulty}
              <button
                onClick={() => setFilters({ ...filters, difficulty: null })}
                className="hover:opacity-70"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {filters.marketPotential !== 'All' && (
            <div
              className="text-xs px-3 py-1 rounded inline-flex items-center gap-2"
              style={{ backgroundColor: 'var(--cork-bg)', color: 'var(--card-cream)', fontFamily: 'var(--font-courier-prime)' }}
            >
              {filters.marketPotential}
              <button
                onClick={() => setFilters({ ...filters, marketPotential: 'All' })}
                className="hover:opacity-70"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {showVisibility && filters.visibility !== 'All' && (
            <div
              className="text-xs px-3 py-1 rounded inline-flex items-center gap-2"
              style={{ backgroundColor: 'var(--cork-bg)', color: 'var(--card-cream)', fontFamily: 'var(--font-courier-prime)' }}
            >
              {filters.visibility === 'active' ? 'Active' : 'Hidden'}
              <button onClick={() => setFilters({ ...filters, visibility: 'All' })} className="hover:opacity-70">
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

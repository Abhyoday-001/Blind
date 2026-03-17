'use client';

import React from 'react';
import { useIdeas } from '@/context/IdeaContext';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SearchBar() {
  const { searchQuery, setSearch } = useIdeas();

  return (
    <InputGroup>
      <InputGroupAddon style={{ color: 'var(--olive-grey)' }}>
        <Search size={18} />
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        placeholder="Search ideas by title, description, or problem..."
        value={searchQuery}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          fontFamily: 'var(--font-courier-prime)',
          backgroundColor: 'var(--card)',
          color: 'var(--foreground)',
          borderColor: 'var(--border)',
        }}
      />
      {searchQuery && (
        <InputGroupAddon>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearch('')}
            style={{ color: 'var(--olive-grey)' }}
          >
            <X size={18} />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

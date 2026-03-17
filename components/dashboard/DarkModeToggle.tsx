'use client';

import React from 'react';
import { useIdeas } from '@/context/IdeaContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useIdeas();

  return (
    <Button
      onClick={() => setDarkMode(!darkMode)}
      size="sm"
      style={{
        backgroundColor: 'var(--cork-bg)',
        color: 'var(--card-cream)',
        fontFamily: 'var(--font-courier-prime)',
        fontSize: '0.875rem',
      }}
    >
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}

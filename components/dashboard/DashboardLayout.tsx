'use client';

import React, { useEffect, useState } from 'react';
import { useIdeas } from '@/context/IdeaContext';
import '@/styles/vintage.css';
import IdeaForm from './IdeaForm';
import CardGrid from './CardGrid';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';
import StatisticsPanel from './StatisticsPanel';
import DarkModeToggle from './DarkModeToggle';
import TrendingBanner from './TrendingBanner';
import TrendingCard from './TrendingCard';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';

function DashboardContent() {
  const { darkMode, user, logout, loading } = useIdeas();
  const [view, setView] = useState<'active' | 'archived'>('active');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Spinner variant="vintage" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header with Title and Controls */}
      <header className="border-b sticky top-0 z-40 bg-opacity-95 backdrop-blur" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--cork-bg)' }}>
                STARTUP IDEA VALIDATOR
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--olive-grey)' }}>
                {user ? `Welcome back, ${user.name}. Your next unicorn starts here.` : 'Browse startup ideas from the community.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user && <IdeaForm />}
              <DarkModeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView(view === 'active' ? 'archived' : 'active')}
                disabled={!user}
                style={{
                  borderColor: 'var(--border)',
                  fontFamily: 'var(--font-courier-prime)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                }}
              >
                {view === 'active' ? 'ARCHIVED' : 'ACTIVE'}
              </Button>
              {user ? (
                <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                  <LogOut size={20} />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="text-sm font-bold" style={{ fontFamily: 'var(--font-courier-prime)' }}>
                    LOGIN
                  </Link>
                  <span style={{ color: 'var(--olive-grey)' }}>·</span>
                  <Link href="/register" className="text-sm font-bold" style={{ fontFamily: 'var(--font-courier-prime)' }}>
                    REGISTER
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Banner (Active view only) */}
        {view === 'active' && <TrendingBanner />}

        {/* Search and Filter Section */}
        <div className="space-y-6 mb-8">
          {view === 'active' && (
            <>
              <SearchBar />
              <FilterBar showVisibility={!!user} />
            </>
          )}
        </div>

        {/* Main Grid with Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Panel - Right Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <TrendingCard />
              <StatisticsPanel />
            </div>
          </aside>

          {/* Ideas Grid */}
          <div className="lg:col-span-3">
            <CardGrid mode={view} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <DashboardContent />
  );
}

export default Dashboard;

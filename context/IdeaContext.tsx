'use client';

import React, { createContext, useCallback, useMemo, useState, useEffect } from 'react';
import { Idea, FilterState, Statistics, Category, User } from '@/types';
import { api } from '@/lib/api';

export interface IdeaContextType {
  ideas: Idea[];
  filteredIdeas: Idea[];
  trendingIdeas: Idea[];
  archivedIdeas: Idea[];
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  fetchIdeas: () => Promise<void>;
  addIdea: (idea: any) => Promise<string>;
  updateIdea: (id: string, idea: any) => Promise<void>;
  upvoteIdea: (id: string) => Promise<void>;
  toggleVisibility: (id: string) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  setFilters: (filters: FilterState) => void;
  setSearch: (search: string) => void;
  filters: FilterState;
  searchQuery: string;
  statistics: Statistics;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export const IdeaContext = createContext<IdeaContextType | undefined>(undefined);

export function IdeaProvider({ children }: { children: React.ReactNode }) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [trendingIdeas, setTrendingIdeas] = useState<Idea[]>([]);
  const [archivedIdeas, setArchivedIdeas] = useState<Idea[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    difficulty: null,
    marketPotential: 'All',
    visibility: 'active',
  });
  const [searchQuery, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
      const data = hasToken ? await (api as any).getMyIdeas() : await api.getIdeas();
      if (Array.isArray(data)) {
        setIdeas(data.map(mapBackendIdea));
      }

      const trending = await api.getTrendingIdeas();
      if (Array.isArray(trending)) {
        setTrendingIdeas(trending.map(mapBackendIdea));
      }

      if (hasToken) {
        const archived = await (api as any).getMyArchivedIdeas();
        if (Array.isArray(archived)) {
          setArchivedIdeas(archived.map(mapBackendIdea));
        }
      } else {
        setArchivedIdeas([]);
      }
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapBackendIdea = (idea: any): Idea => ({
    ...idea,
    id: idea._id || idea.id,
    difficulty: idea.difficultyScore,
    votes: idea.upvotes,
    description: idea.problemStatement, // Backend combined description into problemStatement or vice versa
    marketPotential: mapMarketPotentialNumToString(idea.marketPotential),
    createdAt: new Date(idea.createdAt),
    updatedAt: idea.updatedAt ? new Date(idea.updatedAt) : undefined,
    expiryTime: idea.expiryTime ? new Date(idea.expiryTime).toISOString() : undefined,
  });

  const mapMarketPotentialNumToString = (val: number): any => {
    const map = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Massive' };
    return (map as any)[val] || 'Low';
  };

  const mapMarketPotentialStringToNum = (val: string): number => {
    const map = { 'Low': 1, 'Medium': 2, 'High': 3, 'Massive': 4 };
    return (map as any)[val] || 1;
  };

  const login = async (credentials: any) => {
    const data = await api.login(credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data._id, name: data.name, email: data.email }));
      setUser({ id: data._id, name: data.name, email: data.email });
      await fetchIdeas();
    } else {
      throw new Error(data.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    const data = await api.register(userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data._id, name: data.name, email: data.email }));
      setUser({ id: data._id, name: data.name, email: data.email });
      await fetchIdeas();
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      if (filters.category !== 'All' && idea.category !== filters.category) return false;
      if (filters.difficulty !== null && idea.difficulty !== filters.difficulty) return false;
      if (filters.marketPotential !== 'All' && idea.marketPotential !== filters.marketPotential) return false;
      if (filters.visibility !== 'All' && idea.visibilityStatus !== filters.visibility) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          idea.title.toLowerCase().includes(query) ||
          idea.problemStatement.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [ideas, filters, searchQuery]);

  const statistics: Statistics = useMemo(() => {
    if (ideas.length === 0) {
      return { totalIdeas: 0, avgDifficulty: 0, avgVotes: 0, mostPopularCategory: null, highestMarketPotentialCount: 0 };
    }
    const avgDifficulty = ideas.reduce((sum, idea) => sum + (idea.difficulty || 0), 0) / ideas.length;
    const avgVotes = ideas.reduce((sum, idea) => sum + (idea.votes || 0), 0) / ideas.length;
    const categoryCount: Record<string, number> = {};
    ideas.forEach((idea) => {
      categoryCount[idea.category] = (categoryCount[idea.category] || 0) + 1;
    });
    const mostPopularCategory = Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0]?.[0] as Category | null;
    const highestMarketPotentialCount = ideas.filter((idea) => idea.marketPotential === 'Massive').length;

    return {
      totalIdeas: ideas.length,
      avgDifficulty: Math.round(avgDifficulty * 10) / 10,
      avgVotes: Math.round(avgVotes),
      mostPopularCategory,
      highestMarketPotentialCount,
    };
  }, [ideas]);

  const addIdea = useCallback(async (ideaData: any) => {
    const payload = {
      ...ideaData,
      difficultyScore: ideaData.difficulty,
      marketPotential: mapMarketPotentialStringToNum(ideaData.marketPotential),
      problemStatement: ideaData.problemStatement || ideaData.description,
    };
    const newIdea = await api.createIdea(payload);
    await fetchIdeas();
    return newIdea._id || newIdea.id;
  }, []);

  const updateIdea = useCallback(async (id: string, ideaData: any) => {
    const payload = {
      ...ideaData,
      difficultyScore: ideaData.difficulty,
      marketPotential: mapMarketPotentialStringToNum(ideaData.marketPotential),
      problemStatement: ideaData.problemStatement || ideaData.description,
    };
    await api.updateIdea(id, payload);
    await fetchIdeas();
  }, []);

  const upvoteIdea = useCallback(async (id: string) => {
    await api.upvoteIdea(id);
    await fetchIdeas();
  }, []);

  const toggleVisibility = useCallback(async (id: string) => {
    await api.toggleVisibility(id);
    await fetchIdeas();
  }, []);

  const deleteIdea = useCallback(async (id: string) => {
    await api.deleteIdea(id);
    await fetchIdeas();
  }, []);

  return (
    <IdeaContext.Provider
      value={{
        ideas,
        filteredIdeas,
        trendingIdeas,
        archivedIdeas,
        user,
        loading,
        login,
        register,
        logout,
        fetchIdeas,
        addIdea,
        updateIdea,
        upvoteIdea,
        toggleVisibility,
        deleteIdea,
        setFilters,
        setSearch,
        filters,
        searchQuery,
        statistics,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </IdeaContext.Provider>
  );
}

export function useIdeas() {
  const context = React.useContext(IdeaContext);
  if (!context) {
    throw new Error('useIdeas must be used within an IdeaProvider');
  }
  return context;
}

'use client';

import React from 'react';
import { IdeaProvider } from '@/context/IdeaContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <IdeaProvider>{children}</IdeaProvider>;
}


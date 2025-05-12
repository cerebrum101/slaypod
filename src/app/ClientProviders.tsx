'use client';

import React from 'react';
import { PlayerProvider } from '@/app/contexts/PlayerContext';
import { Player } from '@/app/components/Player';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <div className="pb-24"> 
        {children}
      </div>
      <Player />
    </PlayerProvider>
  );
} 
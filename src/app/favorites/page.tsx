'use client';

// import { PlayerProvider } from '@/app/contexts/PlayerContext'; // Remove
// import { Player } from '@/app/components/Player';             // Remove
import { TrackList } from '@/app/components/TrackList';

export default function FavoritesPage() {
  return (
    // <PlayerProvider> 
      <main className="p-8"> {/* Adjusted padding, bg is now on body */}
        <div className="max-w-7xl mx-auto mt-8">
          <h1 className="text-3xl font-bold mb-8">Favorite Tracks</h1>
          <TrackList />
        </div>
      </main>
    // </PlayerProvider> 
  );
} 
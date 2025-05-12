'use client';

import React from 'react';
import { usePlayer } from '@/app/contexts/PlayerContext';
import { TrackList } from '@/app/components/TrackList'; // Reuse TrackList for consistency
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AlbumDetailPage() {
  const { tracks } = usePlayer();
  const params = useParams();
  const albumTitleEncoded = params.albumTitle as string;
  const albumTitle = albumTitleEncoded ? decodeURIComponent(albumTitleEncoded) : 'Unknown Album';

  const albumTracks = React.useMemo(() => 
    tracks.filter(track => (track.album?.name || 'Unknown Album') === albumTitle)
  , [tracks, albumTitle]);

  const firstTrack = albumTracks[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <Link href="/albums" className="flex items-center text-gray-400 hover:text-white mb-4">
        <ArrowLeft size={18} className="mr-2" />
        Back to Albums
      </Link>
      <h1 className="text-3xl font-bold mb-2">{albumTitle}</h1>
      {firstTrack?.artist && (
        <h2 className="text-xl text-gray-300 mb-6">{firstTrack.artist.name}</h2>
      )}

      <TrackList tracks={albumTracks} /> 
    </div>
  );
} 
import React from 'react';
import { usePlayer } from '@/app/contexts/PlayerContext';
import Image from 'next/image';
import { DefaultCover } from './DefaultCover';
import { Heart, Trash2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Track } from '@/app/types/track'; 

interface TrackListProps {
  tracks?: Track[]; 
}

export function TrackList({ tracks: tracksProp }: TrackListProps) { 
  const {
    tracks: tracksFromContext,
    currentTrack,
    isPlaying,
    play,
    pause,
    toggleFavorite,
    isFavorite,
    favoriteIds,
    deleteTrack,
    searchQuery
  } = usePlayer();
  
  const pathname = usePathname();

  // Use provided tracks prop if available, otherwise use context tracks
  const baseTracks = tracksProp || tracksFromContext;

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const tracksToDisplayInitially = pathname === '/favorites' 
    ? baseTracks.filter(track => favoriteIds.has(track.id))
    : baseTracks;


  const filteredTracks = React.useMemo(() => {
    if (!searchQuery) {
      return tracksToDisplayInitially;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return tracksToDisplayInitially.filter(track => 
      track.title.toLowerCase().includes(lowerCaseQuery) ||
      (track.artist && track.artist.name.toLowerCase().includes(lowerCaseQuery)) ||
      (track.album && track.album.name.toLowerCase().includes(lowerCaseQuery))
    );
  }, [searchQuery, tracksToDisplayInitially]);

  if (filteredTracks.length === 0 && pathname === '/favorites') {
    return <p className="text-gray-400">No favorite tracks yet. Add some!</p>;
  }
  if (filteredTracks.length === 0) {
    return <p className="text-gray-400">{searchQuery ? `No results found for "${searchQuery}"` : (pathname === '/favorites' ? 'No favorite tracks yet.' : 'No tracks found.')}</p>;
  }

  return (
    <div className="space-y-2">
      {filteredTracks.map((track) => (
        <div
          key={track.id}
          className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 ${
            currentTrack?.id === track.id ? 'bg-gray-800' : ''
          }`}
        >
          <div 
            className="relative w-12 h-12 flex-shrink-0 cursor-pointer"
            onClick={() => {
              if (currentTrack?.id === track.id) {
                isPlaying ? pause() : play(track);
              } else {
                play(track);
              }
            }}
          >
            {track.coverSrc ? (
              <Image
                src={track.coverSrc}
                alt={track.title}
                fill
                className="object-cover rounded"
              />
            ) : (
              <DefaultCover
                title={track.title}
                artist={track.artist.name}
                className="rounded w-full h-full"
              />
            )}
          </div>
          <div 
            className="flex-1 min-w-0 cursor-pointer"
             onClick={() => {
              if (currentTrack?.id === track.id) {
                isPlaying ? pause() : play(track);
              } else {
                play(track);
              }
            }}
          >
            <h3 className="font-medium truncate">{track.title}</h3>
            <p className="text-sm text-gray-400 truncate">{track.artist.name}</p>
          </div>
          <div className="text-sm text-gray-400 mx-2 flex-shrink-0">
            {track.duration > 0 ? formatDuration(track.duration) : '--:--'}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(track.id);
            }}
            className="p-2 rounded-full hover:bg-gray-700 flex-shrink-0"
            title={isFavorite(track.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={20} 
              className={isFavorite(track.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if(confirm(`Are you sure you want to delete "${track.title}"? This cannot be undone.`)){
                 deleteTrack(track.id);
              }
            }}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-red-500 flex-shrink-0"
            title="Delete track"
          >
            <Trash2 size={20} />
          </button>
          <button
            className={`p-2 rounded-full hover:bg-gray-700 flex-shrink-0 ${
              currentTrack?.id === track.id && isPlaying
                ? 'text-green-500'
                : 'text-gray-400'
            }`}
             onClick={() => {
              if (currentTrack?.id === track.id) {
                isPlaying ? pause() : play(track);
              } else {
                play(track);
              }
            }}
            title={currentTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
          >
            {currentTrack?.id === track.id && isPlaying ? (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.197-1.882a1 1 0 000-1.664l-3.197-1.882z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      ))}
    </div>
  );
} 
import React from 'react';
import { usePlayer } from '@/app/contexts/PlayerContext';
import Image from 'next/image';
import { DefaultCover } from './DefaultCover';
import { Heart } from 'lucide-react';

export function Player() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    resume,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
    toggleFavorite,
    isFavorite
  } = usePlayer();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-gray-600 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center">
                No track selected
            </div>
        </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 w-1/4">
          {currentTrack && (
            <>
              <div className="relative w-14 h-14 flex-shrink-0">
                {currentTrack.coverSrc ? (
                  <Image
                    src={currentTrack.coverSrc}
                    alt={currentTrack.title}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <DefaultCover
                    title={currentTrack.title}
                    artist={currentTrack.artist.name}
                    className="rounded w-full h-full"
                  />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold truncate">{currentTrack.title}</h3>
                <p className="text-sm text-gray-400 truncate">{currentTrack.artist.name}</p>
              </div>
               <button
                  onClick={() => toggleFavorite(currentTrack.id)}
                  className="p-2 rounded-full hover:bg-gray-700 flex-shrink-0 ml-2"
                  title={isFavorite(currentTrack.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    size={20} 
                    className={isFavorite(currentTrack.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
                  />
                </button>
            </>
          )}
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <button
              onClick={previousTrack}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={isPlaying ? pause : resume}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              {isPlaying ? (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-300"
              disabled={!currentTrack || duration === 0}
            />
            <span className="text-sm text-gray-400 w-10">{formatTime(duration || 0)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414M3 10v4a2 2 0 002 2h3l7 7V3l-7 7H5a2 2 0 00-2 2z"
            />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-300"
          />
        </div>
      </div>
    </div>
  );
} 
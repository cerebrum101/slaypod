'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { getTracks } from '@/app/lib/tracks';
import { Track } from '@/app/types/track';

interface PlayerContextType {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  favoriteIds: Set<string>;
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  refreshTracks: () => Promise<void>;
  deleteTrack: (trackId: string) => Promise<boolean>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const FAVORITES_KEY = 'slaypod_favorites';

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTracks = async () => {

    const loadedTracks = await getTracks();
    setTracks(loadedTracks);

  };

  useEffect(() => {
    loadTracks();
  }, []);

  const refreshTracks = async () => {
    await loadTracks();
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        setFavoriteIds(new Set(JSON.parse(storedFavorites)));
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
        setFavoriteIds(new Set());
      }
    } else {
      setFavoriteIds(new Set());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favoriteIds)));
  }, [favoriteIds]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const handleCanPlay = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
    };

    audioRef.current.addEventListener('canplay', handleCanPlay);

    const handleTimeUpdate = () => {
      if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };
    const handleDurationChange = () => {
      if (audioRef.current) {
        const newDuration = audioRef.current.duration;
        if (isFinite(newDuration)) {
          setDuration(newDuration);
          if (currentTrack) {
            const updatedTrack = { ...currentTrack, duration: newDuration };
            if (Math.abs((currentTrack.duration || 0) - newDuration) > 0.1) {
              setCurrentTrack(updatedTrack);
              setTracks(prevTracks =>
                prevTracks.map(track =>
                  track.id === currentTrack.id ? updatedTrack : track
                )
              );
            }
          }
        }
      }
    };
    const handleEnded = () => {
      nextTrack();
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('durationchange', handleDurationChange);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('durationchange', handleDurationChange);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentTrack && currentTrack.audioUrl && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
    } else if (!currentTrack && audioRef.current) {
       audioRef.current.pause();
       audioRef.current.src = '';
       setCurrentTime(0);
       setDuration(0);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && currentTrack) {
      if (audioRef.current.readyState >= 3) { 
         audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (track: Track) => {
    if (currentTrack?.id !== track.id) {
       setCurrentTrack(track);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const resume = () => {
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      const newTime = Math.max(0, Math.min(time, audioRef.current.duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
     setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  const toggleFavorite = (trackId: string) => {
    setFavoriteIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(trackId)) {
        newIds.delete(trackId);
      } else {
        newIds.add(trackId);
      }
      return newIds;
    });
  };

  const isFavorite = (trackId: string) => {
    return favoriteIds.has(trackId);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    const currentIndex = currentTrack ? tracks.findIndex(track => track.id === currentTrack.id) : -1;
    const nextIndex = (currentIndex + 1) % tracks.length;
    play(tracks[nextIndex]);
  };

  const previousTrack = () => {
    if (tracks.length === 0) return;
    const currentIndex = currentTrack ? tracks.findIndex(track => track.id === currentTrack.id) : -1;
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    play(tracks[prevIndex]);
  };

  const deleteTrack = async (trackId: string): Promise<boolean> => {

    try {
      const response = await fetch('/api/tracks/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete track');
      }
      
      if (currentTrack?.id === trackId) {
          setCurrentTrack(null);
          setIsPlaying(false);
      }

      setFavoriteIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(trackId);
          return newIds;
      });

      await refreshTracks();

      return true;

    } catch (error) {

      return false;
    }
  };

  const contextValue: PlayerContextType = {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    favoriteIds,
    play,
    pause,
    resume,
    seek,
    setVolume: handleVolumeChange,
    nextTrack,
    previousTrack,
    toggleFavorite,
    isFavorite,
    refreshTracks,
    deleteTrack,
    searchQuery,
    setSearchQuery,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
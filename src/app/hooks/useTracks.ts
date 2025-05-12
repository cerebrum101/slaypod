import { useState, useEffect } from 'react';
import { Track } from '../types/track';

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = async (query?: string) => {
    try {
      setLoading(true);
      const url = query 
        ? `/api/tracks?q=${encodeURIComponent(query)}`
        : '/api/tracks';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tracks');
      
      const data = await response.json();
      setTracks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  return {
    tracks,
    loading,
    error,
    refetch: fetchTracks
  };
} 
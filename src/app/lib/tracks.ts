import { Track } from '../types/track';
import { Artist } from '../types/artist';
import { Album } from '../types/album';

// Local tracks configuration
// Create helper function to reduce repetition
const createArtist = (name: string): Artist => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name, albums: [] });
const createAlbum = (name: string, artist: Artist, coverSrc?: string): Album => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name, artist, coverSrc: coverSrc || '', tracks: [] });

const testArtist = createArtist('Test Artist');
const testAlbum = createAlbum('Test Album', testArtist, '/data/cover.jpg');

export const tracks: Track[] = [
  {
    id: '1',
    title: 'Test Track 1',
    artist: testArtist,
    album: testAlbum,
    coverSrc: testAlbum.coverSrc,
    audioUrl: '/data/test.mp3',
    duration: 180 
  },
  {
    id: '2',
    title: 'Test Track 2',
    artist: testArtist,
    album: testAlbum,
    coverSrc: testAlbum.coverSrc,
    audioUrl: '/data/test.mp3',
    duration: 240 
  },
  {
    id: '3',
    title: 'Test Track 3',
    artist: testArtist,
    album: testAlbum,
    coverSrc: testAlbum.coverSrc,
    audioUrl: '/data/test.mp3',
    duration: 200 
  }
];

// Function to get track duration from audio file
export async function getAudioDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
    audio.addEventListener('error', () => {
      resolve(0);
    });
  });
}

// Function to scan data directory for audio files
export async function scanDataDirectory(): Promise<Track[]> {
  try {
    const response = await fetch('/api/tracks/scan');
    const data = await response.json();
    return data.tracks;
  } catch (error) {
    console.error('Error scanning data directory:', error);
    return tracks;
  }
}

/**
 * Fetches the list of tracks from the backend API.
 */
export async function getTracks(): Promise<Track[]> {
  try {
    // Add cache-busting parameter to ensure fresh data after upload
    const response = await fetch(`/api/tracks/scan?t=${Date.now()}`); 
    if (!response.ok) {
      const errorData = await response.text(); // Get error details
      throw new Error(`Failed to fetch tracks: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    // Ensure the response has the expected structure
    return Array.isArray(data.tracks) ? data.tracks : [];
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return []; // Return empty array on error
  }
} 
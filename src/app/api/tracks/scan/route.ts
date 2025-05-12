import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Track } from '@/app/types/track';
import { Artist } from '@/app/types/artist';
import { Album } from '@/app/types/album';
import { readMetadataStore } from '@/app/lib/metadataStore'; // Import the reader

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const allMetadata = await readMetadataStore(); // Read the stored metadata
    
    let directoryEntries: string[];
    try {
      directoryEntries = await fs.readdir(uploadsDir);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return NextResponse.json({ tracks: [] });
      } 
      throw err; 
    }
    
    const audioFilenames: string[] = [];
    for (const entryName of directoryEntries) {
      if (entryName === 'covers' || entryName === 'metadata.json') { 
        continue;
      }
      const fullPath = path.join(uploadsDir, entryName);
      try {
        const stats = await fs.stat(fullPath);
        if (stats.isFile() && /\.(mp3|wav|ogg)$/i.test(entryName)) {
          audioFilenames.push(entryName);
        }
      } catch (statError) {
        console.error(`error ${entryName}:`, statError);
      }
    }

    const tracks: Track[] = [];

    for (const filename of audioFilenames) {


      const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
      const storedMeta = allMetadata[safeFilename];

      if (storedMeta) {

        const artistObj: Artist = { 
          id: storedMeta.artist || 'unknown-artist', 
          name: storedMeta.artist || 'Unknown Artist',
          albums: [] 
        };
        const albumObj: Album = { 
          id: storedMeta.album || 'unknown-album', 
          name: storedMeta.album || 'Unknown Album', 
          artist: artistObj, 
          coverSrc: storedMeta.coverSrc || '', 
          tracks: [] 
        };

        tracks.push({
          id: safeFilename, 
          title: storedMeta.title,
          artist: artistObj,
          album: albumObj,
          duration: storedMeta.duration,
          coverSrc: storedMeta.coverSrc || '',
          audioUrl: storedMeta.audioUrl, 
          genre: (storedMeta as any).genre || 'Unknown', 
        });
      } else {

        console.warn(`Metadata not found for file: ${filename} (sanitized: ${safeFilename}). Consider re-uploading or implementing self-healing metadata parsing.`);

      }
    }

    // Sort of filtered tracks
    tracks.sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json({ tracks });

  } catch (error) {
    console.error('Error scanning uploads directory or reading metadata:', error);
    return NextResponse.json(
      { error: 'Failed to scan uploads directory or read metadata' },
      { status: 500 }
    );
  }
} 
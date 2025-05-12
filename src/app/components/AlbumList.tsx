'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePlayer } from '@/app/contexts/PlayerContext';
import { DefaultCover } from './DefaultCover';
import { Album as AlbumIcon } from 'lucide-react';
import { Artist } from '@/app/types/artist';

interface Album {
  id: string;
  title: string;
  artist?: Artist;
  coverSrc?: string;
  trackCount: number;
}

export function AlbumList() {
  const { tracks, searchQuery } = usePlayer();

  const albums = React.useMemo(() => {
    const albumMap = new Map<string, Album>();
    tracks.forEach(track => {
      const albumTitle = track.album?.name || 'Unknown Album';
      const artistName = track.artist?.name || 'Unknown Artist';
      const albumKey = `${albumTitle}-${artistName}`;

      if (!albumMap.has(albumKey)) {
        albumMap.set(albumKey, {
          id: encodeURIComponent(albumTitle), 
          title: albumTitle,
          artist: track.artist,
          coverSrc: track.coverSrc, 
          trackCount: 0,
        });
      }
      albumMap.get(albumKey)!.trackCount++;

      if (track.coverSrc && !albumMap.get(albumKey)!.coverSrc) {
        albumMap.get(albumKey)!.coverSrc = track.coverSrc;
      }
    });
    return Array.from(albumMap.values());
  }, [tracks]);


  const filteredAlbums = React.useMemo(() => {
    if (!searchQuery) {
      return albums;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return albums.filter(album => 
      album.title.toLowerCase().includes(lowerCaseQuery) ||
      (album.artist && album.artist.name.toLowerCase().includes(lowerCaseQuery))
    );
  }, [searchQuery, albums]);


  if (filteredAlbums.length === 0) {
    return <p className="text-gray-400">{searchQuery ? `No albums found for "${searchQuery}"` : 'No albums found.'}</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {filteredAlbums.map((album) => (
        <Link key={album.id} href={`/albums/${album.id}`} className="block group">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-800 group-hover:opacity-80 transition-opacity">
            {album.coverSrc ? (
              <Image
                src={album.coverSrc}
                alt={album.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <AlbumIcon size={48} className="text-gray-500" />
              </div>
            )}
          </div>
          <div className="mt-2">
            <h3 className="font-medium truncate group-hover:underline">{album.title}</h3>
            {album.artist && <p className="text-sm text-gray-400 truncate">{album.artist.name}</p>}
            <p className="text-xs text-gray-500">{album.trackCount} track{album.trackCount !== 1 ? 's' : ''}</p>
          </div>
        </Link>
      ))}
    </div>
  );
} 
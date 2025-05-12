'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListMusic, Heart, Upload, Library, Search, X } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { usePlayer } from '@/app/contexts/PlayerContext';

export default function Header() {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const { refreshTracks, setSearchQuery, searchQuery: contextSearchQuery } = usePlayer();
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  useEffect(() => {
    setLocalSearchQuery(contextSearchQuery);
  }, [contextSearchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setLocalSearchQuery(query);
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    setSearchQuery("");
  };

  const linkClasses = "flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-700 transition-colors";
  const activeLinkClasses = "bg-gray-700 text-white";
  const inactiveLinkClasses = "text-gray-400 hover:text-white";

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadMessage(`Uploading ${files.length} file(s)...`);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('/api/tracks/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setUploadMessage('Upload successful! Refreshing tracks...');
      await refreshTracks();
      setUploadMessage('Tracks refreshed!');

    } catch (error) {
      console.error("Upload error:", error);
      setUploadMessage(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadMessage(null), 4000);
      event.target.value = '';
    }
  };

  return (
    <header className="max-w-7xl mx-auto mb-8">
      <nav className="flex flex-wrap items-center justify-between gap-4 bg-gray-800 p-2 rounded-lg">
        <div className="flex space-x-4">
          <Link href="/"
            className={`${linkClasses} ${pathname === '/' ? activeLinkClasses : inactiveLinkClasses}`}
          >
            <ListMusic size={20} />
            <span>All Tracks</span>
          </Link>
          <Link href="/albums"
            className={`${linkClasses} ${pathname.startsWith('/albums') ? activeLinkClasses : inactiveLinkClasses}`}
          >
            <Library size={20} />
            <span>Albums</span>
          </Link>
          <Link href="/favorites"
            className={`${linkClasses} ${pathname === '/favorites' ? activeLinkClasses : inactiveLinkClasses}`}
          >
            <Heart size={20} />
            <span>Favorites</span>
          </Link>
        </div>

        <div className="relative flex-grow max-w-xs ml-4 mr-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search tracks, albums, artists..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="bg-gray-700 text-white placeholder-gray-400 w-full pl-10 pr-8 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {localSearchQuery && (
             <button 
               onClick={clearSearch}
               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
               title="Clear search"
             >
                <X size={16}/>
             </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {uploadMessage && (
            <span className="text-sm text-gray-300 mr-2">{uploadMessage}</span>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".mp3,.wav,.ogg"
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${linkClasses} ${inactiveLinkClasses} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Upload size={20} />
            <span>{isUploading ? 'Uploading...' : 'Upload Tracks'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
} 
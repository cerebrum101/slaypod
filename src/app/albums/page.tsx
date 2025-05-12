'use client';

import React from 'react';
import { AlbumList } from '@/app/components/AlbumList'; // We will create this component next

export default function AlbumsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold mb-4">Albums</h1>
      <AlbumList />
    </div>
  );
} 
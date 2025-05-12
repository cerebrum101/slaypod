import React from 'react';

interface DefaultCoverProps {
  title: string;
  artist: string;
  className?: string;
}

export function DefaultCover({ title, artist, className = '' }: DefaultCoverProps) {
  const initials = `${title[0]}${artist[0]}`.toUpperCase();
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
  ];
  const colorIndex = (title.charCodeAt(0) + artist.charCodeAt(0)) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`flex items-center justify-center ${bgColor} ${className}`}
      style={{ aspectRatio: '1/1' }}
    >
      <span className="text-2xl font-bold text-white">{initials}</span>
    </div>
  );
} 
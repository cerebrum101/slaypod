"use client";

import { TrackList } from './components/TrackList';

export default function Home() {
  return (
      <main className="p-8">
        <div className="max-w-7xl mx-auto mt-8">
          <h1 className="text-3xl font-bold mb-8">All Tracks</h1>
          <TrackList />
        </div>
      </main>
  );
}

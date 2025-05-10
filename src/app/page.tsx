import Image from "next/image";
import { Search, Menu, Mic, Video, Bell, User, Play, Plus } from "lucide-react";

export default function Home() {
  // Dummy video data
  const tracks = Array(20).fill(null).map((_, i) => ({
    id: i,
    title: `Amazing Track ${i + 1}`,
    artist: `Artist ${i + 1}`,
    album: `Album ${i + 1}`,
    duration: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60)}`,
    cover: `https://picsum.photos/seed/${i}/320/180`,
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800 flex items-center px-4 z-50">
        <div className="flex items-center gap-4 w-full">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src="/youtube-logo.png"
              alt="YouTube"
              width={90}
              height={20}
              className="dark:invert"
            />
          </div>
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-full focus:outline-none focus:border-blue-500 dark:bg-[#121212]"
              />
              <button className="px-6 py-2 bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-full">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Mic className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Video className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-14 bottom-0 w-64 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
        <nav className="p-4">
          <div className="space-y-2">
            <a href="#" className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <span>Home</span>
            </a>
            <a href="#" className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <span>Shorts</span>
            </a>
            <a href="#" className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <span>Subscriptions</span>
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="px-2 text-sm font-medium text-gray-500 dark:text-gray-400">Library</h3>
            <div className="mt-2 space-y-2">
              <a href="#" className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <span>History</span>
              </a>
              <a href="#" className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <span>Watch later</span>
              </a>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-14 p-6">
        <div className="tracks grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <div key={track.id} className="track flex flex-row w-full items-center bg-white/80 dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#232323] transition-colors">
              {/* Left group */}
              <div className="flex flex-row items-center gap-3">
                <div className="w-9 h-9 aspect-square bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={track.cover}
                    alt={track.title}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1">
                  <Play className="w-6 h-6" />
                </button>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-medium leading-tight">{track.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
                    {track.artist}
                  </p>
                </div>
              </div>
              {/* Right group */}
              <div className="flex flex-row items-center gap-3 ml-auto">
                <button className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1">
                  <Plus className="w-6 h-6" />
                </button>
                <div className="flex flex-col gap-0.5 items-end min-w-[60px]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight">{track.duration}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight">{track.album}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

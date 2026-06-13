"use client";

import { useState } from "react";
import BackgroundScene from "./components/BackgroundScene";
import Header from "./components/Header";
import IPTVPlayer from "./components/IPTVPlayer";

export default function Home() {
  const [activePlaylistId, setActivePlaylistId] = useState("worldcup-live");

  return (
    <main className="relative min-h-screen">
      <BackgroundScene />
      <div className="relative z-10">
        <Header
          activePlaylistId={activePlaylistId}
          onPlaylistChange={setActivePlaylistId}
        />
        <IPTVPlayer
          activePlaylistId={activePlaylistId}
          onPlaylistChange={setActivePlaylistId}
        />
        <footer className="flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-4 text-[9px] sm:text-[13px] text-zinc-500 border-t border-white/5 mt-6">
          <a href="https://github.com/sadix7" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors whitespace-nowrap">&copy; 2026 SadikTV</a>
          <a href="https://github.com/SHAJON-404/iptv" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap">
            <span>Based on original work by S. SHAJON</span>
            <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 fill-current" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </footer>
      </div>
    </main>
  );
}

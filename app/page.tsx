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
      </div>
    </main>
  );
}

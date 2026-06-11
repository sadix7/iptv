"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Tv } from "lucide-react";

const NAV_TABS = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "worldcup-live", label: "World Cup Live", emoji: "🏆" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬" },
  { id: "bangla", label: "Bangla", emoji: "🇧🇩" },
  { id: "universal", label: "All Channels", emoji: "🌍" },
] as const;

interface HeaderProps {
  activePlaylistId?: string;
  onPlaylistChange?: (id: string) => void;
}

export default function Header({ activePlaylistId = "home", onPlaylistChange = () => {} }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToChannels = (id: string) => {
    onPlaylistChange(id);
    setTimeout(() => {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const targetId = id === "worldcup-live" ? "worldcup-live-section" : "channels-section";
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${scrolled
          ? "bg-[#0a0a0a]/85 backdrop-blur-2xl border-white/[0.08] shadow-2xl shadow-black/40"
          : "bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-22">
          <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="cursor-pointer">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-2.5 sm:gap-4.5 cursor-pointer group"
            >
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border border-[#F5A623]/30 group-hover:border-[#F5A623]/60 shadow-xl shadow-[#F5A623]/20 bg-[#F5A623]/10 flex-shrink-0 flex items-center justify-center transition-colors">
                <Tv size={24} className="text-[#F5A623]" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-lg font-black tracking-tight text-white sm:hidden leading-none select-none">
                  Sadik<span className="text-[#F5A623]">TV</span>
                </span>
                <div className="hidden sm:flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                    Sadik
                  </span>
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#F5A623]">
                    TV
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-emerald-400">
                      LIVE BROADCAST
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToChannels(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePlaylistId === tab.id
                    ? "bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>


        </div>
      </div>
    </header>
  );
}

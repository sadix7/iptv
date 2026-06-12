"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";

interface HeaderProps {
  activePlaylistId?: string;
  onPlaylistChange?: (id: string) => void;
}

export default function Header({}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${scrolled
          ? "bg-[#0a0a0a]/85 backdrop-blur-2xl border-white/[0.08] shadow-2xl shadow-black/40"
          : "bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-22">
          <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="cursor-pointer">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-2.5 sm:gap-4.5 cursor-pointer group"
            >
              <div className="relative w-[47.5px] h-[47.5px] sm:w-[66.5px] sm:h-[66.5px] rounded-xl sm:rounded-2xl overflow-hidden border border-[#F5A623]/30 group-hover:border-[#F5A623]/60 shadow-xl shadow-[#F5A623]/20 bg-[#F5A623]/10 flex-shrink-0 flex items-center justify-center transition-colors">
                <Image src="/header.jpg" alt="Sadik TV" width={70} height={70} className="w-full h-full object-cover" priority />
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

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/m.h.sadik/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:scale-110 transition-transform"
            title="Instagram"
          >
            <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>


        </div>
      </div>
    </header>
  );
}

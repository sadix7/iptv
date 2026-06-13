"use client";

import Image from "next/image";

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import Hls from "hls.js";
import { motion, AnimatePresence } from "motion/react";
import {
  Tv,
  Play,
  Pause,
  Link,
  Check,
  Radio,
  Trash2,
  Upload,
  Search,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCw,
  RefreshCw,
  FileText,
  AlertCircle,
  ShieldAlert,
  PictureInPicture,
  ChevronsLeft,
  ChevronsRight,
  List,
  X,
  Settings
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
  type?: "dash" | "hls";
  kid?: string;
  key?: string;
}

interface Playlist {
  id: string;
  name: string;
  type: "default" | "upload" | "url";
  url?: string;
  channels: Channel[];
}

interface IPTVPlayerProps {
  activePlaylistId: string;
  onPlaylistChange: (id: string) => void;
}

const WORLDCUP_LIVE_CHANNELS: Channel[] = [
  {
    id: "wcl-caze-tv",
    name: "CAZE TV",
    logo: "https://images.seeklogo.com/logo-png/61/1/cazetv-logo-png_seeklogo-619708.png",
    group: "FIFA World Cup",
    url: "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8",
    type: "hls",
  },
  {
    id: "wcl-bein-sports-1",
    name: "BEIN Sports 1",
    logo: "https://images.seeklogo.com/logo-png/48/1/bein-sports-1-logo-png_seeklogo-481583.png",
    group: "FIFA World Cup",
    url: "https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8",
    type: "hls",
  },
  {
    id: "wcl-win-sports",
    name: "Win Sports",
    logo: "https://images.seeklogo.com/logo-png/25/1/win-sports-logo-png_seeklogo-259337.png",
    group: "FIFA World Cup",
    url: "https://1nyaler.streamhostingcdn.top/stream/32/index.m3u8",
    type: "hls",
  },
  {
    id: "wcl-world-cup-tv",
    name: "WORLD CUP TV (ENG)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/FIFA_WorldCup_logo.svg",
    group: "FIFA World Cup",
    url: "https://qp-pldt-live-bpk-ucd-prod.akamaized.net/bpk-tv/ch299/default/index.mpd",
    type: "dash",
    kid: "549ab7cd35a64bb6bb479ecead04d69d",
    key: "829799ed534d11fcadeb4b192467e050",
  },
  {
    id: "wcl-ptv-sports-embed",
    name: "PTV Sports",
    logo: "https://wapka-img.zuna.id/785a58ff.png",
    group: "FIFA World Cup",
    url: "https://cdn.dadocric.st/embed2.php?id=ptvsp",
    type: "hls",
  },
  {
    id: "wcl-p-tv-sports",
    name: "PTV Sports",
    logo: "https://i.postimg.cc/sXpJqtm3/Ptv.png",
    group: "FIFA World Cup",
    url: "https://tvsen5.aynaott.com/PtvSports/tracks-v1a1/mono.ts.m3u8",
    type: "hls",
  },
  {
    id: "wcl-ptv-sports",
    name: "PTV Sports",
    logo: "https://s3.aynaott.com/storage/9d9d7cbfba5a8ceea648bbd963ad1014",
    group: "FIFA World Cup",
    url: "https://tvsen5.aynaott.com/PtvSports/index.m3u8?e=1779283784&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=db1789e36c278bf538489fac263e0ffb",
    type: "hls",
  },
  {
    id: "wcl-somoy-tv",
    name: "Somoy TV",
    logo: "https://i.postimg.cc/Qxn4JFNV/20250529-071147.png",
    group: "FIFA World Cup",
    url: "https://sm-monirul.top/toffee/play/somoy_tv.m3u8",
    type: "hls",
  },
  {
    id: "wcl-btv-ctg",
    name: "BTV CTG",
    logo: "https://s3.aynaott.com/storage/00da8a07fb26b2fb79359ee535e4c7bc",
    group: "FIFA World Cup",
    url: "https://tvsen6.aynaott.com/btvctg/index.m3u8?e=1779283747&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=9bca925fbdfe526b29d41ab7802348ec",
    type: "hls",
  },
  {
    id: "wcl-d-sports",
    name: "D Sports",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/DSports.png",
    group: "FIFA World Cup",
    url: "https://otte.live.fly.ww.aiv-cdn.net/gru-nitro/live/clients/dash/enc/ubehitlwzo/out/v1/8e09c381a51f4366a19e979418112e8f/cenc.mpd",
    type: "dash",
    kid: "a7d11d37a1f7611ee88d4db880171f32",
    key: "68f96d618b0b956b008c445896a25a79",
  },
  {
    id: "wcl-tudn",
    name: "TUDN",
    logo: "https://i.imgur.com/oT5CAvd.png",
    group: "FIFA World Cup",
    url: "https://otte.live.fly.ww.aiv-cdn.net/gru-nitro/live/clients/dash/enc/8u9cregwlt/out/v1/687f6b2a559943549be271504a948ffd/cenc.mpd",
    type: "dash",
    kid: "1710ac2bbfcd3032d0f6533850968f47",
    key: "d2548dacc8efcd1cd0af0373060c82dc",
  },
  {
    id: "wcl-sportv",
    name: "SporTV",
    logo: "https://i.postimg.cc/gr9x3z71/Spor-TV-2021.png",
    group: "FIFA World Cup",
    url: "https://a151aivottlinear-a.akamaihd.net/OTTB/sin-nitro/live/dash/enc/m7duvnk2bu/out/v1/d1ad69118b5647309b1eb7213affdb3d/cenc.mpd",
    type: "dash",
    kid: "4bbcff3289d457b4dd5dbdd21221de9a",
    key: "c4906b9a9f8dda3c0725bddb8c497733",
  },
  {
    id: "wcl-tsn-sports-1",
    name: "TSN Sports 1",
    logo: "https://i.imgur.com/eRFE0jZ.png",
    group: "FIFA World Cup",
    url: "https://otte.cache.aiv-cdn.net/bom-nitro/live/clients/dash/enc/7janu55dwc/out/v1/69a2a7041395406b970598f61680e7cf/cenc.mpd",
    type: "dash",
    kid: "e51aa21f2a0fef9aabc120dfb655b52f",
    key: "a12a987fe725a40b6be95cd84b15f689",
  },
  {
    id: "wcl-telemundo",
    name: "Telemundo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Telemundo_logo_2018.svg/960px-Telemundo_logo_2018.svg.png",
    group: "FIFA World Cup",
    url: "https://live-oneapp-prd-news.akamaized.net/Content/CMAF_OL2-CTR-4s-v2/Live/channel(kvea)/master.mpd",
    type: "dash",
    kid: "ce7ab3022e753307997f58afe001bac4",
    key: "72d631a66e635c60829a0fe7705516c1",
  },
  {
    id: "wcl-m6-direct-tv",
    name: "M6 Direct TV",
    logo: "https://i.imgur.com/7GVp3fW.png",
    group: "FIFA World Cup",
    url: "https://origin-m6web.live.6cloud.fr/out/v1/6play/6play-m6/cmaf_cenc00/dash-short-hd.mpd",
    type: "dash",
    kid: "433ffba670963e70857859a9dff4be04",
    key: "51ede3a821229fe81e71282c8eff80e3",
  },
  {
    id: "wcl-zee5-bangla",
    name: "Zee5 Bangla",
    logo: "",
    group: "FIFA World Cup",
    url: "https://d1g8wgjurz8via.cloudfront.net/bpk-tv/Zeebanglacinema/default/manifest.mpd",
    type: "dash",
    kid: "fbbfd9ce4bbe4d818b16df7dfe89f05b",
    key: "1e96d0f88ef740e982d6f6105721c8bc",
  },
  {
    id: "wcl-bein-sports-1-max",
    name: "BEIN Sports 1 MAX (Arabic)",
    logo: "https://i.imgur.com/FjWQjdy.png",
    group: "FIFA World Cup",
    url: "https://cdn.yallashooot.pp.ua/hls/ch1.m3u8",
    type: "hls",
  },
];

export default function IPTVPlayer({ activePlaylistId, onPlaylistChange }: IPTVPlayerProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(
    WORLDCUP_LIVE_CHANNELS.find(c => c.id === "wcl-world-cup-tv") || WORLDCUP_LIVE_CHANNELS[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [displayCount, setDisplayCount] = useState(80);

  // Playlist Management States
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: "worldcup-live", name: "World Cup Live", type: "default", channels: WORLDCUP_LIVE_CHANNELS },
    { id: "sports", name: "Sports", type: "default", channels: [] },
    { id: "universal", name: "Global", type: "default", channels: [] },
    { id: "bangla", name: "Bangla", type: "default", channels: [] },
  ]);

  // Custom playlist loading states
  const [playlistTab, setPlaylistTab] = useState<"browse" | "manage">("browse");
  const [importUrl, setImportUrl] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [playerStatus, setPlayerStatus] = useState<
    "idle" | "loading" | "playing" | "error"
  >("idle");

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Custom Player controls states
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isFullscreenRef = useRef(false);
  const [isPip, setIsPip] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmuteCleanupRef = useRef<(() => void) | null>(null);

  const hlsRef = useRef<Hls | null>(null);
  const shakaRef = useRef<any>(null);
  const userMutedRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  const volumeRef = useRef(volume);
  const loadedUrlRef = useRef<string | null>(null);
  const proxyModeRef = useRef<Set<string>>(new Set());
  const [playerHeight, setPlayerHeight] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [viewerCount, setViewerCount] = useState<number | null>(null);

  const resolveStreamUrl = useCallback((url: string) => {
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      if (proxyModeRef.current.has(url)) {
        return `/api/iptv/proxy?url=${encodeURIComponent(url)}`;
      }
      return url;
    }
    return url;
  }, []);

  const [qualityLevel, setQualityLevel] = useState("auto");
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<
    { index: number; height: number; label: string }[]
  >([]);
  const qualityMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate or retrieve session ID from sessionStorage
    const getOrCreateSessionId = (): string => {
      if (typeof window === "undefined") return "";
      let id = sessionStorage.getItem("iptv_viewer_session_id");
      if (!id) {
        id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("iptv_viewer_session_id", id);
      }
      return id;
    };

    const sessionId = getOrCreateSessionId();

    const sendHeartbeat = async () => {
      try {
        const response = await fetch("/api/iptv/viewers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });
        if (response.ok) {
          const data = await response.json();
          if (typeof data.count === "number") {
            setViewerCount(data.count);
          }
        }
      } catch (error) {
        console.error("Failed to send heartbeat:", error);
      }
    };

    // Send initial heartbeat
    sendHeartbeat();

    // Send heartbeat every 15 seconds
    const interval = setInterval(sendHeartbeat, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    isMutedRef.current = isMuted;
    // Sync muted state imperatively instead of via React prop to avoid video re-renders
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // YouTube-like Double Tap Seek State
  const [activeSeekIndicator, setActiveSeekIndicator] = useState<{
    side: "left" | "right";
    visible: boolean;
  }>({ side: "left", visible: false });
  const seekIndicatorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.paused) {
        setShowControls(false);
      }
    }, 3000);
  }, []);

  const setupUnmuteOnInteraction = useCallback(() => {
    if (unmuteCleanupRef.current) {
      unmuteCleanupRef.current();
    }

    const unmute = () => {
      const v = videoRef.current;
      if (v && v.muted) {
        v.muted = false;
        setIsMuted(false);
        if (v.volume === 0) {
          v.volume = 1.0;
          setVolume(1.0);
        }
      }
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener("click", unmute);
      document.removeEventListener("touchstart", unmute);
      document.removeEventListener("keydown", unmute);
      unmuteCleanupRef.current = null;
    };

    document.addEventListener("click", unmute);
    document.addEventListener("touchstart", unmute);
    document.addEventListener("keydown", unmute);
    unmuteCleanupRef.current = cleanup;
  }, []);

  // Auto-hide controls after 3s if video is playing
  useEffect(() => {
    const timeout = setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.paused) {
        setShowControls(false);
      }
    }, 3000);
    controlsTimeoutRef.current = timeout;
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      if (unmuteCleanupRef.current) {
        unmuteCleanupRef.current();
      }
    };
  }, []);



  useLayoutEffect(() => {
    const el = playerContainerRef.current;
    if (!el) return;
    setPlayerHeight(el.offsetHeight);
    const observer = new ResizeObserver(([entry]) => {
      setPlayerHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsLargeScreen(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      isFullscreenRef.current = isFs;

      // Notify BackgroundScene to pause/resume animation
      window.dispatchEvent(new CustomEvent("iptv-fullscreen", { detail: { isFullscreen: isFs } }));

      // Batch state updates
      setIsFullscreen(isFs);
      if (!isFs) {
        // Delay orientation unlock to avoid layout thrashing during exit animation
        setTimeout(() => {
          try {
            const orientation = window.screen?.orientation as ScreenOrientation & {
              lock?: (orientation: string) => Promise<void>;
              unlock?: () => void;
            };
            if (orientation && typeof orientation.unlock === "function") {
              orientation.unlock();
            }
          } catch {
            // orientation.unlock() not supported
          }
        }, 150);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);



  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);
    const handleVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    setIsPaused(video.paused);
    setIsMuted(video.muted);
    setVolume(video.volume);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [selectedChannel, retryKey]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (video.muted && !userMutedRef.current) {
        video.muted = false;
        setIsMuted(false);
        if (video.volume === 0) {
          video.volume = 1.0;
          setVolume(1.0);
        }
      }
      video.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Play failed:", err);
        }
      });
    } else {
      video.pause();
    }
    resetControlsTimeout();
  };

  const handleMuteUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
      setIsMuted(false);
      userMutedRef.current = false;
      if (video.volume === 0) {
        video.volume = 1.0;
        setVolume(1.0);
      }
    } else {
      video.muted = true;
      setIsMuted(true);
      userMutedRef.current = true;
    }
    resetControlsTimeout();
  };

  const handleVolumeChangeSlider = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = parseFloat(e.target.value);
    video.volume = newVol;
    setVolume(newVol);
    if (newVol > 0) {
      video.muted = false;
      setIsMuted(false);
      userMutedRef.current = false;
    } else {
      video.muted = true;
      setIsMuted(true);
      userMutedRef.current = true;
    }
    resetControlsTimeout();
  };



  const handleFullscreen = () => {
    const container = playerContainerRef.current;
    const video = videoRef.current;
    if (!container) return;

    // iOS Safari: use video.webkitEnterFullscreen() since div.requestFullscreen() is unsupported
    const videoEl = video as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitExitFullscreen?: () => void;
    };
    if (
      !document.fullscreenElement &&
      !container.requestFullscreen &&
      videoEl?.webkitEnterFullscreen
    ) {
      videoEl.webkitEnterFullscreen();
      resetControlsTimeout();
      return;
    }

    if (!document.fullscreenElement) {
      container
        .requestFullscreen()
        .then(() => {
          // Delay orientation lock to let browser finish fullscreen animation
          setTimeout(() => {
            try {
              const orientation = window.screen?.orientation as ScreenOrientation & {
                lock?: (orientation: string) => Promise<void>;
                unlock?: () => void;
              };
              if (orientation && typeof orientation.lock === "function") {
                orientation
                  .lock("landscape")
                  .catch(() => { /* orientation lock not supported */ });
              }
            } catch {
              // orientation API not available
            }
          }, 300);
        })
        .catch((err) => console.warn("Fullscreen request failed:", err));
    } else {
      document
        .exitFullscreen()
        .catch((err) => console.warn("Exit fullscreen failed:", err));
    }
    resetControlsTimeout();
  };

  const handleSeek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const seekable = video.seekable;
      let newTime = video.currentTime + seconds;

      if (seekable && seekable.length > 0) {
        const start = seekable.start(0);
        const end = seekable.end(seekable.length - 1);
        if (newTime < start) newTime = start;
        if (newTime > end) newTime = end;
      } else if (video.duration) {
        if (newTime < 0) newTime = 0;
        if (newTime > video.duration) newTime = video.duration;
      }

      video.currentTime = newTime;
    } catch (err) {
      console.warn("Seeking failed:", err);
    }
    resetControlsTimeout();
  };

  // Sync isPip state with video element events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPip = () => setIsPip(true);
    const handleLeavePip = () => setIsPip(false);

    video.addEventListener("enterpictureinpicture", handleEnterPip);
    video.addEventListener("leavepictureinpicture", handleLeavePip);

    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnterPip);
      video.removeEventListener("leavepictureinpicture", handleLeavePip);
    };
  }, [selectedChannel, retryKey]);

  const handlePip = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("Failed to toggle Picture-in-Picture:", err);
    }
    resetControlsTimeout();
  };

  const isPipSupported =
    typeof document !== "undefined" && document.pictureInPictureEnabled;

  const handlePlayerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".player-controls")) {
      return;
    }

    const video = videoRef.current;
    if (video && (video.muted || video.volume === 0)) {
      video.muted = false;
      setIsMuted(false);
      if (video.volume === 0) {
        video.volume = 1.0;
        setVolume(1.0);
      }
      resetControlsTimeout();
      return;
    }

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      handlePlayPause();
      clickTimeoutRef.current = null;
    }, 200);
  };

  const handlePlayerDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".player-controls")) {
      return;
    }

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    const container = playerContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const isLeft = clickX < width / 2;

    handleSeek(isLeft ? -10 : 10);

    if (seekIndicatorTimeoutRef.current) {
      clearTimeout(seekIndicatorTimeoutRef.current);
    }
    setActiveSeekIndicator({
      side: isLeft ? "left" : "right",
      visible: true,
    });

    seekIndicatorTimeoutRef.current = setTimeout(() => {
      setActiveSeekIndicator((prev) => ({ ...prev, visible: false }));
    }, 650);
  };

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  // Track whether localStorage hydration has completed for initial mount
  const hydrated = useRef(false);

  // Hydrate playlists from localStorage on client-side mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("iptv_saved_playlists");

      if (saved) {
        const parsedSaved = JSON.parse(saved) as Playlist[];
        const customPlaylists = parsedSaved.filter(p => 
          p.id !== "default" && p.id !== "home" && p.id !== "sports" && p.id !== "universal" && p.id !== "bangla" && p.id !== "worldcup-live"
        );

        setTimeout(() => {
          setPlaylists(prev => {
            const defaults = prev.filter(p => p.type === "default");
            return [
              ...defaults,
              ...customPlaylists
            ];
          });
        }, 0);
      }

      // Mark hydration as complete after all scheduled restores
      setTimeout(() => {
        hydrated.current = true;
      }, 0);
    } catch (e) {
      console.error("Failed to load playlists from localStorage:", e);
      hydrated.current = true;
    }
  }, []);

  // Save custom playlists to localStorage whenever they change
  useEffect(() => {
    const customPlaylists = playlists.filter(p => 
      p.id !== "default" && p.id !== "home" && p.id !== "sports" && p.id !== "universal" && p.id !== "bangla" && p.id !== "worldcup-live"
    );
    try {
      localStorage.setItem("iptv_saved_playlists", JSON.stringify(customPlaylists));
    } catch (e) {
      console.error("Failed to save playlists to localStorage:", e);
    }
  }, [playlists]);

  // Sync activePlaylistId to localStorage (only after initial hydration)
  useEffect(() => {
    if (hydrated.current && activePlaylistId) {
      localStorage.setItem("iptv_active_playlist_id", activePlaylistId);
    }
  }, [activePlaylistId]);

  // --- IndexedDB Cache Helpers for default playlists ---
  const openCacheDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("iptv-cache", 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("channels")) {
          db.createObjectStore("channels");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, []);

  const getCachedChannels = useCallback(async (playlistId: string): Promise<{ channels: Channel[]; hash: string } | null> => {
    try {
      const db = await openCacheDB();
      return new Promise((resolve) => {
        const tx = db.transaction("channels", "readonly");
        const store = tx.objectStore("channels");
        const req = store.get(`cached-data-${playlistId}`);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }, [openCacheDB]);

  const setCachedChannels = useCallback(async (playlistId: string, channels: Channel[], hash: string) => {
    try {
      const db = await openCacheDB();
      const tx = db.transaction("channels", "readwrite");
      const store = tx.objectStore("channels");
      store.put({ channels, hash }, `cached-data-${playlistId}`);
    } catch (e) {
      console.warn("Failed to cache channels in IndexedDB:", e);
    }
  }, [openCacheDB]);

  // 1. Fetch channel metadata with IndexedDB cache + SHA-256 hash validation for all default playlists
  useEffect(() => {
    const defaultPlaylistsToLoad = playlists.filter(
      (p) => p.type === "default" && p.id !== "home" && p.channels.length === 0
    );

    if (defaultPlaylistsToLoad.length === 0) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    // Show loading spinner only if the active playlist is empty and needs to load
    const activePlaylist = playlists.find((p) => p.id === activePlaylistId);
    if (activePlaylist && activePlaylist.type === "default" && activePlaylist.channels.length === 0 && activePlaylist.id !== "home") {
      setTimeout(() => setLoading(true), 0);
    }

    async function loadAll() {
      try {
        await Promise.all(
          defaultPlaylistsToLoad.map(async (pl) => {
            const playlistId = pl.id;

            // Step 1: Check IndexedDB cache
            const cached = await getCachedChannels(playlistId);
            if (cached && cached.channels.length > 0) {
              setPlaylists((prev) =>
                prev.map((p) =>
                  p.id === playlistId ? { ...p, channels: cached.channels } : p
                )
              );

              // If this is the active playlist, we can hide the loading spinner now
              if (playlistId === activePlaylistId) {
                setTimeout(() => setLoading(false), 0);
              }

              // Step 2: Fetch only the hash to verify freshness
              try {
                const hashResponse = await fetch(`/api/iptv/channels/hash?type=${playlistId}`);
                if (hashResponse.ok) {
                  const { hash: serverHash } = await hashResponse.json();
                  if (serverHash === cached.hash) {
                    return; // Cache is fresh
                  }
                }
              } catch {
                // Ignore failure, fall through to reload
              }
            }

            // Step 3: Fetch full data
            const response = await fetch(`/api/iptv/channels?type=${playlistId}`);
            if (!response.ok) {
              throw new Error(`Failed to load channels for ${playlistId} (Status ${response.status})`);
            }
            const data = await response.json();
            const serverHash = response.headers.get("X-Channels-Hash") || "";

            setPlaylists((prev) =>
              prev.map((p) =>
                p.id === playlistId ? { ...p, channels: data } : p
              )
            );

            // Store in IndexedDB for next load
            if (serverHash) {
              await setCachedChannels(playlistId, data, serverHash);
            }
          })
        );
      } catch (err: unknown) {
        console.error("Error loading default playlists:", err);
        // Only set error state if it affects the active playlist
        const activePlaylistAfter = playlists.find((p) => p.id === activePlaylistId);
        if (
          activePlaylistAfter &&
          activePlaylistAfter.type === "default" &&
          activePlaylistAfter.channels.length === 0
        ) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load channel list. Please try again.";
          setError(message);
        }
      } finally {
        setTimeout(() => setLoading(false), 0);
      }
    }

    loadAll();
  }, [activePlaylistId, playlists, getCachedChannels, setCachedChannels]);

  // Sync active playlist channels to standard list representation
  useEffect(() => {
    const resolvedId = activePlaylistId === "home" ? "sports" : activePlaylistId;
    const currentPlaylist = playlists.find(p => p.id === resolvedId);
    if (currentPlaylist) {
      const selectedChannelId = selectedChannel?.id;
      const selectedChannelUrl = selectedChannel?.url;

      setTimeout(() => {
        setChannels(currentPlaylist.channels);
        if (currentPlaylist.channels.length === 0 && !loading) {
          setSelectedChannel(null);
        }
      }, 0);
    }
  }, [activePlaylistId, playlists, selectedChannel?.id, selectedChannel?.url, loading]);

  // M3U & JSON Parsing Helpers
  const parseM3U = (text: string): Channel[] => {
    const lines = text.split(/\r?\n/);
    const parsedChannels: Channel[] = [];
    let currentChannel: Partial<Channel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith("#EXTINF:")) {
        currentChannel = {};

        const logoMatch = line.match(/(?:tvg-logo|logo)="([^"]+)"/i);
        if (logoMatch) currentChannel.logo = logoMatch[1];

        const groupMatch = line.match(/(?:group-title|tvg-group|group)="([^"]+)"/i);
        if (groupMatch) currentChannel.group = groupMatch[1];

        const commaIndex = line.lastIndexOf(",");
        if (commaIndex !== -1) {
          currentChannel.name = line.substring(commaIndex + 1).trim();
        }
      } else if (
        line.startsWith("http://") ||
        line.startsWith("https://") ||
        (line && !line.startsWith("#"))
      ) {
        if (currentChannel.name || line.includes("index.m3u8") || line.includes(".m3u8") || line.includes(".mp4")) {
          currentChannel.url = line;
          if (!currentChannel.name) {
            const parts = line.split("/");
            currentChannel.name = parts[parts.length - 1] || "Channel " + (parsedChannels.length + 1);
          }
          currentChannel.id = `custom-ch-${parsedChannels.length}-${Date.now()}`;
          if (!currentChannel.group) currentChannel.group = "Custom";
          if (!currentChannel.logo) currentChannel.logo = "";

          parsedChannels.push(currentChannel as Channel);
        }
        currentChannel = {};
      }
    }

    return parsedChannels;
  };

  interface RawChannelInput {
    id?: string;
    name?: string;
    title?: string;
    logo?: string;
    logoUrl?: string;
    image?: string;
    group?: string;
    category?: string;
    url?: string;
    streamUrl?: string;
    link?: string;
  }

  const parseJSON = (text: string): Channel[] => {
    const data = JSON.parse(text);
    const list = Array.isArray(data) ? data : data.channels || data.items || [];
    if (!Array.isArray(list)) {
      throw new Error("Invalid playlist JSON format. Expected an array of channels.");
    }
    return list.map((ch: RawChannelInput, idx: number) => {
      const url = ch.url || ch.streamUrl || ch.link;
      if (!url) throw new Error(`Channel at index ${idx} is missing a streaming URL ('url')`);
      return {
        id: ch.id || `custom-json-${idx}-${Date.now()}`,
        name: ch.name || ch.title || `Channel ${idx + 1}`,
        logo: ch.logo || ch.logoUrl || ch.image || "",
        group: ch.group || ch.category || "Custom",
        url: url,
      };
    });
  };

  // Custom playlist handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let parsed: Channel[] = [];

        if (file.name.endsWith(".json")) {
          parsed = parseJSON(text);
        } else {
          parsed = parseM3U(text);
        }

        if (parsed.length === 0) {
          throw new Error("No channels could be parsed from this file.");
        }

        const name = file.name.replace(/\.[^/.]+$/, "");
        const newPlaylist: Playlist = {
          id: `playlist-${Date.now()}`,
          name: name,
          type: "upload",
          channels: parsed,
        };

        setPlaylists(prev => [...prev, newPlaylist]);
        onPlaylistChange(newPlaylist.id);
        setPlaylistTab("browse");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        setImportError(
          err instanceof Error
            ? err.message
            : "Failed to parse file. Ensure it is a valid M3U or JSON playlist."
        );
      }
    };
    reader.onerror = () => {
      setImportError("Error reading file.");
    };
    reader.readAsText(file);
  };

  const handleUrlImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const proxiedUrl = `/api/iptv/proxy?url=${encodeURIComponent(importUrl.trim())}`;
      const res = await fetch(proxiedUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch from URL (Status ${res.status})`);
      }

      const text = await res.text();
      let parsed: Channel[] = [];

      const trimmedText = text.trim();
      if (trimmedText.startsWith("[") || trimmedText.startsWith("{")) {
        parsed = parseJSON(text);
      } else {
        parsed = parseM3U(text);
      }

      if (parsed.length === 0) {
        throw new Error("No channels could be parsed from this URL.");
      }

      let name = playlistName.trim();
      if (!name) {
        try {
          const urlObj = new URL(importUrl);
          name = urlObj.hostname + urlObj.pathname.substring(urlObj.pathname.lastIndexOf("/"));
          name = name.replace(/\.[^/.]+$/, "");
        } catch {
          name = "Imported URL Playlist";
        }
      }

      const newPlaylist: Playlist = {
        id: `playlist-${Date.now()}`,
        name: name,
        type: "url",
        url: importUrl,
        channels: parsed,
      };

      setPlaylists(prev => [...prev, newPlaylist]);
      onPlaylistChange(newPlaylist.id);
      setImportUrl("");
      setPlaylistName("");
      setPlaylistTab("browse");
    } catch (err) {
      setImportError(
        err instanceof Error
          ? err.message
          : "Failed to import from URL. Please check the link or CORS policy."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeletePlaylist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === "default" || id === "home" || id === "sports" || id === "universal" || id === "bangla" || id === "worldcup-live") return;

    setPlaylists(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (activePlaylistId === id) {
        onPlaylistChange("sports");
      }
      return updated;
    });
  };

  // 2. Initialize player and load stream (HLS or DASH+DRM)
  const initializeStream = useCallback(
    (chan: Channel, isUserClick: boolean) => {
      const video = videoRef.current;
      if (!video) return;

      setPlayerStatus("loading");
      loadedUrlRef.current = chan.url;

      if (isUserClick) {
        if (!userMutedRef.current) {
          video.muted = false;
          setIsMuted(false);
          if (video.volume === 0) {
            video.volume = 1.0;
            setVolume(1.0);
          }
        } else {
          video.muted = true;
          setIsMuted(true);
        }
      } else {
        video.volume = volumeRef.current;
        video.muted = isMutedRef.current;
      }

      video.pause();
      video.removeAttribute("src");
      video.load();

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (shakaRef.current) {
        shakaRef.current.destroy();
        shakaRef.current = null;
      }

      const isDash = chan.type === "dash" || chan.url.endsWith(".mpd");

      if (isDash) {
        (async () => {
          try {
            const shakaModule = await import("shaka-player");
            const shaka = shakaModule.default || shakaModule;
            if (loadedUrlRef.current !== chan.url) return;

            shaka.polyfill.installAll();

            if (!shaka.Player.isBrowserSupported()) {
              setPlayerStatus("error");
              return;
            }

            const player = new shaka.Player();
            shakaRef.current = player;
            await player.attach(video);

            const useProxy = proxyModeRef.current.has(chan.url);

            player.configure({
              manifest: {
                defaultPresentationDelay: 8,
                ignoreDrmInfo: true,
                dash: { ignoreMinBufferTime: true, ignoreSuggestedPresentationDelay: true, autoCorrectDrift: true },
              },
              streaming: {
                bufferingGoal: 10,
                rebufferingGoal: 0.8,
                bufferBehind: 12,
                stallEnabled: true,
                stallThreshold: 1,
                stallSkip: 0.15,
                retryParameters: { maxAttempts: useProxy ? 12 : 2, baseDelay: 200, backoffFactor: 1.5, fuzzFactor: 0.25, timeout: 10000 },
              },
              abr: {
                enabled: true,
                defaultBandwidthEstimate: 4500000,
                switchInterval: 1,
                clearBufferSwitch: false,
                restrictToElementSize: true,
                restrictToScreenSize: true,
                bandwidthDowngradeTarget: 0.92,
                bandwidthUpgradeTarget: 0.72,
              },
            });

            if (chan.kid && chan.key) {
              player.configure({
                drm: {
                  clearKeys: { [chan.kid.toLowerCase()]: chan.key.toLowerCase() },
                },
              });
            }

            if (useProxy) {
              const netEngine = player.getNetworkingEngine();
              if (netEngine) {
                netEngine.registerRequestFilter((type: any, request: { uris: string[] }) => {
                  const url = request.uris[0];
                  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
                    request.uris[0] = `/api/iptv/proxy?url=${encodeURIComponent(url)}`;
                  }
                });
              }
            }

            player.addEventListener("error", (event: any) => {
              if (!useProxy && !proxyModeRef.current.has(chan.url)) {
                proxyModeRef.current.add(chan.url);
                loadedUrlRef.current = null;
                setRetryKey((k) => k + 1);
                return;
              }
              if (loadedUrlRef.current === null) return;
              const detail = event?.detail;
              console.warn("[SHAKA] DASH playback error:", JSON.stringify(detail));
              setPlayerStatus("error");
            });

            const dashUrl = resolveStreamUrl(chan.url);
            await player.load(dashUrl);

            if (loadedUrlRef.current !== chan.url) {
              await player.destroy().catch(() => {});
              return;
            }

            try {
              const tracks = player.getVariantTracks().filter((t: any) => t.videoCodec);
              const seen = new Set<number>();
              const qs = tracks
                .map((t: any, idx: number) => ({
                  index: idx,
                  height: t.height || 0,
                  label: t.height ? `${t.height}p` : `Quality ${idx}`,
                }))
                .filter((q: any) => {
                  if (seen.has(q.height)) return false;
                  seen.add(q.height);
                  return true;
                })
                .sort((a: any, b: any) => b.height - a.height);
              if (qs.length > 0) setAvailableQualities(qs);
            } catch {}

            video.play().then(() => {
              setPlayerStatus("playing");
              setIsPaused(false);
            }).catch((err) => {
              if (err.name === "NotAllowedError") {
                video.muted = true;
                setIsMuted(true);
                video.play().then(() => {
                  setPlayerStatus("playing");
                  setIsPaused(false);
                  setupUnmuteOnInteraction();
                }).catch(() => {
                  setPlayerStatus("playing");
                  setIsPaused(true);
                });
              } else {
                if (err.name !== "AbortError") {
                  console.warn("Shaka play failed:", err);
                }
                setPlayerStatus("playing");
                setIsPaused(video.paused);
              }
            });
          } catch (err) {
            if (loadedUrlRef.current !== chan.url) return;
            if (!proxyModeRef.current.has(chan.url)) {
              proxyModeRef.current.add(chan.url);
              loadedUrlRef.current = null;
              setRetryKey((k) => k + 1);
              return;
            }
            console.error("[SHAKA] Load error:", err);
            setPlayerStatus("error");
          }
        })();
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 0,
          startLevel: -1,
        });
        hlsRef.current = hls;
        hls.attachMedia(video);
        const playableUrl = resolveStreamUrl(chan.url);
        hls.loadSource(playableUrl);

        let hlsRetryCount = 0;
        const MAX_HLS_RETRIES = 3;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          hlsRetryCount = 0;
          if (hls.levels && hls.levels.length > 0) {
            const qs = hls.levels.map((level, idx) => ({
              index: idx,
              height: level.height || 0,
              label: level.height ? `${level.height}p` : `Quality ${idx}`,
            }));
            setAvailableQualities(qs);
          }
          if (!video.paused) {
            setPlayerStatus("playing");
            setIsPaused(false);
            return;
          }
          video.play().then(() => {
            setPlayerStatus("playing");
            setIsPaused(false);
          }).catch((err) => {
            if (err.name === "NotAllowedError") {
              video.muted = true;
              setIsMuted(true);
              video.play().then(() => {
                setPlayerStatus("playing");
                setIsPaused(false);
                setupUnmuteOnInteraction();
              }).catch((playErr) => {
                if (playErr.name !== "AbortError") {
                  console.error("Muted autoplay failed:", playErr);
                }
                setPlayerStatus("playing");
                setIsPaused(true);
              });
            } else {
              if (err.name !== "AbortError") {
                console.warn("Play failed:", err);
              }
              setPlayerStatus("playing");
              setIsPaused(video.paused);
            }
          });
        });

        hls.on(Hls.Events.ERROR, (_event: string, data: { fatal: boolean; type: string; details: string }) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR && !proxyModeRef.current.has(chan.url)) {
              proxyModeRef.current.add(chan.url);
              loadedUrlRef.current = null;
              setRetryKey((k) => k + 1);
              return;
            }
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (hlsRetryCount < MAX_HLS_RETRIES) {
                  hlsRetryCount++;
                  hls.startLoad();
                } else {
                  setPlayerStatus("error");
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                if (hlsRetryCount < MAX_HLS_RETRIES) {
                  hlsRetryCount++;
                  hls.recoverMediaError();
                } else {
                  setPlayerStatus("error");
                }
                break;
              default:
                setPlayerStatus("error");
                break;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        const playableUrl = resolveStreamUrl(chan.url);
        video.src = playableUrl;

        const onLoadedMetadata = () => {
          if (!video.paused) {
            setPlayerStatus("playing");
            setIsPaused(false);
            return;
          }
          video.play().then(() => {
            setPlayerStatus("playing");
            setIsPaused(false);
          }).catch((err) => {
            if (err.name === "NotAllowedError") {
              video.muted = true;
              setIsMuted(true);
              video.play().then(() => {
                setPlayerStatus("playing");
                setIsPaused(false);
                setupUnmuteOnInteraction();
              }).catch((playErr) => {
                if (playErr.name !== "AbortError") {
                  console.error("Native muted autoplay failed:", playErr);
                }
                setPlayerStatus("playing");
                setIsPaused(true);
              });
            } else {
              if (err.name !== "AbortError") {
                console.warn("Native play failed:", err);
              }
              setPlayerStatus("playing");
              setIsPaused(video.paused);
            }
          });
        };

        const onError = () => {
          setPlayerStatus("error");
        };

        video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
        video.addEventListener("error", onError, { once: true });
      } else {
        setPlayerStatus("error");
      }

      if (isUserClick) {
        video.play().catch((err) => {
          if (err.name !== "AbortError") {
            console.warn("Synchronous play gesture registered:", err);
          }
        });
      }
    },
    [setupUnmuteOnInteraction]
  );

  // 3. Play stream when a channel is selected or retryKey changes
  useEffect(() => {
    if (!selectedChannel) return;

    if (loadedUrlRef.current !== selectedChannel.url) {
      initializeStream(selectedChannel, false);
    }
  }, [selectedChannel, retryKey, initializeStream, loading]);

  // Clean up Hls, Shaka and video elements on component unmount
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (shakaRef.current) {
        shakaRef.current.destroy();
        shakaRef.current = null;
      }
      if (video) {
        video.src = "";
      }
      if (unmuteCleanupRef.current) {
        unmuteCleanupRef.current();
      }
      loadedUrlRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (qualityMenuRef.current && !qualityMenuRef.current.contains(e.target as Node)) {
        setShowQualityMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReload = () => {
    loadedUrlRef.current = null;
    setRetryKey((prev) => prev + 1);
  };

  const handleQualityChange = (level: string) => {
    setQualityLevel(level);
    setShowQualityMenu(false);
    const hls = hlsRef.current;
    if (hls) {
      if (level === "auto") {
        hls.currentLevel = -1;
      } else {
        const idx = availableQualities.findIndex(
          (q) => q.label === level || String(q.height) === level
        );
        if (idx >= 0) hls.currentLevel = availableQualities[idx].index;
      }
      return;
    }
    const shaka = shakaRef.current;
    if (shaka) {
      if (level === "auto") {
        shaka.configure({ abr: { enabled: true } });
      } else {
        shaka.configure({ abr: { enabled: false } });
        const match = availableQualities.find(
          (q) => q.label === level || String(q.height) === level
        );
        if (match) {
          const tracks = shaka.getVariantTracks().filter((t: any) => t.videoCodec);
          const target = tracks.find((t: any) => t.height === match.height);
          if (target) shaka.selectVariantTrack(target, true);
        }
      }
    }
  };

  const handleChannelSelect = useCallback(
    (chan: Channel) => {
      setSelectedChannel(chan);
      initializeStream(chan, true);

      if (window.innerWidth < 1024 && playerWrapperRef.current) {
        setTimeout(() => {
          playerWrapperRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    },
    [initializeStream]
  );

  const categories = useMemo(() => {
    const resolvedId = activePlaylistId === "home" ? "sports" : activePlaylistId;
    const activePlaylist = playlists.find(p => p.id === resolvedId);
    const cats = ["All", ...Array.from(new Set(channels.map((c) => c.group)))];
    if (activePlaylist && (activePlaylist.id === "sports" || activePlaylist.id === "bangla")) {
      return [];
    }
    return cats;
  }, [channels, activePlaylistId, playlists]);

  const filteredChannels = useMemo(() => channels.filter((c) => {
    const matchesCategory =
      selectedCategory === "All" || c.group === selectedCategory;
    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [channels, selectedCategory, searchQuery]);

  const visibleChannels = useMemo(() => filteredChannels.slice(0, displayCount), [filteredChannels, displayCount]);
  const hasMore = displayCount < filteredChannels.length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-full mx-auto space-y-4 md:space-y-6 pt-4 md:pt-6 min-h-screen pb-12 px-3 sm:px-4 md:px-6 lg:px-10 xl:px-12 2xl:px-16 text-white">
      {error ? (
        <div className="glass-card p-12 text-center space-y-6 border border-rose-500/20 max-w-2xl mx-auto rounded-3xl bg-rose-500/5">
          <ShieldAlert className="text-rose-500 mx-auto" size={48} />
          <h3 className="text-2xl font-bold">Something went wrong</h3>
          <p className="text-zinc-300 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary hover:bg-primary-dark font-bold rounded-2xl transition-all shadow-lg shadow-primary/20"
          >
            Reload Page
          </button>
        </div>
      ) : loading ? (
          <div className="flex flex-col gap-6 w-full items-center animate-pulse">
          {/* 1. Player Card Skeleton */}
          <div className="w-full aspect-video rounded-2xl md:rounded-3xl bg-white/[0.01] border border-white/10 sm:border-white/5 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Radio size={32} className="text-white/20 animate-pulse" />
            </div>
          </div>

          {/* 2. Middle Cards Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Card 1: Channel Details Skeleton */}
            <div className="glass-card p-4 sm:p-6 border border-white/10 sm:border-white/5 rounded-2xl md:rounded-3xl flex flex-row items-center gap-4 bg-white/[0.01] w-full animate-pulse">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 sm:h-5 bg-white/10 rounded w-2/3 animate-pulse" />
                <div className="h-3.5 bg-white/10 rounded w-1/3 animate-pulse" />
              </div>
            </div>

            {/* Card 2: Total Channels Count Skeleton */}
            <div className="glass-card p-4 sm:p-6 border border-white/10 sm:border-white/5 rounded-2xl md:rounded-3xl flex flex-row items-center gap-4 bg-white/[0.01] w-full animate-pulse">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/10 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/10 rounded w-1/3 animate-pulse" />
                <div className="h-5 bg-white/10 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>

          {/* 3. Channels List Skeleton Card */}
          <div className="w-full glass-card p-4 sm:p-6 border border-white/10 sm:border-white/5 rounded-2xl md:rounded-3xl bg-white/[0.01] flex flex-col h-[600px] sm:h-[700px]">
            {/* Mock Playlist Header & Tab Bar */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 sm:border-white/5 mb-3 sm:mb-4 flex-wrap gap-2 animate-pulse">
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 sm:border-white/5 w-full sm:w-auto gap-2">
                <div className="h-8 bg-white/10 rounded-lg w-28 sm:w-32" />
                <div className="h-8 bg-white/5 rounded-lg w-28 sm:w-32" />
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 sm:border-white/5 w-full sm:w-auto gap-2">
                <div className="h-8 bg-white/5 rounded-lg w-20" />
                <div className="h-8 bg-white/10 rounded-lg w-32" />
              </div>
            </div>

            {/* Mock Search and Filters */}
            <div className="space-y-3 sm:space-y-4 pb-3 sm:pb-4 border-b border-white/10 sm:border-white/5 animate-pulse">
              <div className="h-10 bg-white/5 rounded-xl sm:rounded-2xl w-full" />
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-8 bg-white/5 rounded-lg sm:rounded-xl w-16 sm:w-20 flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Mock Channels Grid */}
            <div className="flex-1 min-h-0 overflow-y-auto pt-3 sm:pt-4 pr-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10 sm:border-white/5 animate-pulse"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5 sm:space-y-2">
                      <div className="h-2.5 sm:h-3 w-1/3 bg-white/10 rounded" />
                      <div className="h-3.5 sm:h-4 w-2/3 bg-white/10 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
          <div className="flex flex-col gap-6 w-full items-center">
          {/* 🏆 World Cup 2026 Hub */}
          <div id="world-cup-hub" className="w-full mb-6">
            <WorldCupHub />
          </div>

          {/* 1. Player + World Cup Live Sidebar */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 w-full">
            {/* Player Card */}
            <div
              ref={playerWrapperRef}
              className={`${!isFullscreen ? "w-full lg:w-2/3 xl:w-3/4" : "w-full"}`}
            >
              <div
                ref={playerContainerRef}
                onMouseMove={handleMouseMove}
                onClick={handlePlayerClick}
                onDoubleClick={handlePlayerDoubleClick}
                className={`bg-black shadow-2xl group transition-[width,height] duration-200 ${isFullscreen
                      ? "relative w-full h-full bg-black"
                      : "relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-black border border-white/10 sm:border-white/5 w-full"
                  } ${showControls ? "cursor-default" : "cursor-none"
                  }`}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain bg-black cursor-pointer"
                />

                {/* Top-left: Picture-in-Picture */}
                {isPipSupported && (
                  <div className="absolute top-4 left-4 z-30">
                    <button
                      onClick={handlePip}
                      className={`p-2 rounded-lg hover:bg-white/10 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 ${
                        isPip ? "text-primary bg-white/10" : ""
                      }`}
                      title="Picture in Picture"
                      aria-label="Picture in Picture"
                    >
                      <PictureInPicture size={16} className="sm:size-[18px]" />
                    </button>
                  </div>
                )}

                {/* Top-right: LIVE indicator */}
                <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-rose-600/90 text-white font-bold text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded border border-rose-500/30 animate-pulse select-none pointer-events-auto">
                    <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                    <span>LIVE</span>
                  </div>
                </div>

                {/* Center Play Button Overlay when Paused */}
                {playerStatus === "playing" && isPaused && (
                  <div
                    className="absolute inset-0 hidden sm:flex items-center justify-center bg-black/35 z-10 cursor-pointer transition-colors hover:bg-black/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause();
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-lg shadow-primary/30 border border-white/10"
                    >
                      <Play
                        size={28}
                        className="fill-white translate-x-0.5 md:w-8 md:h-8"
                      />
                    </motion.div>
                  </div>
                )}

                {/* YouTube-like Double Click Seek Visual Ripple Overlay */}
                <AnimatePresence>
                  {activeSeekIndicator.visible && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute inset-y-0 w-1/3 flex items-center justify-center pointer-events-none z-30 bg-white/5 ${activeSeekIndicator.side === "left"
                          ? "left-0 rounded-r-full"
                          : "right-0 rounded-l-full"
                        }`}
                    >
                      {activeSeekIndicator.side === "left" ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex flex-col items-center gap-1 text-white bg-black/60 px-4 py-3 rounded-full backdrop-blur-md border border-white/10"
                        >
                          <ChevronsLeft className="h-6 w-6 text-primary animate-pulse" />
                          <span className="text-xs font-black tracking-widest">
                            -10s
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex flex-col items-center gap-1 text-white bg-black/60 px-4 py-3 rounded-full backdrop-blur-md border border-white/10"
                        >
                          <ChevronsRight className="h-6 w-6 text-primary animate-pulse" />
                          <span className="text-xs font-black tracking-widest">
                            +10s
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>


                {/* Loader Overlay */}
                {playerStatus === "loading" && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-10">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold tracking-wider text-primary animate-pulse">
                      FETCHING IPTV LIVE STREAM...
                    </span>
                  </div>
                )}

                {/* Error/Offline Overlay */}
                {playerStatus === "error" && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 z-10 px-6 text-center">
                    <ShieldAlert className="text-rose-500" size={40} />
                    <span className="text-base font-bold text-white">
                      Stream Currently Unavailable
                    </span>
                    <span className="text-xs text-zinc-400 max-w-sm">
                      This live TV link might be offline, or blocked by the
                      original broadcaster.
                    </span>
                    <button
                      onClick={handleReload}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-xl border border-white/10 transition-colors"
                    >
                      <RefreshCw size={12} />
                      <span>Try Reconnecting</span>
                    </button>
                  </div>
                )}

                {/* Idle Overlay */}
                {playerStatus === "idle" && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-10">
                    <Radio
                      size={40}
                      className="text-zinc-500 animate-pulse"
                    />
                    <span className="text-sm text-zinc-300 font-medium">
                      Select a channel to play
                    </span>
                  </div>
                )}

                {/* Custom Controls Overlay */}
                {playerStatus === "playing" && (
                  <div
                    className={`player-controls absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between gap-3 transition-all duration-300 z-20 ${showControls
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 pointer-events-none"
                      }`}
                  >
                    {/* Left controls - Play/Pause + Volume */}
                    <div className="flex items-center gap-1 sm:gap-3">
                      <button
                        onClick={handlePlayPause}
                        className="p-2 sm:p-2 rounded-lg hover:bg-white/10 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={isPaused ? "Play" : "Pause"}
                      >
                          {isPaused ? (
                          <Play size={16} className="fill-white sm:size-[18px]" />
                        ) : (
                          <Pause size={16} className="fill-white sm:size-[18px]" />
                        )}
                      </button>
                      <button
                        onClick={handleMuteUnmute}
                        className="p-2 sm:p-2 rounded-lg hover:bg-white/10 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={16} className="sm:size-[18px]" />
                        ) : (
                          <Volume2 size={16} className="sm:size-[18px]" />
                        )}
                      </button>
                      <div className={`${isFullscreen ? 'flex' : 'hidden'} sm:flex items-center gap-1.5`}>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChangeSlider}
                          className="w-16 sm:w-20 h-1.5 rounded-lg appearance-none cursor-pointer outline-none transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md"
                          style={{
                            background: `linear-gradient(to right, #F5A623 0%, #F5A623 ${(isMuted ? 0 : volume) * 100
                              }%, rgba(255, 255, 255, 0.25) ${(isMuted ? 0 : volume) * 100
                              }%, rgba(255, 255, 255, 0.25) 100%)`,
                          }}
                          aria-label="Volume"
                        />
                      </div>
                    </div>

                    {/* Right controls - Reload, Quality, Fullscreen */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={handleReload}
                        className="p-2 sm:p-2 rounded-lg hover:bg-white/10 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Reload Stream"
                        aria-label="Reload Stream"
                      >
                        <RotateCw size={16} className="sm:size-[18px]" />
                      </button>

                      {availableQualities.length > 0 && (
                        <div className="relative" ref={qualityMenuRef}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowQualityMenu((prev) => !prev);
                            }}
                            className="p-2 sm:p-2 rounded-lg hover:bg-white/10 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center gap-1.5"
                            title="Video Quality"
                            aria-label="Video Quality"
                          >
                            <Settings size={16} className="sm:size-[18px]" />
                            <span className="text-[10px] font-bold tracking-wider hidden sm:inline">
                              {qualityLevel === "auto" ? "AUTO" : `${qualityLevel}`}
                            </span>
                          </button>

                          {showQualityMenu && (
                            <div className="absolute bottom-full right-0 mb-2 bg-black/95 border border-white/15 rounded-xl shadow-2xl overflow-hidden min-w-[140px] backdrop-blur-xl z-50">
                              <div className="px-3 py-2 border-b border-white/10">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Quality</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQualityChange("auto");
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-colors ${
                                  qualityLevel === "auto"
                                    ? "text-primary bg-primary/10"
                                    : "text-white hover:bg-white/10"
                                }`}
                              >
                                <span>Auto (Recommended)</span>
                                {qualityLevel === "auto" && <Check size={14} className="text-primary" />}
                              </button>
                              {availableQualities.map((q) => (
                                <button
                                  key={q.index}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQualityChange(q.label);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-colors ${
                                    qualityLevel === q.label
                                      ? "text-primary bg-primary/10"
                                      : "text-white hover:bg-white/10"
                                  }`}
                                >
                                  <span>{q.label}</span>
                                  {qualityLevel === q.label && <Check size={14} className="text-primary" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={handleFullscreen}
                        className="p-2 sm:p-2 rounded-lg hover:bg-white/10 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                      >
                          {isFullscreen ? (
                          <Minimize size={16} className="sm:size-[18px]" />
                        ) : (
                          <Maximize size={16} className="sm:size-[18px]" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* World Cup Live Sidebar */}
            <div
              id="worldcup-live-section"
              className={`${!isFullscreen ? "w-full lg:w-1/3 xl:w-1/4" : "hidden"}`}
            >
              <div
                className="glass-card p-4 sm:p-5 border border-[#F5A623]/20 rounded-2xl md:rounded-3xl bg-[#F5A623]/[0.02] flex flex-col max-h-[500px]"
                style={!isFullscreen && isLargeScreen && playerHeight > 0 ? { height: playerHeight } : undefined}
              >
                <div className="flex items-center gap-2 pb-3 border-b border-[#F5A623]/10 mb-3">
                  <span className="text-lg">🏆</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-white truncate">World Cup Live</h3>
                    <p className="text-[9px] text-[#F5A623] font-bold tracking-wider uppercase">
                      {WORLDCUP_LIVE_CHANNELS.length} Channels
                    </p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                </div>
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar space-y-2 pr-1">
                  {WORLDCUP_LIVE_CHANNELS.map((chan) => {
                    const isSelected = selectedChannel?.id === chan.id;
                    return (
                      <button
                        key={chan.id}
                        onClick={() => handleChannelSelect(chan)}
                        className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F5A623]/10 border-[#F5A623]/30 text-[#F5A623] shadow-lg shadow-[#F5A623]/5"
                            : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20 text-white"
                        }`}
                      >
                        {chan.logo ? (
                          <Image
                            src={chan.logo}
                            alt={chan.name}
                            width={32}
                            height={32}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                            className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg bg-white/5 p-0.5 border border-white/10 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-[#F5A623]/30 to-violet-500/30 flex items-center justify-center font-bold text-[10px] text-[#F5A623] border border-[#F5A623]/20 flex-shrink-0">
                            {getInitials(chan.name)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 truncate">{chan.group}</p>
                          <p className="text-xs sm:text-sm font-bold truncate">{chan.name}</p>
                        </div>
                        {isSelected && (
                          <Play size={12} className="fill-[#F5A623] text-[#F5A623] animate-pulse flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>



          {/* 3. Main Content Area: Sidebar + Channel List */}
          <div id="channels-section" className="flex flex-col lg:flex-row gap-6 w-full">
            
            {/* Sidebar: Your Playlists */}
            <div className="order-1 lg:order-none w-full lg:w-1/3 xl:w-1/4 glass-card p-4 sm:p-6 border border-white/10 sm:border-white/5 rounded-2xl md:rounded-3xl bg-white/[0.01] flex flex-col max-h-[280px] lg:max-h-none lg:h-[600px] xl:h-[700px]">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 sm:border-white/5 mb-3 sm:mb-4">
                <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 sm:border-white/5 w-full">
                  <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold w-full bg-primary text-white shadow-lg shadow-primary/20 cursor-default">
                    <List size={14} />
                    <span className="whitespace-nowrap">Your Playlists</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2.5">
                {playlists.filter(pl => pl.id !== "worldcup-live").map((pl) => {
                  const isActive = pl.id === activePlaylistId;
                  return (
                    <div
                      key={pl.id}
                      onClick={() => {
                        onPlaylistChange(pl.id);
                        setPlaylistTab("browse");
                      }}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer group/item ${isActive
                          ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5"
                          : "bg-white/[0.02] border-white/10 sm:border-white/5 text-white hover:bg-white/[0.05] hover:border-white/10"
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border flex-shrink-0 ${isActive ? "bg-primary/20 border-primary/20" : "bg-white/5 border-white/10"
                          }`}>
                          {pl.type === "default" ? (
                            <Tv size={14} className="sm:w-4 sm:h-4" />
                          ) : pl.type === "url" ? (
                            <Link size={14} className="sm:w-4 sm:h-4" />
                          ) : (
                            <FileText size={14} className="sm:w-4 sm:h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h5 className="font-bold text-xs sm:text-sm truncate pr-2">{pl.name}</h5>
                          <p className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                            {pl.channels.length} Channels
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {isActive && (
                          <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Check size={10} className="sm:w-3 sm:h-3 stroke-[3]" />
                          </span>
                        )}
                        {pl.type !== "default" &&
                          pl.id !== "default" &&
                          pl.id !== "home" &&
                          pl.id !== "sports" &&
                          pl.id !== "universal" &&
                          pl.id !== "bangla" &&
                          pl.id !== "worldcup-live" && (
                          <button
                            onClick={(e) => handleDeletePlaylist(pl.id, e)}
                            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 focus:opacity-100 cursor-pointer"
                            title="Delete Playlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Channel List Card */}
            <div className="w-full lg:w-2/3 xl:w-3/4 glass-card p-4 sm:p-6 border border-white/10 sm:border-white/5 rounded-2xl md:rounded-3xl bg-white/[0.01] flex flex-col h-[600px] sm:h-[700px]">
            {/* Playlist Header */}
            <div className="flex items-center justify-end gap-2 pb-3 sm:pb-4 border-b border-white/10 sm:border-white/5 mb-3 sm:mb-4">
              {viewerCount !== null && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs text-zinc-300 select-none bg-white/5 border border-white/10 sm:border-white/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                  <span className="text-white font-bold whitespace-nowrap">
                    {viewerCount} {viewerCount === 1 ? "Watcher" : "Watchers"}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs text-zinc-300 select-none bg-white/5 border border-white/10 sm:border-white/5">
                <Tv size={14} />
                <span className="text-white font-bold whitespace-nowrap">{channels.length} Channels</span>
              </div>
            </div>

            {playlistTab === "browse" ? (
              <>
                {/* Search and Filters */}
                <div className="space-y-3 sm:space-y-4 pb-3 sm:pb-4 border-b border-white/10 sm:border-white/5">
                  <div className="relative flex items-center bg-white/5 border border-white/10 sm:border-white/5 focus-within:border-primary/50 rounded-xl sm:rounded-2xl p-1 transition-colors">
                    <Search className="text-zinc-400 ml-2.5 sm:ml-3" size={15} />
                    <input
                      type="text"
                      placeholder="Search live TV..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(80); }}
                      className="flex-1 bg-transparent border-none outline-none py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm text-white placeholder:text-zinc-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setDisplayCount(80);
                        }}
                        className="p-1 mr-1.5 sm:mr-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Clear Search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Categories horizontally scrollable */}
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setDisplayCount(80); }}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap border transition-all ${selectedCategory === cat
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "bg-white/5 border-white/10 sm:border-white/5 text-zinc-300 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List styled as a responsive grid */}
                <div className="flex-1 min-h-0 overflow-y-auto pt-3 sm:pt-4 pr-1 custom-scrollbar">
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Array.from({ length: 12 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10 sm:border-white/5 animate-pulse"
                        >
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10" />
                          <div className="flex-1 space-y-1.5 sm:space-y-2">
                            <div className="h-2.5 sm:h-3 w-1/3 bg-white/10 rounded" />
                            <div className="h-3.5 sm:h-4 w-2/3 bg-white/10 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredChannels.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400 text-sm font-medium">
                      No channels found match your filters.
                    </div>
                  ) : (
                    <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {visibleChannels.map((chan) => {
                        const isSelected = selectedChannel?.id === chan.id;
                        return (
                          <button
                            key={chan.id}
                            onClick={() => handleChannelSelect(chan)}
                            className={`w-full flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all group ${isSelected
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-white/[0.02] border-white/10 sm:border-white/5 text-white hover:bg-white/[0.05] hover:border-white/10"
                              }`}
                          >
                            {chan.logo ? (
                              <Image
                                src={chan.logo}
                                alt={chan.name}
                                width={40}
                                height={40}
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                }}
                                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg sm:rounded-xl bg-white/5 p-0.5 border border-white/10 group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center font-bold text-xs border border-white/10 text-zinc-300 group-hover:text-white transition-colors">
                                {getInitials(chan.name)}
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isSelected ? "text-primary/75" : "text-zinc-400"
                                  }`}
                              >
                                {chan.group}
                              </p>
                              <p className="text-[13px] sm:text-sm font-bold truncate">
                                {chan.name}
                              </p>
                            </div>

                            {isSelected && (
                              <Play
                                size={13}
                                className="sm:w-3.5 sm:h-3.5 fill-primary text-primary animate-pulse"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                      <div className="flex justify-center pt-4 pb-2">
                        <button
                          onClick={() => setDisplayCount(prev => prev + 80)}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs sm:text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.08] hover:border-white/10 transition-all active:scale-95"
                        >
                          <ChevronsRight size={14} className="rotate-90" />
                          <span>Load More ({filteredChannels.length - displayCount} remaining)</span>
                        </button>
                      </div>
                    )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar text-left">
                {/* Import Playlist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* URL Import Box */}
                  <form onSubmit={handleUrlImport} className="glass-card p-4 sm:p-5 border border-white/10 sm:border-white/5 rounded-2xl bg-white/[0.01] flex flex-col justify-between min-h-[180px] hover:border-primary/20 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Link size={18} />
                        </div>
                        <h4 className="font-bold text-sm sm:text-base">Load from URL</h4>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Playlist Name (e.g. My IPTV)"
                          value={playlistName}
                          onChange={(e) => setPlaylistName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 sm:border-white/5 focus-within:border-primary/40 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-zinc-400 outline-none transition-colors"
                        />
                        <input
                          type="url"
                          placeholder="https://example.com/playlist.m3u"
                          value={importUrl}
                          onChange={(e) => setImportUrl(e.target.value)}
                          required
                          className="w-full bg-white/5 border border-white/10 sm:border-white/5 focus-within:border-primary/40 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-zinc-400 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isImporting}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/10 disabled:opacity-50 active:scale-95 cursor-pointer"
                    >
                      {isImporting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Importing Stream...</span>
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          <span>Import Playlist</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* File Upload Box */}
                  <div className="glass-card p-4 sm:p-5 border border-white/10 sm:border-white/5 rounded-2xl bg-white/[0.01] flex flex-col justify-between min-h-[180px] hover:border-primary/20 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Upload size={18} />
                        </div>
                        <h4 className="font-bold text-sm sm:text-base">Upload Playlist File</h4>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Upload local .m3u, .m3u8, or .json playlist files. Stored securely in your browser cache.
                      </p>
                    </div>

                    <div className="mt-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".m3u,.m3u8,.json"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                      >
                        <Upload size={14} />
                        <span>Choose M3U or JSON File</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Validation Errors */}
                {importError && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                    <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

              </div>
            )}
          </div>
          </div>


          {/* Playlists Manager Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setPlaylistTab(playlistTab === "manage" ? "browse" : "manage");
                setTimeout(() => {
                  document.getElementById("channels-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg ${playlistTab === "manage"
                  ? "bg-primary text-white shadow-primary/20"
                  : "bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
            >
              <Upload size={16} />
              <span>Playlists Manager</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function WorldCupHub() {
  const [activeTab, setActiveTab] = useState<"matches" | "groups">("matches");
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let active = true;
    const fetchWorldCup = async () => {
      try {
        const res = await fetch("/api/worldcup");
        if (res.ok) {
          const json = await res.json();
          if (active) {
            setLiveData(json);
          }
        }
      } catch (err) {
        console.error("Error fetching live world cup data:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchWorldCup();
    const interval = setInterval(fetchWorldCup, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const matches = liveData?.matches || [];
  const groups = liveData?.groups || [];

  const todayMatches = matches.filter((m: any) => m.date === today);
  const upcomingMatches = matches.filter(
    (m: any) => m.date > today && m.stage === "Group Stage"
  ).slice(0, 10);

  if (loading) {
    return (
      <div className="glass-card p-4 sm:p-6 border border-white/10 rounded-2xl md:rounded-3xl bg-white/[0.01]">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">FIFA World Cup 2026</h2>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium">USA &middot; Canada &middot; Mexico</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1 bg-rose-600/90 text-white font-bold text-[9px] tracking-wider uppercase px-2 py-1 rounded border border-rose-500/30 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span>LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-fit mb-4">
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-[#F5A623] text-black shadow-lg">
            Fixtures &amp; Schedule
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-zinc-400 hover:text-white">
            Group Standings
          </button>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse border border-white/10" />
          ))}
        </div>
        <div className="mt-3 text-[9px] text-zinc-500 text-center">
          Loading live match data...
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 sm:p-6 border border-white/10 rounded-2xl md:rounded-3xl bg-white/[0.01]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">FIFA World Cup 2026</h2>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-medium">USA &middot; Canada &middot; Mexico</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1 bg-rose-600/90 text-white font-bold text-[9px] tracking-wider uppercase px-2 py-1 rounded border border-rose-500/30 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-fit mb-4">
        <button
          onClick={() => setActiveTab("matches")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "matches"
              ? "bg-[#F5A623] text-black shadow-lg"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Fixtures &amp; Schedule
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "groups"
              ? "bg-[#F5A623] text-black shadow-lg"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Group Standings
        </button>
      </div>

      {activeTab === "matches" ? (
        <>
          {/* Today's Matches Highlight */}
          {todayMatches.length > 0 && (
            <div className="mb-4 p-3 rounded-xl border border-[#F5A623]/20 bg-[#F5A623]/5">
              <p className="text-[10px] font-bold tracking-widest text-[#F5A623] uppercase mb-2">🔴 Today&apos;s Matches</p>
              <div className="space-y-2">
                {todayMatches.map((m: any) => (
                  <div key={m.id} className="grid items-center grid-cols-[auto_1fr_auto_1fr_auto_auto] p-2.5 gold-pulse rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20">
                    <span className="flex items-center gap-1.5 mr-2">
                      {m.homeFlag && <img src={m.homeFlag} className="w-8 h-5 object-cover rounded block" alt="" />}
                    </span>
                    <span className="font-bold text-white text-sm leading-none whitespace-nowrap truncate">{m.home}</span>
                    <span className="text-xs text-[#F5A623] font-bold text-center px-3 leading-none">
                      {m.homeScore !== null && m.awayScore !== null ? `${m.homeScore} - ${m.awayScore}` : "VS"}
                    </span>
                    <span className="font-bold text-white text-sm leading-none whitespace-nowrap truncate text-right">{m.away}</span>
                    <span className="flex items-center gap-1.5 ml-2">
                      {m.awayFlag && <img src={m.awayFlag} className="w-8 h-5 object-cover rounded block" alt="" />}
                    </span>
                    <div className="flex items-center gap-1.5 ml-2 whitespace-nowrap">
                      <span className="text-[10px] text-zinc-400 leading-none">{m.time} UTC</span>
                      {m.live && (
                        <span className="px-1 py-0.5 rounded bg-rose-600 text-white text-[8px] font-extrabold animate-pulse">LIVE</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matches Table */}
          <div className="overflow-x-auto rounded-2xl md:rounded-3xl border border-white/10">
            {matches.length > 0 ? (
            <table className="wc-table w-full">
              <thead>
                <tr>
                  <th className="min-w-[59px]">Date</th>
                  <th className="min-w-[52px]">Time (UTC)</th>
                  <th className="min-w-[85px] text-right">Home</th>
                  <th className="min-w-[46px] text-center">Score</th>
                  <th className="min-w-[85px] text-left">Away</th>
                  <th className="min-w-[120px]">Venue</th>
                  <th className="min-w-[65px]">Stage</th>
                </tr>
              </thead>
              <tbody>
                {(todayMatches.length > 0 ? todayMatches : upcomingMatches).map((m: any) => {
                  const isToday = m.date === today;
                  return (
                    <tr key={m.id} className={isToday ? "today-match" : ""}>
                      <td className="whitespace-nowrap">{m.date}</td>
                      <td className="whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          {m.time}
                          {m.live && (
                            <span className="px-1 py-0.5 rounded bg-rose-600 text-white text-[8px] font-extrabold animate-pulse">LIVE</span>
                          )}
                          {m.finished && (
                            <span className="px-1 py-0.5 rounded bg-zinc-700 text-zinc-300 text-[8px] font-bold">FT</span>
                          )}
                        </span>
                      </td>
                      <td className="font-bold text-white text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 justify-end">
                          {m.home}
                          {m.homeFlag && <img src={m.homeFlag} className="w-8 h-5 object-cover rounded border border-white/10" alt="" />}
                        </span>
                      </td>
                      <td className="text-center px-2 whitespace-nowrap">
                        {m.homeScore !== null && m.awayScore !== null ? (
                          <span className="bg-white/10 px-2.5 py-0.5 rounded text-white font-mono text-xs">{m.homeScore} - {m.awayScore}</span>
                        ) : (
                          <span className="text-[#F5A623] font-bold text-[10px]">VS</span>
                        )}
                      </td>
                      <td className="font-bold text-white text-left whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          {m.awayFlag && <img src={m.awayFlag} className="w-8 h-5 object-cover rounded border border-white/10" alt="" />}
                          {m.away}
                        </span>
                      </td>
                      <td className="text-zinc-300 text-[11px] whitespace-nowrap">{m.venue}</td>
                      <td className="whitespace-nowrap">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          m.stage === "Final" ? "bg-[#F5A623]/20 text-[#F5A623]" :
                          m.stage.includes("Semi") ? "bg-purple-500/20 text-purple-400" :
                          "bg-zinc-500/20 text-zinc-400"
                        }`}>
                          {m.stage}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            ) : (
              <div className="text-center py-8 text-zinc-500 text-sm font-medium">
                No match data available yet.
              </div>
            )}
          </div>

          <p className="mt-3 text-[9px] text-zinc-500 text-center">
            * Schedules and standings update live after matches air on live streams.
          </p>
        </>
      ) : (
        <>
          {/* Group Standings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups.length > 0 ? groups.map((group: any) => {
              const hasStats = group.teams && group.teams[0] && typeof group.teams[0] === "object" && "pts" in group.teams[0];
              return (
                <div
                  key={group.id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex flex-col"
                >
                  <h4 className="text-xs font-bold text-[#F5A623] mb-2.5 tracking-wider uppercase">
                    {group.name}
                  </h4>
                  <div className="flex-1">
                    {hasStats ? (
                      <table className="w-full text-[11px] text-zinc-300">
                        <thead>
                          <tr className="text-[9px] text-zinc-500 font-bold border-b border-white/5 pb-1">
                            <th className="text-left w-5 pb-1">#</th>
                            <th className="text-left pb-1">Team</th>
                            <th className="text-center w-6 pb-1">P</th>
                            <th className="text-center w-6 pb-1">GD</th>
                            <th className="text-center w-6 pb-1 text-[#F5A623]">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.teams.map((team: any, idx: number) => (
                            <tr key={team.name} className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02]">
                              <td className="py-1 text-zinc-500 font-bold">{idx + 1}</td>
                              <td className="py-1 font-bold text-white flex items-center gap-1">
                                {team.flag && <img src={team.flag} className="w-7 h-4.5 object-cover rounded border border-white/10" alt="" />}
                                <span className="truncate max-w-[80px]">{team.name}</span>
                              </td>
                              <td className="py-1 text-center text-zinc-400">{team.mp}</td>
                              <td className="py-1 text-center text-zinc-400">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                              <td className="py-1 text-center font-bold text-[#F5A623]">{team.pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="space-y-1">
                        {group.teams.map((team: string, idx: number) => (
                          <div
                            key={team}
                            className="flex items-center gap-2 text-xs text-zinc-300"
                          >
                            <span className="w-4 text-[10px] text-zinc-500 font-bold">{idx + 1}.</span>
                            <span className="font-medium">{team}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full text-center py-8 text-zinc-500 text-sm font-medium">
                No standings data available yet.
              </div>
            )}
          </div>
          <p className="mt-3 text-[9px] text-zinc-500 text-center">
            Group stage with 48 teams across 12 groups. Top 2 from each group + 8 best 3rd-placed teams advance to Round of 32.
          </p>
        </>
      )}
    </div>
  );
}

# 📺 SadikTV — Watch Live TV Channels

A modern, high-performance, and premium web-based TV player built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Stream high-quality live TV channels directly from official broadcast sources with a cinematic user interface.

---

## ✨ Features

- 📺 **Cinematic Video Player**: Large, center-aligned, aspect-ratio locked media container utilizing HLS.js and native iOS Safari player engines. Supports Picture-in-Picture (PiP), custom volume controls, double-tap seek, and auto-fallback muted play.
- 🚀 **Multi-Playlist Concurrent Loading**: Automatically initiates requests for all default playlists (**Sports**, **Universal**, and **Bangla**) immediately when loading the home page. Displays channel counts instantly and sets the **Sports** playlist as selected by default.
- 💾 **SHA-256 Hash-Based IndexedDB Cache**: Caches each default playlist in the browser using IndexedDB. On page load, it queries a lightweight `/api/iptv/channels/hash?type=...` endpoint. If unchanged, channels load instantly from cache, saving bandwidth and eliminating player lag.
- 📂 **High-Speed BDIX FTP Portal**: An elegant `/ftp` directory showing local BDIX movie and media servers, complete with real-time online status indicators, host configurations, speed diagnostics, and instant redirection link components.
- 👥 **Real-Time Watcher Telemetry**: Integrated directly into the channel list header, using a non-blocking session heartbeat endpoint to monitor active viewers concurrently.
- 🌌 **3D CSS Net Background**: A highly optimized, static 3D perspective cyber grid with deep purple and cyan radial glows and a subtle viewport mesh overlay.
- 🔍 **Interactive Channel Grid**: Filter and search through thousands of Bangla and international live TV channels in real-time. Responsive grid display dynamically adjusts for mobile, tablet, and desktop viewports.
- ⚡ **Full Skeleton UI Loading States**: Fully unified, custom-designed pulsing skeleton templates for every card element (Player, Details, Developer Info, Total Channels, and Channel List grid) to prevent layout shifts.
- 🧭 **Glassmorphic Sticky Header**: A clean, luxurious sticky header with brand identification and active live broadcast status.

---

## ⚙️ M3U Playlist Converter

The repository includes a built-in Node.js converter script that automatically scans and parses all JSON files in the data directory and outputs standard M3U playlists.

### Usage

1. **Convert All Playlists** (Converts all `.json` files in `app/data/` to `.m3u`):
   ```bash
   npm run convert-m3u
   ```
   *Or run it directly:*
   ```bash
   node scripts/json-to-m3u.js
   ```

2. **Custom Paths**:
   If you have a custom JSON database or want to output to a specific location:
   ```bash
   node scripts/json-to-m3u.js <path-to-input.json> <path-to-output.m3u>
   ```

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Stream Engine**: [HLS.js](https://github.com/video-dev/hls.js/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (**v22.19.0** or newer) installed.
> [!IMPORTANT]
> The dependency `undici@8.4.1` requires Node.js version **v22.19.0** or higher. Lower versions will fail to build or compile.

### Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Running

To build and run the application in production mode:
```bash
npm run build
npm start
```

### Docker Deployment

You can deploy the application using the preconfigured multi-stage `Dockerfile` (optimized for Node.js 22):
```bash
docker build -t sadiktv-player .
docker run -p 3000:3000 sadiktv-player
```

---

## ⚠️ Disclaimer

This repository does not host, store, retransmit, or own any television channels or media content. The JSON file and web player only reference publicly available stream links collected from open-source IPTV playlists and public internet sources. Channel availability may change, expire, or stop working at any time.

---

## 📄 License

This project is open-source software licensed under the **GNU General Public License v3 (GPLv3)**.

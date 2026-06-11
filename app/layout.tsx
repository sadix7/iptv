import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://sadiktv.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "SadikTV — Watch Live TV Channels",
  description:
    "SadikTV — Stream live sports, World Cup 2026, entertainment, and 7,500+ global TV channels. Free. No login.",
  keywords: [
    "IPTV",
    "live TV",
    "streaming",
    "HLS player",
    "TV channels",
    "World Cup 2026",
    "sports live",
    "free TV",
    "online TV",
    "SadikTV",
    "live stream",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SadikTV",
    title: "SadikTV — Watch Live TV Channels",
    description:
      "SadikTV — Stream live sports, World Cup 2026, entertainment, and 7,500+ global TV channels. Free. No login.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SadikTV — Live TV streaming with 7,500+ channels",
        type: "image/png",
      },
    ],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  category: "entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

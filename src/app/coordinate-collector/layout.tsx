import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Coordinate Collector - Bannerlord Map Data Tool",
  description: "Interactive tool for collecting and managing Bannerlord map coordinates. Navigate through Calradia's settlements and collect precise location data for game development.",
  keywords: [
    "Bannerlord coordinates",
    "map data collection",
    "game development tool",
    "Calradia mapping",
    "settlement coordinates",
    "Bannerlord modding",
    "map tool"
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function CoordinateCollectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

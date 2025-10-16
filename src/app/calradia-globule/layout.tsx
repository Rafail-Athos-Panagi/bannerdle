import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bannerdle - Map Quest",
  description:
    "Explore Calradia's towns, castles and villages and test your geography knowledge! Find hidden locations using distance and direction hints in this interactive map exploration game.",
  keywords: [
    "Bannerlord map exploration",
    "Calradia geography",
    "settlement guessing",
    "map quest game",
    "Bannerlord locations",
    "medieval geography",
    "interactive map game",
    "settlement identification",
  ],
  openGraph: {
    title: "Map Quest - Daily Bannerlord's Map Areas Guessing Challenge",
    description:
      "Explore Calradia's towns, castles and villages and test your geography knowledge! Find hidden locations using distance and direction hints in this interactive map exploration game.",
    images: [
      {
        url: "/home_map_game.png",
        width: 1200,
        height: 630,
        alt: "Bannerlord Map Quest - Calradia Map Areas Exploration",
      },
    ],
  },
  twitter: {
    title: "Map Quest - Daily Bannerlord's Map Areas Guessing Challenge",
    description:
      "Explore Calradia's towns, castles and villages and test your geography knowledge! Find hidden locations using distance and direction hints in this interactive map exploration game.",
  },
};

export default function CalradiaGlobuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

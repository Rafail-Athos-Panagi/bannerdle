import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bannerdle - Troop Quest",
  description:
    "Test your knowledge of Bannerlord's troops! Guess the daily troop using strategic hints and clues. Challenge yourself with different factions and troop types.",
  keywords: [
    "Bannerlord troop guessing",
    "daily troop challenge",
    "Bannerlord troops",
    "medieval warfare units",
    "strategy game quiz",
    "troop identification",
    "Bannerlord factions",
    "daily gaming challenge",
  ],
  openGraph: {
    title: "Troop Quest - Daily Bannerlord's Troop Guessing Challenge",
    description:
      "Test your knowledge of Bannerlord's troops! Guess the daily troop using strategic hints and clues. Challenge yourself with different factions and troop types.",
    images: [
      {
        url: "/home_troop_game.png",
        width: 1200,
        height: 630,
        alt: "Bannerlord Troop Quest - Daily Troop Guessing Challenge",
      },
    ],
  },
  twitter: {
    title: "Troop Quest - Daily Bannerlord's Troop Guessing Challenge",
    description:
      "Test your knowledge of Bannerlord's troops! Guess the daily troop using strategic hints and clues. Challenge yourself with different factions and troop types.",
  },
};

export default function TroopQuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

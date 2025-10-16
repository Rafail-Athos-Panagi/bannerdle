import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bannerdle - Contact",
  description:
    "Contact the Bannerdle developer for feedback, suggestions, or support. Send your message to the realm of Calradia and help us improve the game!",
  keywords: [
    "Bannerdle Quests contact",
    "game feedback",
    "support",
    "suggestions",
    "contact form",
    "game development",
    "community feedback",
  ],
  openGraph: {
    title: "Contact Us - Get in Touch with Bannerdle's Developer",
    description:
      "Contact the Bannerdle developer for feedback, suggestions, or support. Send your message to the realm of Calradia and help us improve the game!",
    images: [
      {
        url: "/bg-1.jpg",
        width: 1200,
        height: 630,
        alt: "Bannerdle's Developer Contact - Get in Touch",
      },
    ],
  },
  twitter: {
    title: "Contact Us - Get in Touch with Bannerdle's Developer",
    description:
      "Contact the Bannerdle developer for feedback, suggestions, or support. Send your message to the realm of Calradia and help us improve the game!",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

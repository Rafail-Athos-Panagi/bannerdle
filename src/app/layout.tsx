import type { Metadata, Viewport } from "next";
import "./globals.css";
import LocalStorageInitializer from "@/components/LocalStorageInitializer";

export const metadata: Metadata = {
  title: {
    default: "Bannerdle - Medieval Strategy Game Challenges",
    template: "%s"
  },
  description: "Test your knowledge of Mount & Blade II: Bannerlord with daily troop guessing and map exploration challenges. Master Calradia's armies and geography in this engaging medieval strategy game.",
  keywords: [
    "Bannerlord",
    "Mount & Blade",
    "medieval strategy game",
    "troop guessing game",
    "map exploration",
    "Calradia",
    "daily challenge",
    "strategy game",
    "medieval warfare",
    "gaming quiz"
  ],
  authors: [{ name: "Raphael Athos Panayi" }],
  creator: "Bannerdle",
  publisher: "Bannerdle",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.bannerdle.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.bannerdle.com',
    siteName: 'Bannerdle',
    title: 'Bannerdle - Medieval Strategy Game Challenges',
    description: 'Test your knowledge of Mount & Blade II: Bannerlord with daily troop guessing and map exploration challenges. Master Calradia\'s armies and geography.',
    images: [
      {
        url: '/logo_new.png',
        width: 1200,
        height: 630,
        alt: 'Bannerdle - Medieval Strategy Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bannerdle - Medieval Strategy Game Challenges',
    description: 'Test your knowledge of Mount & Blade II: Bannerlord with daily troop guessing and map exploration challenges.',
    images: ['/logo_new.png'],
    creator: '@bannerdle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'gaming',
  applicationName: 'Bannerdle',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Bannerdle",
    "description": "Test your knowledge of Mount & Blade II: Bannerlord with daily troop guessing and map exploration challenges. Master Calradia's armies and geography in this engaging medieval strategy game.",
    "url": "https://www.bannerdle.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.bannerdle.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bannerdle",
      "url": "https://www.bannerdle.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bannerdle.com/logo_new.png"
      }
    },
    "mainEntity": {
      "@type": "Game",
      "name": "Bannerdle",
      "description": "A web-based guessing game based on Mount & Blade II: Bannerlord",
      "genre": "Strategy Game",
      "gamePlatform": "Web Browser",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/logo_new.png?v=1" type="image/png" />
        <link rel="icon" href="/logo_new.png?v=1" sizes="32x32" type="image/png" />
        <link rel="icon" href="/logo_new.png?v=1" sizes="16x16" type="image/png" />
        <link rel="shortcut icon" href="/logo_new.png?v=1" type="image/png" />
        <link rel="apple-touch-icon" href="/logo_new.png?v=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo_new.png?v=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d4af37" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bannerdle" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <LocalStorageInitializer />
        {children}
      </body>
    </html>
  );
}
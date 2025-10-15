'use client';

import React from 'react';
import Link from 'next/link';
import MedievalNavbar from '@/components/MedievalNavbar';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MapQuestErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div 
      className="h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{ 
        backgroundImage: 'url(/bg-1.jpg)',
        backgroundAttachment: 'fixed'
      }}
    >
      <MedievalNavbar />
      <div className="flex-1 flex items-center justify-center text-[var(--bannerlord-custom-light-cream)]">
        <div className="text-center max-w-2xl mx-auto px-4">
          {/* Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center border-4 border-red-800">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-12 h-12"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                <circle cx="12" cy="9" r="2"/>
              </svg>
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-red-400 mb-4 font-serif" style={{ 
            textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)'
          }}>
            Map Quest Failed!
          </h1>

          {/* Error Message */}
          <div className="bg-[var(--bannerlord-custom-very-dark-brown)] bg-opacity-90 rounded-lg p-6 mb-8 border-2 border-red-600" style={{
            backdropFilter: 'blur(2px)'
          }}>
            <h2 className="text-xl font-semibold text-red-300 mb-4">
              The Cartographer&apos;s Workshop Has Collapsed
            </h2>
            <p className="text-[var(--bannerlord-custom-light-cream)] mb-4">
              Our map exploration system has encountered an unexpected error. The ancient maps of Calradia have been damaged.
            </p>
            <div className="bg-red-900 bg-opacity-50 rounded p-3 border border-red-700">
              <p className="text-sm text-red-200 font-mono">
                {error.message || 'An unknown error has occurred'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-8 py-3 bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] font-bold rounded-lg hover:bg-[var(--bannerlord-patch-gold-text)] transition-all duration-300 hover:scale-105 shadow-lg border-2 border-[var(--bannerlord-custom-med-brown)]"
            >
              🔄 Retry Map Quest
            </button>
            <Link
              href="/"
              className="px-8 py-3 bg-[var(--bannerlord-custom-dark-brown)] text-[var(--bannerlord-custom-light-cream)] font-bold rounded-lg hover:bg-[var(--bannerlord-custom-med-brown)] transition-all duration-300 hover:scale-105 shadow-lg border-2 border-[var(--bannerlord-custom-med-brown)]"
            >
              🏰 Return to Castle
            </Link>
          </div>

          {/* Footer Message */}
          <div className="mt-8 text-sm text-[var(--bannerlord-custom-light-cream)] opacity-70">
            <p>Even the greatest explorers face obstacles. Chart a new course, brave adventurer!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

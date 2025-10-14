import React from 'react';
import Link from 'next/link';
import MedievalNavbar from '@/components/MedievalNavbar';

export default function NotFoundPage() {
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
          {/* Lost Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-[var(--bannerlord-custom-med-brown)] rounded-full flex items-center justify-center border-4 border-[var(--bannerlord-custom-dark-brown)]">
              <svg
                viewBox="0 0 24 24"
                fill="var(--bannerlord-custom-light-cream)"
                className="w-12 h-12"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                <circle cx="12" cy="9" r="2"/>
              </svg>
            </div>
          </div>

          {/* 404 Title */}
          <h1 className="text-6xl md:text-8xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-4 font-serif" style={{ 
            textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)'
          }}>
            404
          </h1>

          {/* Lost Message */}
          <div className="bg-[var(--bannerlord-custom-very-dark-brown)] bg-opacity-90 rounded-lg p-6 mb-8 border-2 border-[var(--bannerlord-custom-med-brown)]" style={{
            backdropFilter: 'blur(2px)'
          }}>
            <h2 className="text-2xl font-semibold text-[var(--bannerlord-patch-brassy-gold)] mb-4">
              Lost in the Wilderness
            </h2>
            <p className="text-[var(--bannerlord-custom-light-cream)] mb-4">
              You have wandered into uncharted territory, brave adventurer. This realm does not exist in the known lands of Calradia.
            </p>
            <p className="text-[var(--bannerlord-custom-light-cream)] opacity-80">
              Perhaps you took a wrong turn at the crossroads, or the ancient maps have led you astray.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/"
              className="px-8 py-3 bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] font-bold rounded-lg hover:bg-[var(--bannerlord-patch-gold-text)] transition-all duration-300 hover:scale-105 shadow-lg border-2 border-[var(--bannerlord-custom-med-brown)]"
            >
              🏰 Return to Castle
            </Link>
            <Link
              href="/troop-quest"
              className="px-8 py-3 bg-[var(--bannerlord-custom-dark-brown)] text-[var(--bannerlord-custom-light-cream)] font-bold rounded-lg hover:bg-[var(--bannerlord-custom-med-brown)] transition-all duration-300 hover:scale-105 shadow-lg border-2 border-[var(--bannerlord-custom-med-brown)]"
            >
              ⚔️ Troop Quest
            </Link>
            <Link
              href="/calradia-globule"
              className="px-8 py-3 bg-[var(--bannerlord-custom-dark-brown)] text-[var(--bannerlord-custom-light-cream)] font-bold rounded-lg hover:bg-[var(--bannerlord-custom-med-brown)] transition-all duration-300 hover:scale-105 shadow-lg border-2 border-[var(--bannerlord-custom-med-brown)]"
            >
              🗺️ Map Quest
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center space-x-4 mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[var(--bannerlord-patch-brassy-gold)] to-transparent opacity-50"></div>
            <div className="text-[var(--bannerlord-patch-brassy-gold)] text-sm">⚔️</div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[var(--bannerlord-patch-brassy-gold)] to-transparent opacity-50"></div>
          </div>

          {/* Footer Message */}
          <div className="text-sm text-[var(--bannerlord-custom-light-cream)] opacity-70">
            <p>Every great explorer has been lost before finding their way. Your adventure continues!</p>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[var(--bannerlord-patch-brassy-gold)] rotate-45"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-[var(--bannerlord-patch-brassy-gold)] rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-[var(--bannerlord-patch-brassy-gold)] -rotate-12"></div>
      </div>
    </div>
  );
}

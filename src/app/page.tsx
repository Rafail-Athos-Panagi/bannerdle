import Link from 'next/link';

export default function HomePage() {
  return (
    <div 
      className="h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{ 
        backgroundImage: 'url(/bg-1.jpg)',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="h-full flex flex-col items-center justify-center text-[var(--bannerlord-custom-light-cream)]">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-4 font-serif">
            Bannerlord Quest
          </h1>
          <p className="text-xl md:text-2xl text-[var(--bannerlord-custom-light-cream)] opacity-80">
            Choose Your Adventure in Calradia
          </p>
        </div>

        {/* Game Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-7xl w-full px-4">
          {/* Troop Quest Card */}
          <Link
            href="/troop-quest"
            className="group troop-quest-bg border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg p-16 hover:border-[var(--bannerlord-patch-brassy-gold)] transition-all duration-300 hover:scale-105 shadow-lg relative overflow-hidden min-h-[350px]"
          >
            <div className="text-center relative z-10">
              {/* Sword Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="var(--bannerlord-custom-very-dark-brown)"
                    className="w-12 h-12"
                  >
                    <path d="M6.92 5H5l1.5-1.5L6.92 5M12 4V2H6l.5 2H12M22 2l-5 10-3-3-3 3L2 2h20M9 12l3 3 3-3-3-3-3 3M6 16l3 3 3-3-3-3-3 3M18 16l3 3-3 3-3-3 3-3M2 22h20v-2H2v2z"/>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-4 px-3 py-2 rounded-md" style={{ 
                textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)',
                backgroundColor: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(2px)'
              }}>
                Troop Quest
              </h2>
              <p className="text-[var(--bannerlord-custom-light-cream)] mb-4 px-3 py-2 rounded-md" style={{ 
                textShadow: '3px 3px 6px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.7), 1px 1px 2px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(1px)'
              }}>
                Test your knowledge of Bannerlord troops! Guess the daily troop using strategic hints and clues.
              </p>
              <div className="text-sm text-[var(--bannerlord-custom-light-cream)] px-3 py-2 rounded-md" style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                backdropFilter: 'blur(1px)'
              }}>
                Daily Challenge • Strategic Guessing • Troop Knowledge
              </div>
            </div>
          </Link>

          {/* Map Quest Card */}
          <Link
            href="/calradia-globule"
            className="group map-quest-bg border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg p-16 hover:border-[var(--bannerlord-patch-brassy-gold)] transition-all duration-300 hover:scale-105 shadow-lg relative overflow-hidden min-h-[350px]"
          >
            <div className="text-center relative z-10">
              {/* Map Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="var(--bannerlord-custom-very-dark-brown)"
                    className="w-12 h-12"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    <circle cx="12" cy="9" r="2"/>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-4 px-3 py-2 rounded-md" style={{ 
                textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)',
                backgroundColor: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(2px)'
              }}>
                Map Quest
              </h2>
              <p className="text-[var(--bannerlord-custom-light-cream)] mb-4 px-3 py-2 rounded-md" style={{ 
                textShadow: '3px 3px 6px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.7), 1px 1px 2px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(1px)'
              }}>
                Explore Calradia's settlements! Find the hidden location using distance and direction hints.
              </p>
              <div className="text-sm text-[var(--bannerlord-custom-light-cream)] px-3 py-2 rounded-md" style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                backdropFilter: 'blur(1px)'
              }}>
                Geography Challenge • Exploration • Settlement Knowledge
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-[var(--bannerlord-custom-light-cream)] opacity-60">
            Choose your path, warrior. Calradia awaits your conquest!
          </p>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';
import PageRefreshLoader from '@/components/PageRefreshLoader';

export default function HomePage() {
  return (
    <PageRefreshLoader loadingMessage="Preparing your adventure...">
      <div 
        className="h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
        style={{ 
          backgroundImage: 'url(/bg-1.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="h-full flex flex-col items-center justify-center text-[var(--bannerlord-custom-light-cream)] px-2 sm:px-4">
          {/* Main Title */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-1 sm:mb-2 font-serif">
              Bannerlord Quest
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--bannerlord-custom-light-cream)] opacity-80 px-2">
              Choose Your Adventure in Calradia
            </p>
          </div>

          {/* Game Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 max-w-4xl w-full">
            {/* Troop Quest Card */}
            <Link
              href="/troop-quest"
              className="group troop-quest-bg border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg p-2 sm:p-3 md:p-4 lg:p-6 hover:border-[var(--bannerlord-patch-brassy-gold)] transition-all duration-300 hover:scale-105 shadow-lg relative overflow-hidden min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px]"
            >
              <div className="text-center relative z-10">
                {/* Sword Icon */}
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="var(--bannerlord-custom-very-dark-brown)"
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10"
                    >
                      <path d="M6.92 5H5l1.5-1.5L6.92 5M12 4V2H6l.5 2H12M22 2l-5 10-3-3-3 3L2 2h20M9 12l3 3 3-3-3-3-3 3M6 16l3 3 3-3-3-3-3 3M18 16l3 3-3 3-3-3 3-3M2 22h20v-2H2v2z"/>
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-1 px-2 py-1 rounded-md" style={{ 
                  textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(2px)'
                }}>
                  Troop Quest
                </h2>
                <p className="text-sm sm:text-base text-[var(--bannerlord-custom-light-cream)] mb-1 px-2 py-1 rounded-md" style={{ 
                  textShadow: '3px 3px 6px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.7), 1px 1px 2px rgba(0,0,0,0.5)',
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(1px)'
                }}>
                  Test your knowledge of Bannerlord troops! Guess the daily troop using strategic hints and clues.
                </p>
                <div className="text-sm text-[var(--bannerlord-custom-light-cream)] px-2 py-1 rounded-md" style={{ 
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
              className="group map-quest-bg border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg p-2 sm:p-3 md:p-4 lg:p-6 hover:border-[var(--bannerlord-patch-brassy-gold)] transition-all duration-300 hover:scale-105 shadow-lg relative overflow-hidden min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px]"
            >
              <div className="text-center relative z-10">
                {/* Map Icon */}
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="var(--bannerlord-custom-very-dark-brown)"
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      <circle cx="12" cy="9" r="2"/>
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-1 px-2 py-1 rounded-md" style={{ 
                  textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(2px)'
                }}>
                  Map Quest
                </h2>
                <p className="text-sm sm:text-base text-[var(--bannerlord-custom-light-cream)] mb-1 px-2 py-1 rounded-md" style={{ 
                  textShadow: '3px 3px 6px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.7), 1px 1px 2px rgba(0,0,0,0.5)',
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(1px)'
                }}>
                  Explore Calradia&apos;s settlements! Find the hidden location using distance and direction hints.
                </p>
                <div className="text-sm text-[var(--bannerlord-custom-light-cream)] px-2 py-1 rounded-md" style={{ 
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
          <div className="mt-4 sm:mt-6 lg:mt-8 text-center">
            <p className="text-sm sm:text-base text-[var(--bannerlord-custom-light-cream)] opacity-60 px-2">
              Choose your path, warrior. Calradia awaits your conquest!
            </p>
          </div>
        </div>
      </div>
    </PageRefreshLoader>
  );
}
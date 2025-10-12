import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MedievalNavbar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full bg-[var(--bannerlord-custom-very-dark-brown)] border-b-2 border-[var(--bannerlord-custom-med-brown)] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="var(--bannerlord-custom-very-dark-brown)"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="text-[var(--bannerlord-patch-brassy-gold)] font-bold text-sm sm:text-lg font-serif hidden sm:block">
                  Bannerlord Quest
                </span>
                <span className="text-[var(--bannerlord-patch-brassy-gold)] font-bold text-sm font-serif sm:hidden">
                  BQ
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Troop Guessing Tab */}
              <Link
                href="/troop-quest"
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  pathname === '/troop-quest'
                    ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                    : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                }`}
              >
                {/* Medieval Sword Icon */}
                <div className="flex items-center justify-center w-5 h-5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M6.92 5H5l1.5-1.5L6.92 5M12 4V2H6l.5 2H12M22 2l-5 10-3-3-3 3L2 2h20M9 12l3 3 3-3-3-3-3 3M6 16l3 3 3-3-3-3-3 3M18 16l3 3-3 3-3-3 3-3M2 22h20v-2H2v2z"/>
                  </svg>
                </div>
                <span className="font-semibold text-sm">Troop Quest</span>
              </Link>

              {/* Divider */}
              <div className="w-px h-6 bg-[var(--bannerlord-custom-med-brown)] mx-2"></div>

              {/* Map Guessing Tab */}
              <Link
                href="/calradia-globule"
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  pathname === '/calradia-globule'
                    ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                    : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                }`}
              >
                {/* Medieval Map/Compass Icon */}
                <div className="flex items-center justify-center w-5 h-5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    <circle cx="12" cy="9" r="2"/>
                  </svg>
                </div>
                <span className="font-semibold text-sm">Map Quest</span>
              </Link>
            </div>

            {/* Right side - Additional Info */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-[var(--bannerlord-custom-light-cream)] text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>
              <div className="hidden sm:block text-[var(--bannerlord-custom-light-cream)] text-xs opacity-70">
                Calradia
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)] transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-[var(--bannerlord-custom-med-brown)] bg-[var(--bannerlord-custom-very-dark-brown)]">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Troop Quest Link */}
                <Link
                  href="/troop-quest"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-all duration-200 ${
                    pathname === '/troop-quest'
                      ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                      : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                  }`}
                >
                  {/* Medieval Sword Icon */}
                  <div className="flex items-center justify-center w-5 h-5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M6.92 5H5l1.5-1.5L6.92 5M12 4V2H6l.5 2H12M22 2l-5 10-3-3-3 3L2 2h20M9 12l3 3 3-3-3-3-3 3M6 16l3 3 3-3-3-3-3 3M18 16l3 3-3 3-3-3 3-3M2 22h20v-2H2v2z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-sm">Troop Quest</span>
                </Link>

                {/* Mobile Map Quest Link */}
                <Link
                  href="/calradia-globule"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-all duration-200 ${
                    pathname === '/calradia-globule'
                      ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                      : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                  }`}
                >
                  {/* Medieval Map/Compass Icon */}
                  <div className="flex items-center justify-center w-5 h-5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      <circle cx="12" cy="9" r="2"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-sm">Map Quest</span>
                </Link>

                {/* Mobile Status Info */}
                <div className="px-3 py-2 border-t border-[var(--bannerlord-custom-med-brown)] mt-2">
                  <div className="flex items-center space-x-2 text-[var(--bannerlord-custom-light-cream)] text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                    <span className="opacity-70">•</span>
                    <span className="opacity-70">Calradia</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MedievalNavbar;
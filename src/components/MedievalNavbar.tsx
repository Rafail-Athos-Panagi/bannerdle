'use client';

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
      <div className="w-full bg-[var(--bannerlord-custom-very-dark-brown)] border-b border-[var(--bannerlord-custom-med-brown)] shadow-lg">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12 lg:h-14">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex items-center justify-center">
                  <img 
                    src="/navbar_logo.png" 
                    alt="Bannerdle Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-0.5">
              {/* Troop Guessing Tab */}
              <Link
                href="/troop-quest"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all duration-200 ${
                  pathname === '/troop-quest'
                    ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                    : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                }`}
              >
                {/* Medieval Sword Icon */}
                <div className="flex items-center justify-center w-4 h-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path d="M6.92 5H5l1.5-1.5L6.92 5M12 4V2H6l.5 2H12M22 2l-5 10-3-3-3 3L2 2h20M9 12l3 3 3-3-3-3-3 3M6 16l3 3 3-3-3-3-3 3M18 16l3 3-3 3-3-3 3-3M2 22h20v-2H2v2z"/>
                  </svg>
                </div>
                <span className="font-semibold text-xs">Troop Quest</span>
              </Link>

              {/* Divider */}
              <div className="w-px h-4 bg-[var(--bannerlord-custom-med-brown)] mx-1"></div>

              {/* Coordinate Collector Tab */}
              <Link
                href="/coordinate-collector"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all duration-200 ${
                  pathname === '/coordinate-collector'
                    ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                    : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                }`}
              >
                {/* Coordinate/Pin Icon */}
                <div className="flex items-center justify-center w-4 h-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    <circle cx="12" cy="9" r="2"/>
                  </svg>
                </div>
                <span className="font-semibold text-xs">Collector</span>
              </Link>

              {/* Divider */}
              <div className="w-px h-4 bg-[var(--bannerlord-custom-med-brown)] mx-1"></div>

              {/* Map Guessing Tab */}
              <Link
                href="/calradia-globule"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all duration-200 ${
                  pathname === '/calradia-globule'
                    ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                    : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                }`}
              >
                {/* Medieval Map/Compass Icon */}
                <div className="flex items-center justify-center w-4 h-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    <circle cx="12" cy="9" r="2"/>
                  </svg>
                </div>
                <span className="font-semibold text-xs">Map Quest</span>
              </Link>
            </div>

            {/* Right side - Contact Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Contact Button */}
              <Link
                href="/contact"
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all duration-200 text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]"
              >
                {/* Contact Icon */}
                <div className="flex items-center justify-center w-4 h-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <span className="font-semibold text-xs hidden sm:block">Contact</span>
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-1.5 rounded-md text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)] transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-5 h-5"
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
              <div className="px-2 pt-1.5 pb-2 space-y-0.5">
                {/* Mobile Troop Quest Link */}
                <Link
                  href="/troop-quest"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    pathname === '/troop-quest'
                      ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                      : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                  }`}
                >
                  {/* Medieval Sword Icon */}
                  <div className="flex items-center justify-center w-4 h-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M6.92 5H5l1.5-1.5L6.92 5M12 4V2H6l.5 2H12M22 2l-5 10-3-3-3 3L2 2h20M9 12l3 3 3-3-3-3-3 3M6 16l3 3 3-3-3-3-3 3M18 16l3 3-3 3-3-3 3-3M2 22h20v-2H2v2z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-xs">Troop Quest</span>
                </Link>

                {/* Mobile Coordinate Collector Link */}
                <Link
                  href="/coordinate-collector"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    pathname === '/coordinate-collector'
                      ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                      : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                  }`}
                >
                  {/* Coordinate/Pin Icon */}
                  <div className="flex items-center justify-center w-4 h-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      <circle cx="12" cy="9" r="2"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-xs">Collector</span>
                </Link>

                {/* Mobile Map Quest Link */}
                <Link
                  href="/calradia-globule"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    pathname === '/calradia-globule'
                      ? 'bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] shadow-md'
                      : 'text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]'
                  }`}
                >
                  {/* Medieval Map/Compass Icon */}
                  <div className="flex items-center justify-center w-4 h-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      <circle cx="12" cy="9" r="2"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-xs">Map Quest</span>
                </Link>

                {/* Mobile Contact Link */}
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 text-[var(--bannerlord-custom-light-cream)] hover:bg-[var(--bannerlord-custom-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)]"
                >
                  {/* Contact Icon */}
                  <div className="flex items-center justify-center w-4 h-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-xs">Contact</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MedievalNavbar;
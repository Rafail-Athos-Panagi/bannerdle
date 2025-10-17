'use client';

import React from 'react';
import MedievalNavbar from '@/components/MedievalNavbar';
import PageRefreshLoader from '@/components/PageRefreshLoader';
import Link from 'next/link';
import { FaShieldAlt, FaCookie, FaAd, FaUserShield } from 'react-icons/fa';

export default function PrivacyPolicyPage() {
  return (
    <PageRefreshLoader loadingMessage="Loading Privacy Policy...">
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
        style={{ 
          backgroundImage: 'url(/bg-1.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        <MedievalNavbar />
        
        <div className="flex-1 flex items-center justify-center p-4 pt-20">
          <div className="max-w-4xl w-full">
            <div className="bg-[#2D1B0E] border-2 border-[#AF9767] rounded-lg shadow-xl overflow-hidden">
              {/* Header */}
              <div className="border-b-2 border-[#AF9767] py-6 px-8 text-center bg-gradient-to-r from-[#AF9767] to-[#8B6F47]">
                <div className="flex items-center justify-center mb-3">
                  <FaShieldAlt className="text-black mr-3" size={32} />
                  <h1 className="text-3xl font-bold text-black font-serif">Privacy Policy</h1>
                </div>
                <p className="text-black text-lg font-semibold">
                  Bannerdle - Mount & Blade II: Bannerlord Fan Game
                </p>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Introduction */}
                <section>
                  <h2 className="text-2xl font-bold text-[#AF9767] mb-4 flex items-center">
                    <FaUserShield className="mr-3" />
                    Introduction
                  </h2>
                  <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-6">
                    <p className="text-[#D4C4A8] text-base leading-relaxed">
                      Welcome to Bannerdle! This Privacy Policy explains how we collect, use, and protect your information 
                      when you play our Mount & Blade II: Bannerlord troop guessing game. We are committed to protecting 
                      your privacy and ensuring a safe gaming experience.
                    </p>
                  </div>
                </section>

                {/* Data Collection */}
                <section>
                  <h2 className="text-2xl font-bold text-[#AF9767] mb-4 flex items-center">
                    <FaCookie className="mr-3" />
                    Data Collection & Storage
                  </h2>
                  <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#AF9767] mb-2">Local Storage</h3>
                        <p className="text-[#D4C4A8] text-base">
                          Bannerdle uses your browser&apos;s local storage to save your game progress, including:
                        </p>
                        <ul className="text-[#D4C4A8] text-base mt-2 ml-6 list-disc space-y-1">
                          <li>Your daily troop guesses and results</li>
                          <li>Game statistics and streak counters</li>
                          <li>Settings preferences (like indicator visibility)</li>
                          <li>Map exploration progress in Calradia Globule</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-[#AF9767] mb-2">No Personal Data Collection</h3>
                        <p className="text-[#D4C4A8] text-base">
                          We do not collect, store, or transmit any personal information such as names, email addresses, 
                          or other identifying data. All game data remains on your device.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cookies */}
                <section>
                  <h2 className="text-2xl font-bold text-[#AF9767] mb-4 flex items-center">
                    <FaCookie className="mr-3" />
                    Cookies & Tracking
                  </h2>
                  <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#AF9767] mb-2">Essential Cookies</h3>
                        <p className="text-[#D4C4A8] text-base">
                          Bannerdle may use essential cookies to maintain your game session and remember your preferences. 
                          These cookies are necessary for the game to function properly.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-[#AF9767] mb-2">Analytics Cookies</h3>
                        <p className="text-[#D4C4A8] text-base">
                          We may use analytics cookies to understand how players interact with the game, such as:
                        </p>
                        <ul className="text-[#D4C4A8] text-base mt-2 ml-6 list-disc space-y-1">
                          <li>Game completion rates</li>
                          <li>Most popular troop guesses</li>
                          <li>Average number of attempts per day</li>
                          <li>Browser and device information (anonymized)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Advertising */}
                <section>
                  <h2 className="text-2xl font-bold text-[#AF9767] mb-4 flex items-center">
                    <FaAd className="mr-3" />
                    Advertising & Third-Party Services
                  </h2>
                  <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#AF9767] mb-2">Donation Links</h3>
                        <p className="text-[#D4C4A8] text-base">
                          Bannerdle includes links to Ko-Fi for voluntary donations. These external services have their 
                          own privacy policies and terms of service.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-[#AF9767] mb-2">External Links</h3>
                        <p className="text-[#D4C4A8] text-base">
                          Our About page includes links to inspiring games (Wordle, Loldle, Globle) and Mount & Blade 
                          community resources. These external sites are not controlled by us.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Data Security */}
                <section>
                  <h2 className="text-2xl font-bold text-[#AF9767] mb-4 flex items-center">
                    <FaShieldAlt className="mr-3" />
                    Data Security
                  </h2>
                  <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-6">
                    <p className="text-[#D4C4A8] text-base leading-relaxed">
                      Since Bannerdle stores all data locally on your device, your game progress is protected by your 
                      browser&apos;s security measures. We do not have access to your personal game data, and it cannot be 
                      accessed by third parties through our servers.
                    </p>
                  </div>
                </section>

                {/* Your Rights */}
                <section>
                  <h2 className="text-2xl font-bold text-[#AF9767] mb-4 flex items-center">
                    <FaUserShield className="mr-3" />
                    Your Rights
                  </h2>
                  <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#AF9767] mb-2">Data Control</h3>
                        <p className="text-[#D4C4A8] text-base">
                          You have complete control over your game data. You can clear your browser&apos;s local storage 
                          at any time to reset your game progress.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-[#AF9767] mb-2">Contact Us</h3>
                        <p className="text-[#D4C4A8] text-base">
                          If you have any questions about this Privacy Policy or your data, please contact us at{' '}
                          <a 
                            href="mailto:bannerdle.game@gmail.com" 
                            className="text-[#AF9767] hover:text-yellow-400 underline"
                          >
                            bannerdle.game@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Updates */}
                <section>
                  <h2 className="text-2xl font-bold text-[#AF9767] mb-4 flex items-center">
                    <FaShieldAlt className="mr-3" />
                    Policy Updates
                  </h2>
                  <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-6">
                    <p className="text-[#D4C4A8] text-base leading-relaxed">
                      We may update this Privacy Policy from time to time. Any changes will be posted on this page 
                      with an updated revision date. We encourage you to review this policy periodically.
                    </p>
                    <p className="text-[#8B6F47] text-sm mt-4 font-semibold">
                      Last updated: {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-[#AF9767] py-6 px-8 text-center bg-gradient-to-r from-[#AF9767] to-[#8B6F47]">
                <div className="space-y-4">
                  <p className="text-black font-semibold text-lg">
                    Thanks for playing Bannerdle! ⚔️
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/troop-quest"
                      className="bg-black hover:bg-gray-800 text-[#AF9767] font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      Play Troop Quest
                    </Link>
                    <Link 
                      href="/calradia-globule"
                      className="bg-black hover:bg-gray-800 text-[#AF9767] font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      Play Map Quest
                    </Link>
                    <Link 
                      href="/"
                      className="bg-black hover:bg-gray-800 text-[#AF9767] font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageRefreshLoader>
  );
}

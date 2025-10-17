'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MapComponent from '@/components/MapComponent';
import MedievalNavbar from '@/components/MedievalNavbar';
import PageRefreshLoader from '@/components/PageRefreshLoader';
import LoadingSpinner from '@/components/LoadingSpinner';
import AboutModal from '@/components/AboutModal';
import MapQuestHowToPlayModal from '@/components/MapQuestHowToPlayModal';
import MapVictoryBanner from '@/components/MapVictoryBanner';
import { FaInfoCircle, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { IoIosHelpCircle } from "react-icons/io";
import { MapArea } from '@/types/MapArea.type';
import { MapAreaService, MapGameState } from '@/services/MapAreaService';
import { MapAreaGameService } from '@/services/MapAreaGameService';
import { CONFIG } from '@/config';

export default function CalradiaGlobuleGame() {
  const [mapGameState, setMapGameState] = useState<MapGameState | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [showSettlementTypeHint, setShowSettlementTypeHint] = useState(false);
  
  // Area search state
  const [areaInputValue, setAreaInputValue] = useState('');
  const [areaSuggestions, setAreaSuggestions] = useState<MapArea[]>([]);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
  const [selectedArea, setSelectedArea] = useState<MapArea | null>(null);
  const areaInputRef = useRef<HTMLDivElement | null>(null);

  // Ensure we're on the client side before initializing
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        areaInputRef.current &&
        !areaInputRef.current.contains(event.target as Node)
      ) {
        setShowAreaSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const mapInitialState = MapAreaService.getGameState();
    setMapGameState(mapInitialState);
  }, [isClient]);

  // Fetch lastSelection from API and store it to localStorage
  useEffect(() => {
    if (!isClient || !mapGameState || mapGameState.lastSelection) return;
    
    const fetchLastSelection = async () => {
      try {
        const data = await MapAreaGameService.getLastSelection();
        MapAreaService.updateLastSelection(data);
        setMapGameState(prevState => prevState ? { ...prevState, lastSelection: data } : null);
      } catch (error) {
        console.error("Error fetching lastSelection:", error);
      }
    };
    fetchLastSelection();
  }, [isClient, mapGameState]);

  // Area search handlers
  const handleAreaInputChange = async (value: string) => {
    setAreaInputValue(value);
    
    if (value.length > 0) {
      try {
        // Get list of already guessed area names
        const guessedAreaNames = mapGameState?.guesses.map(guess => guess.mapArea.name) || [];
        
        // Fetch map areas from API
        const response = await fetch('/api/map-areas');
        if (response.ok) {
          const allAreas = await response.json();
          const filteredAreas = allAreas.filter(
            (area: MapArea) => 
              area.name.toLowerCase().startsWith(value.toLowerCase()) &&
              !guessedAreaNames.includes(area.name)
          ) as MapArea[];
          setAreaSuggestions(filteredAreas);
          setShowAreaSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching map areas:', error);
        setAreaSuggestions([]);
      }
    } else {
      setAreaSuggestions([]);
      setShowAreaSuggestions(false);
      setSelectedArea(null);
    }
  };

  const handleAreaSelect = async (area: MapArea) => {
    if (!mapGameState) {
      return;
    }

    const result = await MapAreaService.makeGuess(area);
    
    if (result.success && result.gameState) {
      setMapGameState(result.gameState);
      setAreaInputValue('');
      setAreaSuggestions([]);
      setShowAreaSuggestions(false);
      setSelectedArea(null);
    }
  };

  const handleAreaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (areaSuggestions.length === 1) {
      handleAreaSelect(areaSuggestions[0]);
    }
  };


  if (!isClient || !mapGameState) {
    return <LoadingSpinner message="Loading Map Quest..." size="large" />;
  }

  return (
    <PageRefreshLoader loadingMessage="Refreshing Map Quest...">
      <div 
        className="h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
        style={{ 
          backgroundImage: 'url(/bg-1.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        <MedievalNavbar />
        <div className="h-full text-[var(--bannerlord-custom-light-cream)] flex flex-col bg-[var(--bannerlord-custom-dark-brown)]">
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Game Info Panel - Responsive sidebar */}
            <div className="mt-18 w-full lg:w-80 xl:w-96 bg-gradient-to-b from-[var(--bannerlord-custom-very-dark-brown)] to-[var(--bannerlord-patch-deep-bg)] backdrop-blur-md p-3 sm:p-4 lg:p-6 overflow-y-auto border-r-2 border-[var(--bannerlord-patch-brassy-gold)] flex-shrink-0 max-h-64 lg:max-h-full mobile-sidebar mobile-scroll shadow-2xl">
              <div className="space-y-4">
                {/* Input Section */}
                <div className="bg-gradient-to-br from-[var(--bannerlord-custom-dark-brown)] to-[var(--bannerlord-patch-deep-bg)] rounded-xl p-4 border-2 border-[var(--bannerlord-patch-brassy-gold)] shadow-lg">
                    <h3 className="text-base font-bold mb-3 text-[var(--bannerlord-patch-brassy-gold)] flex items-center">
                      <span className="w-2 h-2 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full mr-2"></span>
                      Guess Map Area
                    </h3>
                    <div className="w-full">
                      <div className="relative" ref={areaInputRef}>
                        <div className="relative flex flex-row text-center justify-center items-center">
                          <input
                            type="text"
                            value={areaInputValue}
                            onChange={(e) => handleAreaInputChange(e.target.value)}
                            placeholder="Type to find the map area..."
                            className="w-full h-10 md:h-12 text-[#d7b587] font-semibold tracking-wide bg-[radial-gradient(ellipse_at_center,_#3b372f_0%,_#2f2c25_100%)] border border-[#8A691F] shadow-md rounded-lg rounded-r-none px-2 md:px-3 focus:outline-none text-sm"
                            autoComplete="off"
                            onFocus={() => {
                              if (areaInputValue !== "") {
                                setShowAreaSuggestions(true);
                              }
                            }}
                          />
                          <img
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-none p-0 cursor-pointer z-10 transform transition duration-200 hover:scale-110 filter hover:brightness-125"
                            src="/submit4.png"
                            alt="submit_button"
                            onClick={handleAreaSubmit}
                          />
                        </div>
                        
                        {/* Map Area Suggestions Dropdown */}
                        {showAreaSuggestions && areaSuggestions.length > 0 && (
                          <div className="absolute z-10 mt-2 w-full max-h-48 overflow-auto rounded-md bg-[radial-gradient(ellipse_at_center,_#3b372f_0%,_#2f2c25_100%)] py-1 text-sm shadow-lg">
                            {areaSuggestions.length === 0 && areaInputValue !== "" ? (
                              <div className="cursor-default select-none py-1.5 px-3 text-[#D7B587] flex justify-center text-sm">
                                No area found.
                              </div>
                            ) : (
                              areaSuggestions.map((area, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleAreaSelect(area)}
                                  className="cursor-pointer select-none relative py-1.5 pl-2 pr-3 text-[#D7B587] text-sm hover:bg-[rgba(255,255,255,0.1)]"
                                >
                                  <div className="flex items-center">
                                    <span className="ml-3 block truncate text-sm font-medium">
                                      {area.name}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                {/* Calradic Trials */}
                <div className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                  !showArrows && !showSettlementTypeHint 
                    ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/60 shadow-xl shadow-green-500/30' 
                    : 'bg-gradient-to-br from-[var(--bannerlord-custom-dark-brown)] to-[var(--bannerlord-patch-deep-bg)] border-[var(--bannerlord-patch-brassy-gold)] shadow-lg'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-[var(--bannerlord-patch-brassy-gold)] flex items-center">
                      <span className="w-2 h-2 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full mr-2"></span>
                      Calradic Trials
                    </h3>
                    {!showArrows && !showSettlementTypeHint && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-green-400">CHALLENGE ACTIVE</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowArrows(!showArrows)}
                      className={`w-full flex items-center justify-center space-x-2 px-3 py-2 font-semibold text-xs rounded border-2 transition-all duration-200 ${
                        showArrows 
                          ? 'bg-gradient-to-b from-[var(--bannerlord-patch-rust-orange)] to-[var(--bannerlord-patch-warm-tan)] border-[var(--bannerlord-patch-brassy-gold)] hover:from-[var(--bannerlord-patch-gold-text)] hover:to-[var(--bannerlord-patch-rust-orange)] text-[var(--bannerlord-patch-dark-text)] shadow-lg shadow-[var(--bannerlord-patch-rust-orange)]/30' 
                          : 'bg-gradient-to-b from-[var(--bannerlord-custom-very-dark-brown)] to-[var(--bannerlord-custom-dark-brown)] border-[var(--bannerlord-custom-med-brown)] hover:from-[var(--bannerlord-custom-dark-brown)] hover:to-[var(--bannerlord-custom-med-brown)] text-[var(--bannerlord-custom-light-cream)] shadow-lg shadow-[var(--bannerlord-custom-very-dark-brown)]/30'
                      }`}
                    >
                      {showArrows ? (
                        <FaCheck className="w-4 h-4" />
                      ) : (
                        <FaTimes className="w-4 h-4" />
                      )}
                      <span>{showArrows ? 'Directions: ON' : 'Directions: OFF'}</span>
                    </button>
                    
                    <button
                      onClick={() => setShowSettlementTypeHint(!showSettlementTypeHint)}
                      className={`w-full flex items-center justify-center space-x-2 px-3 py-2 font-semibold text-xs rounded border-2 transition-all duration-200 ${
                        showSettlementTypeHint 
                          ? 'bg-gradient-to-b from-[var(--bannerlord-patch-rust-orange)] to-[var(--bannerlord-patch-warm-tan)] border-[var(--bannerlord-patch-brassy-gold)] hover:from-[var(--bannerlord-patch-gold-text)] hover:to-[var(--bannerlord-patch-rust-orange)] text-[var(--bannerlord-patch-dark-text)] shadow-lg shadow-[var(--bannerlord-patch-rust-orange)]/30' 
                          : 'bg-gradient-to-b from-[var(--bannerlord-custom-very-dark-brown)] to-[var(--bannerlord-custom-dark-brown)] border-[var(--bannerlord-custom-med-brown)] hover:from-[var(--bannerlord-custom-dark-brown)] hover:to-[var(--bannerlord-custom-med-brown)] text-[var(--bannerlord-custom-light-cream)] shadow-lg shadow-[var(--bannerlord-custom-very-dark-brown)]/30'
                      }`}
                    >
                      {showSettlementTypeHint ? (
                        <FaCheck className="w-4 h-4" />
                      ) : (
                        <FaTimes className="w-4 h-4" />
                      )}
                      <span>{showSettlementTypeHint ? 'Settlement Type: ON' : 'Settlement Type: OFF'}</span>
                    </button>
                  </div>
                </div>

                {/* Help & Support */}
                <div className="bg-gradient-to-br from-[var(--bannerlord-custom-dark-brown)] to-[var(--bannerlord-patch-deep-bg)] rounded-xl p-4 border-2 border-[var(--bannerlord-patch-brassy-gold)] shadow-lg">
                  <h3 className="text-base font-bold mb-3 text-[var(--bannerlord-patch-brassy-gold)] flex items-center">
                    <span className="w-2 h-2 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full mr-2"></span>
                    Help & Support
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowHowToPlay(true)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[var(--bannerlord-patch-brassy-gold)] to-[var(--bannerlord-patch-gold-text)] hover:from-[var(--bannerlord-patch-gold-text)] hover:to-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] font-bold text-sm rounded-lg border-2 border-[var(--bannerlord-patch-brassy-gold)] shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <IoIosHelpCircle className="w-5 h-5" />
                      <span>How to Play</span>
                    </button>
                    
                    <button
                      onClick={() => setShowAbout(true)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[var(--bannerlord-patch-brassy-gold)] to-[var(--bannerlord-patch-gold-text)] hover:from-[var(--bannerlord-patch-gold-text)] hover:to-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] font-bold text-sm rounded-lg border-2 border-[var(--bannerlord-patch-brassy-gold)] shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <FaInfoCircle className="w-5 h-5" />
                      <span>About Bannerdle</span>
                    </button>
                    
                    <button
                      onClick={() => window.open(CONFIG.DONATION_URL, '_blank', 'noopener,noreferrer')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[var(--bannerlord-patch-brassy-gold)] to-[var(--bannerlord-patch-gold-text)] hover:from-[var(--bannerlord-patch-gold-text)] hover:to-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] font-bold text-sm rounded-lg border-2 border-[var(--bannerlord-patch-brassy-gold)] shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Image 
                        src="/kofi_symbol.png" 
                        alt="Ko-Fi" 
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <span>Support Development</span>
                    </button>
                  </div>
                </div>

                {/* Victory Banner - Show when correct guess is found */}
                {mapGameState.correctGuess && (
                  <MapVictoryBanner correctGuess={mapGameState.correctGuess} />
                )}

              </div>
            </div>

            {/* Map - Takes remaining width and height */}
            <div className="flex-1 min-h-0 lg:min-h-full p-2 sm:p-3 lg:p-4">
              <MapComponent
                guesses={mapGameState.guesses}
                highlightedSettlement={null}
                selectedArea={selectedArea}
                showArrows={showArrows}
                showSettlementTypeHint={showSettlementTypeHint}
              />
            </div>
          </div>
        </div>
      </div>
      
      <AboutModal 
        isOpen={showAbout} 
        onClose={() => setShowAbout(false)}
      />
      
      <MapQuestHowToPlayModal 
        isOpen={showHowToPlay} 
        onClose={() => setShowHowToPlay(false)}
      />
    </PageRefreshLoader>
  );
}

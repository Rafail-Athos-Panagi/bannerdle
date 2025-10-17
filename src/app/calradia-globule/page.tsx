'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MapComponent from '@/components/MapComponent';
import MedievalNavbar from '@/components/MedievalNavbar';
import PageRefreshLoader from '@/components/PageRefreshLoader';
import LoadingSpinner from '@/components/LoadingSpinner';
import AboutModal from '@/components/AboutModal';
import MapQuestHowToPlayModal from '@/components/MapQuestHowToPlayModal';
import { FaInfoCircle, FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [showArrows, setShowArrows] = useState(true);
  const [showSettlementTypeHint, setShowSettlementTypeHint] = useState(true);
  
  // Area search state
  const [areaInputValue, setAreaInputValue] = useState('');
  const [areaSuggestions, setAreaSuggestions] = useState<MapArea[]>([]);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
  const [selectedArea, setSelectedArea] = useState<MapArea | null>(null);

  // Ensure we're on the client side before initializing
  useEffect(() => {
    setIsClient(true);
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
            <div className="mt-18 w-full lg:w-64 xl:w-72 bg-[var(--bannerlord-custom-very-dark-brown)] backdrop-blur-sm p-2 sm:p-3 lg:p-4 overflow-y-auto border-r border-[var(--bannerlord-custom-med-brown)] flex-shrink-0 max-h-64 lg:max-h-full mobile-sidebar mobile-scroll">
              <div className="space-y-2">
                {/* Input Section */}
                <div className="bg-[var(--bannerlord-custom-dark-brown)] rounded-lg p-2 border border-[var(--bannerlord-custom-med-brown)]">
                    <h3 className="text-sm font-semibold mb-2 text-[var(--bannerlord-patch-brassy-gold)]">
                      Guess Map Area
                    </h3>
                    <form onSubmit={handleAreaSubmit} className="relative">
                      <input
                        type="text"
                        value={areaInputValue}
                        onChange={(e) => handleAreaInputChange(e.target.value)}
                        placeholder="Type map area name..."
                        className="w-full px-2 py-1.5 bg-[var(--bannerlord-custom-very-dark-brown)] border border-[var(--bannerlord-custom-med-brown)] rounded-lg text-sm text-[var(--bannerlord-custom-light-cream)] placeholder-[var(--bannerlord-custom-light-cream)] placeholder-opacity-50 focus:outline-none focus:border-[var(--bannerlord-patch-brassy-gold)] mobile-input"
                        autoComplete="off"
                      />
                      
                      {/* Map Area Suggestions Dropdown */}
                      {showAreaSuggestions && areaSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bannerlord-custom-dark-brown)] border border-[var(--bannerlord-custom-med-brown)] rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto suggestions-dropdown">
                          {areaSuggestions.map((area, index) => (
                            <div
                              key={index}
                              onClick={() => handleAreaSelect(area)}
                              className="px-2 py-1.5 hover:bg-[var(--bannerlord-custom-med-brown)] cursor-pointer text-xs border-b border-[var(--bannerlord-custom-med-brown)] last:border-b-0 text-[var(--bannerlord-custom-light-cream)] touch-manipulation"
                            >
                              <div className="font-medium">{area.name}</div>
                              <div className="text-xs text-[var(--bannerlord-custom-light-cream)] opacity-70">{area.faction} • {area.type}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </form>
                  </div>


                {/* Instructions */}
                <div className="bg-[var(--bannerlord-custom-dark-brown)] rounded-lg p-2 border border-[var(--bannerlord-custom-med-brown)]">
                  <h3 className="text-sm font-semibold mb-2 text-[var(--bannerlord-patch-brassy-gold)]">How to Explore</h3>
                  <div className="text-xs text-[var(--bannerlord-custom-light-cream)] space-y-1">
                    <div>• Type map area names to explore</div>
                    <div>• Discover locations across Calradia</div>
                    <div>• Track your exploration history</div>
                    <div>• Learn about different areas and their locations</div>
                  </div>
                </div>

                {/* Calradic Trials */}
                <div className="bg-[var(--bannerlord-custom-dark-brown)] rounded-lg p-2 border border-[var(--bannerlord-custom-med-brown)]">
                  <h3 className="text-sm font-semibold mb-2 text-[var(--bannerlord-patch-brassy-gold)]">Calradic Trials</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowArrows(!showArrows)}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[var(--bannerlord-patch-brassy-gold)] hover:bg-[var(--bannerlord-custom-med-brown)] text-[var(--bannerlord-custom-very-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)] font-semibold text-xs rounded transition-all duration-200"
                    >
                      {showArrows ? (
                        <FaEyeSlash className="w-4 h-4" />
                      ) : (
                        <FaEye className="w-4 h-4" />
                      )}
                      <span>{showArrows ? 'Hide Arrows' : 'Show Arrows'}</span>
                    </button>
                    
                    <button
                      onClick={() => setShowSettlementTypeHint(!showSettlementTypeHint)}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[var(--bannerlord-patch-brassy-gold)] hover:bg-[var(--bannerlord-custom-med-brown)] text-[var(--bannerlord-custom-very-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)] font-semibold text-xs rounded transition-all duration-200"
                    >
                      {showSettlementTypeHint ? (
                        <FaEyeSlash className="w-4 h-4" />
                      ) : (
                        <FaEye className="w-4 h-4" />
                      )}
                      <span>{showSettlementTypeHint ? 'Hide Settlement Type Hint' : 'Show Settlement Type Hint'}</span>
                    </button>
                  </div>
                </div>

                {/* Help & Support */}
                <div className="bg-[var(--bannerlord-custom-dark-brown)] rounded-lg p-2 border border-[var(--bannerlord-custom-med-brown)]">
                  <h3 className="text-sm font-semibold mb-2 text-[var(--bannerlord-patch-brassy-gold)]">Help & Support</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowHowToPlay(true)}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[var(--bannerlord-patch-brassy-gold)] hover:bg-[var(--bannerlord-custom-med-brown)] text-[var(--bannerlord-custom-very-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)] font-semibold text-xs rounded transition-all duration-200"
                    >
                      <IoIosHelpCircle className="w-4 h-4" />
                      <span>How to Play</span>
                    </button>
                    
                    <button
                      onClick={() => setShowAbout(true)}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[var(--bannerlord-patch-brassy-gold)] hover:bg-[var(--bannerlord-custom-med-brown)] text-[var(--bannerlord-custom-very-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)] font-semibold text-xs rounded transition-all duration-200"
                    >
                      <FaInfoCircle className="w-4 h-4" />
                      <span>About Bannerdle</span>
                    </button>
                    
                    <button
                      onClick={() => window.open(CONFIG.DONATION_URL, '_blank', 'noopener,noreferrer')}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[var(--bannerlord-patch-brassy-gold)] hover:bg-[var(--bannerlord-custom-med-brown)] text-[var(--bannerlord-custom-very-dark-brown)] hover:text-[var(--bannerlord-patch-brassy-gold)] font-semibold text-xs rounded transition-all duration-200"
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

'use client';

import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import MedievalNavbar from '@/components/MedievalNavbar';
import { MapArea } from '@/types/MapArea.type';
import { MapAreaService, MapGameState, MapGuess } from '@/services/MapAreaService';
import { MapAreaGameService } from '@/services/MapAreaGameService';
import mapAreasData from '@/data/map_areas.json';

export default function CalradiaGlobuleGame() {
  const [mapGameState, setMapGameState] = useState<MapGameState | null>(null);
  const [isClient, setIsClient] = useState(false);
  
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

  // Fetch lastSelection from Supabase and store it to localStorage
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
  const handleAreaInputChange = (value: string) => {
    setAreaInputValue(value);
    
    if (value.length > 0) {
      // Get list of already guessed area names
      const guessedAreaNames = mapGameState?.guesses.map(guess => guess.mapArea.name) || [];
      
      const filteredAreas = mapAreasData.filter(
        area => 
          area.name.toLowerCase().startsWith(value.toLowerCase()) &&
          !guessedAreaNames.includes(area.name)
      ) as MapArea[];
      setAreaSuggestions(filteredAreas);
      setShowAreaSuggestions(true);
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

  const getDistanceText = (distance: number): string => {
    if (distance < 50) return 'Very close!';
    if (distance < 100) return 'Close';
    if (distance < 200) return 'Moderate distance';
    if (distance < 300) return 'Far';
    return 'Very far';
  };

  const getDirectionArrow = (direction: string): string => {
    const arrows: { [key: string]: string } = {
      'N': '↑',
      'NE': '↗',
      'E': '→',
      'SE': '↘',
      'S': '↓',
      'SW': '↙',
      'W': '←',
      'NW': '↖'
    };
    return arrows[direction] || '?';
  };

  if (!isClient || !mapGameState) {
    return (
      <div 
        className="h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
        style={{ 
          backgroundImage: 'url(/bg-1.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        <MedievalNavbar />
        <div className="flex items-center justify-center min-h-screen bg-[var(--bannerlord-custom-dark-brown)]">
          <div className="text-[var(--bannerlord-custom-light-cream)] text-xl">Loading game...</div>
        </div>
      </div>
    );
  }

  return (
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
          <div className="mt-18 w-full lg:w-56 bg-[var(--bannerlord-custom-very-dark-brown)] backdrop-blur-sm p-2 overflow-y-auto border-r border-[var(--bannerlord-custom-med-brown)] flex-shrink-0 max-h-64 lg:max-h-full mobile-sidebar mobile-scroll">
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

              {/* Guesses History */}
              <div className="bg-[var(--bannerlord-custom-dark-brown)] rounded-lg p-2 border border-[var(--bannerlord-custom-med-brown)]">
                <h3 className="text-sm font-semibold mb-2 text-[var(--bannerlord-patch-brassy-gold)]">
                  Guessed Areas
                </h3>
                {mapGameState.guesses.length === 0 ? (
                  <div className="text-[var(--bannerlord-custom-light-cream)] opacity-70 text-xs">
                    No areas explored yet
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {mapGameState.guesses.map((guess, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg border ${
                          guess.isCorrect
                            ? 'bg-[var(--bannerlord-patch-brassy-gold)] bg-opacity-20 border-[var(--bannerlord-patch-brassy-gold)]'
                            : 'bg-[var(--bannerlord-custom-very-dark-brown)] border-[var(--bannerlord-custom-med-brown)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-xs text-[var(--bannerlord-custom-light-cream)]">
                            {(guess as MapGuess).mapArea.name}
                          </div>
                          <div className="text-xs">
                            {guess.isCorrect ? '✅' : '❌'}
                          </div>
                        </div>
                        {!guess.isCorrect && (
                          <div className="text-xs text-[var(--bannerlord-custom-light-cream)] opacity-70 mt-1">
                            <div>{getDistanceText(guess.distance)}</div>
                            <div className="flex items-center">
                              Direction: {getDirectionArrow(guess.direction)} {guess.direction}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
            </div>
          </div>

          {/* Map - Takes remaining width and height */}
          <div className="flex-1 min-h-0 lg:min-h-full p-2 lg:p-4">
            <MapComponent
              guesses={mapGameState.guesses}
              highlightedSettlement={null}
              selectedArea={selectedArea}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

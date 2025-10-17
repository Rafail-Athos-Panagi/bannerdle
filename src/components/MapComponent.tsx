import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Settlement, Guess } from '@/types/Settlement.type';
import { MapArea } from '@/types/MapArea.type';
import { MapGuess } from '@/services/MapAreaService';
import { MapAreaGameService } from '@/services/MapAreaGameService';
import { GiVillage, GiCastle } from 'react-icons/gi';
import { PiCastleTurretFill } from 'react-icons/pi';
import { FaLongArrowAltDown, FaTrophy } from 'react-icons/fa';

// Dynamic import for Leaflet to avoid SSR issues
let L: typeof import('leaflet') | null = null;
let DefaultIcon: import('leaflet').Icon | null = null;

const loadLeaflet = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    L = await import('leaflet');
    
    // Import icons
    const icon = await import('leaflet/dist/images/marker-icon.png');
    const iconShadow = await import('leaflet/dist/images/marker-shadow.png');
    const iconRetina = await import('leaflet/dist/images/marker-icon-2x.png');
    
    DefaultIcon = L.icon({
      iconUrl: icon.default.src,
      shadowUrl: iconShadow.default.src,
      iconRetinaUrl: iconRetina.default.src,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = DefaultIcon;
  } catch (error) {
    console.error('Failed to load Leaflet:', error);
  }
};

interface MapComponentProps {
  guesses: (Guess | MapGuess)[];
  highlightedSettlement: Settlement | null;
  selectedArea: MapArea | null;
  showArrows?: boolean;
  showSettlementTypeHint?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  guesses,
  highlightedSettlement,
  selectedArea,
  showArrows = false,
  showSettlementTypeHint = false
}) => {
  const [isClient, setIsClient] = useState(false);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  // Map bounds for future use
  // const [mapBounds] = useState<[[number, number], [number, number]]>([
  //   [0, 0], [1000, 1000]
  // ]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(null);

  // Map zoom and pan state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1.5); // Dynamic zoom level
  const mapRef = useRef<HTMLDivElement>(null);

  // Initialize client-side only
  React.useEffect(() => {
    setIsClient(true);
    loadLeaflet();
  }, []);

  // Fetch map areas from API
  useEffect(() => {
    const fetchMapAreas = async () => {
      try {
        const response = await fetch('/api/map-areas');
        if (response.ok) {
          const mapAreasData = await response.json();
          // Convert map areas to settlements format for map rendering
          const settlementsData = mapAreasData.map((area: MapArea, index: number) => ({
            id: (index + 1).toString(),
            name: area.name,
            type: area.type.toLowerCase() as 'town' | 'castle' | 'village',
            faction: area.faction,
            center: area.coordinates as [number, number],
            radius: 20 // Default radius for clickable area
          }));
          setSettlements(settlementsData);
        } else {
          console.error('Failed to fetch map areas');
        }
      } catch (error) {
        console.error('Error fetching map areas:', error);
      }
    };

    if (isClient) {
      fetchMapAreas();
    }
  }, [isClient]);

  // Helper function to check if a guess is a settlement guess
  const isSettlementGuess = (guess: Guess | MapGuess): guess is Guess => {
    return 'settlement' in guess;
  };

  // Handle marker click
  const handleMarkerClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent map panning when clicking marker
    setSelectedMarkerIndex(selectedMarkerIndex === index ? null : index);
  };

  // Handle marker touch start for mobile
  const handleMarkerTouchStart = (index: number, e: React.TouchEvent) => {
    e.stopPropagation(); // Prevent map panning when touching marker
  };

  // Handle marker touch end for mobile
  const handleMarkerTouchEnd = (index: number, e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Prevent map panning when touching marker
    setSelectedMarkerIndex(selectedMarkerIndex === index ? null : index);
  };

  // Handle map click to deselect markers
  const handleMapClick = () => {
    setSelectedMarkerIndex(null);
  };

  // Handle map touch to deselect markers
  // const handleMapTouch = () => {
  //   setSelectedMarkerIndex(null);
  // };

  // Zoom configuration
  const MIN_ZOOM = 1.1; // 110%
  const MAX_ZOOM = 3.0; // 300%
  const ZOOM_STEP = 0.2;

  // Drag event handlers for zoomed map panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
    e.preventDefault();
  }, [mapOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate bounds based on zoom level
    // When zoomed, we can pan up to (zoomLevel - 1) / 2 of the container size
    const containerWidth = mapRef.current?.offsetWidth || 0;
    const containerHeight = mapRef.current?.offsetHeight || 0;
    const maxPanX = Math.max(0, (containerWidth * (zoomLevel - 1)) / 2);
    const maxPanY = Math.max(0, (containerHeight * (zoomLevel - 1)) / 2);
    
    setMapOffset({ 
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)), 
      y: Math.max(-maxPanY, Math.min(maxPanY, newY)) 
    });
    e.preventDefault();
  }, [isDragging, dragStart, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Check if the touch is on a marker (has mobile-area-marker class)
    const target = e.target as HTMLElement;
    if (target.closest('.mobile-area-marker')) {
      return; // Don't handle map dragging if touching a marker
    }
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - mapOffset.x, y: touch.clientY - mapOffset.y });
      e.preventDefault();
    }
  }, [mapOffset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    // Check if the touch is on a marker
    const target = e.target as HTMLElement;
    if (target.closest('.mobile-area-marker')) {
      return; // Don't handle map dragging if touching a marker
    }
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Calculate bounds based on zoom level
    const containerWidth = mapRef.current?.offsetWidth || 0;
    const containerHeight = mapRef.current?.offsetHeight || 0;
    const maxPanX = Math.max(0, (containerWidth * (zoomLevel - 1)) / 2);
    const maxPanY = Math.max(0, (containerHeight * (zoomLevel - 1)) / 2);
    
    setMapOffset({ 
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)), 
      y: Math.max(-maxPanY, Math.min(maxPanY, newY)) 
    });
    e.preventDefault();
  }, [isDragging, dragStart, zoomLevel]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setIsDragging(false);
    
    // Check if touch ended on map (not on a marker) and deselect markers after a short delay
    const target = e.target as HTMLElement;
    if (!target.closest('.mobile-area-marker')) {
      setTimeout(() => {
        setSelectedMarkerIndex(null);
      }, 100); // Small delay to allow marker touch to complete first
    }
  }, []);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM);
      // Calculate the center point of the current view
      const containerWidth = mapRef.current?.offsetWidth || 0;
      const containerHeight = mapRef.current?.offsetHeight || 0;
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // Calculate the current map position at the center point
      const currentMapX = centerX + mapOffset.x;
      const currentMapY = centerY + mapOffset.y;
      
      // Calculate the new offset to keep the same map point at the center
      const zoomRatio = newZoom / prevZoom;
      const newOffsetX = currentMapX * zoomRatio - centerX;
      const newOffsetY = currentMapY * zoomRatio - centerY;
      
      // Apply bounds checking
      const maxPanX = Math.max(0, (containerWidth * (newZoom - 1)) / 2);
      const maxPanY = Math.max(0, (containerHeight * (newZoom - 1)) / 2);
      
      setMapOffset({
        x: Math.max(-maxPanX, Math.min(maxPanX, newOffsetX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newOffsetY))
      });
      
      return newZoom;
    });
  }, [mapOffset]);

  const zoomOut = useCallback(() => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM);
      // Calculate the center point of the current view
      const containerWidth = mapRef.current?.offsetWidth || 0;
      const containerHeight = mapRef.current?.offsetHeight || 0;
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // Calculate the current map position at the center point
      const currentMapX = centerX + mapOffset.x;
      const currentMapY = centerY + mapOffset.y;
      
      // Calculate the new offset to keep the same map point at the center
      const zoomRatio = newZoom / prevZoom;
      const newOffsetX = currentMapX * zoomRatio - centerX;
      const newOffsetY = currentMapY * zoomRatio - centerY;
      
      // Apply bounds checking
      const maxPanX = Math.max(0, (containerWidth * (newZoom - 1)) / 2);
      const maxPanY = Math.max(0, (containerHeight * (newZoom - 1)) / 2);
      
      setMapOffset({
        x: Math.max(-maxPanX, Math.min(maxPanX, newOffsetX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newOffsetY))
      });
      
      return newZoom;
    });
  }, [mapOffset]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1.5);
    setMapOffset({ x: 0, y: 0 });
  }, []);

  // Keyboard shortcuts for zoom
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    }
  }, [zoomIn, zoomOut, resetZoom]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setZoomLevel(prevZoom => {
        const newZoom = Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM);
        const containerWidth = mapRef.current?.offsetWidth || 0;
        const containerHeight = mapRef.current?.offsetHeight || 0;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        
        const currentMapX = centerX + mapOffset.x;
        const currentMapY = centerY + mapOffset.y;
        
        const zoomRatio = newZoom / prevZoom;
        const newOffsetX = currentMapX * zoomRatio - centerX;
        const newOffsetY = currentMapY * zoomRatio - centerY;
        
        const maxPanX = Math.max(0, (containerWidth * (newZoom - 1)) / 2);
        const maxPanY = Math.max(0, (containerHeight * (newZoom - 1)) / 2);
        
        setMapOffset({
          x: Math.max(-maxPanX, Math.min(maxPanX, newOffsetX)),
          y: Math.max(-maxPanY, Math.min(maxPanY, newOffsetY))
        });
        
        return newZoom;
      });
    } else if (e.deltaY > 0) {
      // Zoom out
      setZoomLevel(prevZoom => {
        const newZoom = Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM);
        const containerWidth = mapRef.current?.offsetWidth || 0;
        const containerHeight = mapRef.current?.offsetHeight || 0;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        
        const currentMapX = centerX + mapOffset.x;
        const currentMapY = centerY + mapOffset.y;
        
        const zoomRatio = newZoom / prevZoom;
        const newOffsetX = currentMapX * zoomRatio - centerX;
        const newOffsetY = currentMapY * zoomRatio - centerY;
        
        const maxPanX = Math.max(0, (containerWidth * (newZoom - 1)) / 2);
        const maxPanY = Math.max(0, (containerHeight * (newZoom - 1)) / 2);
        
        setMapOffset({
          x: Math.max(-maxPanX, Math.min(maxPanX, newOffsetX)),
          y: Math.max(-maxPanY, Math.min(maxPanY, newOffsetY))
        });
        
        return newZoom;
      });
    }
  }, [mapOffset]);

  // Add keyboard and wheel event listeners
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (mapElement) {
        mapElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleKeyDown, handleWheel]);

  // Get settlement colors based on game state
  const getSettlementColor = (settlement: Settlement) => {
    // Check if this settlement was guessed correctly
    const correctGuess = guesses.find(guess => 
      isSettlementGuess(guess) && guess.settlement.id === settlement.id && guess.isCorrect
    );
    if (correctGuess) {
      return '#9c8344'; // Bannerlord brassy gold for correct guess
    }

    // Check if this settlement was guessed incorrectly
    const incorrectGuess = guesses.find(guess => 
      isSettlementGuess(guess) && guess.settlement.id === settlement.id && !guess.isCorrect
    );
    if (incorrectGuess) {
      return '#8B4513'; // Bannerlord brown-red for incorrect guess
    }

    // Check if this is the highlighted settlement
    if (highlightedSettlement && highlightedSettlement.id === settlement.id) {
      return '#D4C4A8'; // Bannerlord light cream for highlighted
    }

    // Default transparent
    return 'transparent';
  };

  const getSettlementOpacity = (settlement: Settlement) => {
    // Show correct guesses
    const correctGuess = guesses.find(guess => 
      isSettlementGuess(guess) && guess.settlement.id === settlement.id && guess.isCorrect
    );
    if (correctGuess) {
      return 0.7;
    }

    // Show incorrect guesses
    const incorrectGuess = guesses.find(guess => 
      isSettlementGuess(guess) && guess.settlement.id === settlement.id && !guess.isCorrect
    );
    if (incorrectGuess) {
      return 0.5;
    }

    // Show highlighted settlement
    if (highlightedSettlement && highlightedSettlement.id === settlement.id) {
      return 0.3;
    }

    return 0;
  };


  // Don't render during SSR
  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading map...</div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      className="w-full h-full bg-gray-800 relative overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none map-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleMapClick}
      style={{ touchAction: 'none' }}
    >
      {/* Zoomed map container */}
      <div 
        className="relative w-full h-full"
        style={{
          transform: `scale(${zoomLevel}) translate(${mapOffset.x / zoomLevel}px, ${mapOffset.y / zoomLevel}px)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Map image - zoomed in */}
        <Image 
          src="/bannerlord_clean_map.jpg" 
          alt="Calradia Map" 
          width={1920}
          height={1080}
          className="w-full h-full object-fill select-none"
          draggable={false}
        />
        
        {/* Settlement highlight circles - scaled with the map */}
        {settlements.map((settlement) => {
          const color = getSettlementColor(settlement);
          const opacity = getSettlementOpacity(settlement);
          
          // Only show circles for settlements that have been guessed or are highlighted
          if (opacity === 0) return null;
          
          return (
            <div
              key={settlement.id}
              className="absolute rounded-full border-2 pointer-events-none mobile-point"
              style={{
                left: `${settlement.center[0] / 10}%`,
                top: `${settlement.center[1] / 10}%`,
                width: `${settlement.radius * 2}px`,
                height: `${settlement.radius * 2}px`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: color,
                opacity: opacity,
                borderColor: color,
                boxShadow: `0 0 10px ${color}`
              }}
              title={settlement.name}
            />
          );
        })}

        {/* Explored Areas Markers */}
        {guesses.map((guess, index) => {
          const mapGuess = guess as MapGuess;
          const mapArea = mapGuess.mapArea;
          if (!mapArea || !mapArea.coordinates) return null;
          
          const isSelected = selectedMarkerIndex === index;
          
          // Determine pin color based on settlement type correctness and distance
          let pinColor: 'green' | 'orange' | 'yellow' | 'red';
          let iconColor: 'green' | 'orange' | 'yellow' | 'red';
          
          if (mapGuess.isCorrect) {
            pinColor = 'green'; // Correct guess - always green
            iconColor = 'green';
          } else if (showSettlementTypeHint && mapGuess.correctSettlementType) {
            pinColor = MapAreaGameService.getPinColor(mapGuess.distance, false); // Name background uses distance-based color
            iconColor = 'green'; // Icon is green for correct settlement type
          } else if (showSettlementTypeHint && !mapGuess.correctSettlementType) {
            pinColor = MapAreaGameService.getPinColor(mapGuess.distance, false); // Name background uses distance-based color
            iconColor = 'red'; // Icon is red for wrong settlement type
          } else {
            // When settlement type hint is disabled, use distance-based color for name background
            // and use the same color for all icons
            pinColor = MapAreaGameService.getPinColor(mapGuess.distance, false);
            iconColor = pinColor; // Use the same color as pin for icons when hint is disabled
          }
          
          // Determine color class based on icon color and whether hint is enabled
          let colorClass: string;
          if (showSettlementTypeHint) {
            // When hint is enabled, use standard colors
            colorClass = iconColor === 'green' ? 'bg-green-500 border-green-500' : 
                        iconColor === 'orange' ? 'bg-orange-500 border-orange-500' :
                        iconColor === 'yellow' ? 'bg-yellow-500 border-yellow-500' : 
                        'bg-red-500 border-red-500';
          } else {
            // When hint is disabled, use a single darker Bannerlord theme color for all icons
            colorClass = 'bg-[var(--bannerlord-custom-med-brown)] border-[var(--bannerlord-custom-med-brown)]'; // Medium brown for all
          }
          
          // Get direction rotation angle (reverse the API direction - show where guess is FROM target)
          const getDirectionRotation = (direction: string): number => {
            const rotations: { [key: string]: number } = {
              'N': 180,    // ↓ (rotate → 180°) - if API says N, point S (guess is south of target)
              'NE': -135,  // ↙ (rotate → -135°) - if API says NE, point SW (guess is southwest of target)
              'E': -90,    // ← (rotate → -90°) - if API says E, point W (guess is west of target)
              'SE': -45,   // ↖ (rotate → -45°) - if API says SE, point NW (guess is northwest of target)
              'S': 0,      // ↑ (rotate → 0°) - if API says S, point N (guess is north of target)
              'SW': 45,    // ↗ (rotate → 45°) - if API says SW, point NE (guess is northeast of target)
              'W': 90,     // → (rotate → 90°) - if API says W, point E (guess is east of target)
              'NW': 135    // ↘ (rotate → 135°) - if API says NW, point SE (guess is southeast of target)
            };
            return rotations[direction] || 0;
          };
          
          return (
            <div 
              key={`explored-${index}`} 
              className={`absolute mobile-area-marker cursor-pointer transition-all duration-200 ${
                isSelected ? 'z-50' : 'z-10'
              }`}
              style={{
                left: `${mapArea.coordinates[0] / 10}%`,
                top: `${mapArea.coordinates[1] / 10}%`,
                transform: 'translate(-50%, -50%)',
                touchAction: 'manipulation' // Enable touch interactions
              }}
              onClick={(e) => handleMarkerClick(index, e)}
              onTouchStart={(e) => handleMarkerTouchStart(index, e)}
              onTouchEnd={(e) => handleMarkerTouchEnd(index, e)}
            >
              {/* Area name label with direction chip */}
              <div 
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1 py-0.5 text-xs font-medium rounded border whitespace-nowrap shadow-lg mobile-area-label flex items-center gap-1 ${
                  pinColor === 'green' 
                    ? 'bg-green-500 text-white border-green-600'
                    : pinColor === 'orange'
                    ? 'bg-orange-500 text-white border-orange-600'
                    : pinColor === 'yellow' 
                    ? 'bg-yellow-500 text-white border-yellow-600' 
                    : 'bg-red-500 text-white border-red-600'
                }`}
              >
                <span>{mapArea.name}</span>
                {/* Direction chip or trophy for correct guess */}
                {showArrows && (
                  <span 
                    className="inline-flex items-center justify-center w-1.5 h-1.5 sm:w-3 sm:h-3 text-xs font-bold rounded-full bg-black bg-opacity-60 border mobile-arrow-indicator"
                    title={mapGuess.isCorrect ? "Correct!" : `Direction: ${mapGuess.direction}`}
                    style={{
                      ...(!mapGuess.isCorrect ? {
                        transform: `rotate(${getDirectionRotation(mapGuess.direction)}deg)`
                      } : {}),
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      borderWidth: '0.5px'
                    }}
                  >
                    {mapGuess.isCorrect ? (
                      <FaTrophy className="text-yellow-400 text-xs sm:text-xs" />
                    ) : (
                      <FaLongArrowAltDown className="text-white text-xs sm:text-xs" />
                    )}
                  </span>
                )}
              </div>
              
              {/* Area marker icon based on type */}
              <div 
              className={`flex items-center justify-center rounded-full ${colorClass} shadow-lg mobile-area-icon transition-all duration-200 ease-out ${
                isSelected ? 'w-6 h-6 scale-110' : 'w-4 h-4 scale-100'
              }`}
                style={{
                  boxShadow: showSettlementTypeHint 
                    ? `0 0 ${isSelected ? '12px' : '8px'} ${iconColor === 'green' ? '#10b981' : iconColor === 'orange' ? '#f97316' : iconColor === 'yellow' ? '#f59e0b' : '#ef4444'}`
                    : `0 0 ${isSelected ? '12px' : '8px'} var(--bannerlord-custom-med-brown)` // Darker theme color shadow when hint is disabled
                }}
              >
                {mapArea.type === 'Village' && (
                  <GiVillage className={`text-white ${isSelected ? 'text-sm' : 'text-xs'}`} />
                )}
                {mapArea.type === 'Castle' && (
                  <PiCastleTurretFill className={`text-white ${isSelected ? 'text-sm' : 'text-xs'}`} />
                )}
                {mapArea.type === 'Town' && (
                  <GiCastle className={`text-white ${isSelected ? 'text-sm' : 'text-xs'}`} />
                )}
              </div>
            </div>
          );
        })}

        {/* Selected Area Marker */}
        {selectedArea && selectedArea.coordinates && (
          <div className="absolute pointer-events-none mobile-area-marker" style={{
            left: `${selectedArea.coordinates[0] / 10}%`,
            top: `${selectedArea.coordinates[1] / 10}%`,
            transform: 'translate(-50%, -50%)'
          }}>
            {/* Area name label */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1 py-0.5 bg-[var(--bannerlord-custom-very-dark-brown)] text-[var(--bannerlord-custom-light-cream)] text-xs font-medium rounded border border-[var(--bannerlord-custom-med-brown)] whitespace-nowrap shadow-lg mobile-area-label">
              {selectedArea.name}
            </div>
            
            {/* Area marker icon based on type */}
            <div 
              className="flex items-center justify-center w-4 h-4 rounded-full bg-[var(--bannerlord-patch-brassy-gold)] border border-[var(--bannerlord-patch-brassy-gold)] shadow-lg mobile-area-icon"
              style={{
                boxShadow: '0 0 8px var(--bannerlord-patch-brassy-gold)'
              }}
            >
              {selectedArea.type === 'Village' && (
                <GiVillage className="text-[var(--bannerlord-custom-very-dark-brown)] text-xs" />
              )}
              {selectedArea.type === 'Castle' && (
                <PiCastleTurretFill className="text-[var(--bannerlord-custom-very-dark-brown)] text-xs" />
              )}
              {selectedArea.type === 'Town' && (
                <GiCastle className="text-[var(--bannerlord-custom-very-dark-brown)] text-xs" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Controls - Responsive */}
      <div className="absolute top-16 sm:top-18 lg:top-20 right-2 sm:right-3 lg:right-4 flex flex-col gap-1 sm:gap-1.5 lg:gap-2 z-20">
        {/* Zoom In Button */}
        <button
          onClick={zoomIn}
          disabled={zoomLevel >= MAX_ZOOM}
          className="w-10 h-10 sm:w-11 sm:h-11 lg:w-10 lg:h-10 bg-[var(--bannerlord-custom-dark-brown)] hover:bg-[var(--bannerlord-custom-med-brown)] disabled:bg-[var(--bannerlord-custom-very-dark-brown)] disabled:opacity-50 border border-[var(--bannerlord-custom-med-brown)] rounded-lg flex items-center justify-center text-[var(--bannerlord-custom-light-cream)] font-bold text-lg sm:text-xl lg:text-lg transition-colors shadow-lg touch-manipulation"
          title="Zoom In (Ctrl + Plus or Mouse Wheel Up)"
        >
          +
        </button>
        
        {/* Zoom Level Display */}
        <div className="w-10 h-8 sm:w-11 sm:h-9 lg:w-10 lg:h-8 bg-[var(--bannerlord-custom-dark-brown)] border border-[var(--bannerlord-custom-med-brown)] rounded-lg flex items-center justify-center text-[var(--bannerlord-custom-light-cream)] text-xs sm:text-sm lg:text-xs font-medium shadow-lg">
          {Math.round(zoomLevel * 100)}%
        </div>
        
        {/* Zoom Out Button */}
        <button
          onClick={zoomOut}
          disabled={zoomLevel <= MIN_ZOOM}
          className="w-10 h-10 sm:w-11 sm:h-11 lg:w-10 lg:h-10 bg-[var(--bannerlord-custom-dark-brown)] hover:bg-[var(--bannerlord-custom-med-brown)] disabled:bg-[var(--bannerlord-custom-very-dark-brown)] disabled:opacity-50 border border-[var(--bannerlord-custom-med-brown)] rounded-lg flex items-center justify-center text-[var(--bannerlord-custom-light-cream)] font-bold text-lg sm:text-xl lg:text-lg transition-colors shadow-lg touch-manipulation"
          title="Zoom Out (Ctrl + Minus or Mouse Wheel Down)"
        >
          −
        </button>
        
        {/* Reset Zoom Button */}
        <button
          onClick={resetZoom}
          className="w-10 h-8 sm:w-11 sm:h-9 lg:w-10 lg:h-8 bg-[var(--bannerlord-custom-dark-brown)] hover:bg-[var(--bannerlord-custom-med-brown)] border border-[var(--bannerlord-custom-med-brown)] rounded-lg flex items-center justify-center text-[var(--bannerlord-custom-light-cream)] text-xs sm:text-sm lg:text-xs font-medium transition-colors shadow-lg touch-manipulation"
          title="Reset Zoom (Ctrl + 0)"
        >
          ⌂
        </button>
      </div>
    </div>
  );
};

export default MapComponent;

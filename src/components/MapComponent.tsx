import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Settlement, Guess } from '@/types/Settlement.type';
import { MapArea } from '@/types/MapArea.type';
import { MapGuess } from '@/services/MapAreaService';
import { MapAreaGameService } from '@/services/MapAreaGameService';
import { GiVillage, GiCastle } from 'react-icons/gi';
import { PiCastleTurretFill } from 'react-icons/pi';

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
}

const MapComponent: React.FC<MapComponentProps> = ({
  guesses,
  highlightedSettlement,
  selectedArea
}) => {
  const [isClient, setIsClient] = useState(false);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [mapBounds] = useState<[[number, number], [number, number]]>([
    [0, 0], [1000, 1000]
  ]);

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

  // Fetch settlements from API
  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const response = await fetch('/api/settlements');
        if (response.ok) {
          const settlementsData = await response.json();
          setSettlements(settlementsData);
        } else {
          console.error('Failed to fetch settlements');
        }
      } catch (error) {
        console.error('Error fetching settlements:', error);
      }
    };

    if (isClient) {
      fetchSettlements();
    }
  }, [isClient]);

  // Helper function to check if a guess is a settlement guess
  const isSettlementGuess = (guess: Guess | MapGuess): guess is Guess => {
    return 'settlement' in guess;
  };

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
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - mapOffset.x, y: touch.clientY - mapOffset.y });
      e.preventDefault();
    }
  }, [mapOffset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
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

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
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

  console.log('MapComponent rendering with bounds:', mapBounds);
  console.log('Settlements count:', settlements.length);

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
        <img 
          src="/bannerlord_map1.jpg" 
          alt="Calradia Map" 
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
          const mapArea = (guess as MapGuess).mapArea;
          if (!mapArea || !mapArea.coordinates) return null;
          
          // Determine pin color based on distance
          const pinColor = MapAreaGameService.getPinColor(guess.distance);
          const colorClass = pinColor === 'green' ? 'bg-green-500 border-green-500' : 
                           pinColor === 'yellow' ? 'bg-yellow-500 border-yellow-500' : 
                           'bg-red-500 border-red-500';
          
          return (
            <div 
              key={`explored-${index}`} 
              className="absolute pointer-events-none mobile-area-marker" 
              style={{
                left: `${mapArea.coordinates[0] / 10}%`,
                top: `${mapArea.coordinates[1] / 10}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Area name label */}
              <div 
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1 py-0.5 text-xs font-medium rounded border whitespace-nowrap shadow-lg mobile-area-label ${
                  pinColor === 'green' 
                    ? 'bg-green-500 text-white border-green-600' 
                    : pinColor === 'yellow' 
                    ? 'bg-yellow-500 text-white border-yellow-600' 
                    : 'bg-red-500 text-white border-red-600'
                }`}
              >
                {mapArea.name}
              </div>
              
              {/* Area marker icon based on type */}
              <div 
                className={`flex items-center justify-center w-4 h-4 rounded-full ${colorClass} shadow-lg mobile-area-icon`}
                style={{
                  boxShadow: `0 0 8px ${pinColor === 'green' ? '#10b981' : pinColor === 'yellow' ? '#f59e0b' : '#ef4444'}`
                }}
              >
                {mapArea.type === 'Village' && (
                  <GiVillage className="text-white text-xs" />
                )}
                {mapArea.type === 'Castle' && (
                  <PiCastleTurretFill className="text-white text-xs" />
                )}
                {mapArea.type === 'Town' && (
                  <GiCastle className="text-white text-xs" />
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

      {/* Zoom Controls - Mobile responsive */}
      <div className="absolute top-16 right-2 lg:top-20 lg:right-4 flex flex-col gap-1 lg:gap-2 z-20">
        {/* Zoom In Button */}
        <button
          onClick={zoomIn}
          disabled={zoomLevel >= MAX_ZOOM}
          className="w-12 h-12 lg:w-10 lg:h-10 bg-[var(--bannerlord-custom-dark-brown)] hover:bg-[var(--bannerlord-custom-med-brown)] disabled:bg-[var(--bannerlord-custom-very-dark-brown)] disabled:opacity-50 border border-[var(--bannerlord-custom-med-brown)] rounded-lg flex items-center justify-center text-[var(--bannerlord-custom-light-cream)] font-bold text-xl lg:text-lg transition-colors shadow-lg touch-manipulation"
          title="Zoom In (Ctrl + Plus or Mouse Wheel Up)"
        >
          +
        </button>
        
        {/* Zoom Level Display */}
        <div className="w-12 h-10 lg:w-10 lg:h-8 bg-[var(--bannerlord-custom-dark-brown)] border border-[var(--bannerlord-custom-med-brown)] rounded-lg flex items-center justify-center text-[var(--bannerlord-custom-light-cream)] text-sm lg:text-xs font-medium shadow-lg">
          {Math.round(zoomLevel * 100)}%
        </div>
        
        {/* Zoom Out Button */}
        <button
          onClick={zoomOut}
          disabled={zoomLevel <= MIN_ZOOM}
          className="w-12 h-12 lg:w-10 lg:h-10 bg-[var(--bannerlord-custom-dark-brown)] hover:bg-[var(--bannerlord-custom-med-brown)] disabled:bg-[var(--bannerlord-custom-very-dark-brown)] disabled:opacity-50 border border-[var(--bannerlord-custom-med-brown)] rounded-lg flex items-center justify-center text-[var(--bannerlord-custom-light-cream)] font-bold text-xl lg:text-lg transition-colors shadow-lg touch-manipulation"
          title="Zoom Out (Ctrl + Minus or Mouse Wheel Down)"
        >
          −
        </button>
        
        {/* Reset Zoom Button */}
        <button
          onClick={resetZoom}
          className="w-12 h-10 lg:w-10 lg:h-8 bg-[var(--bannerlord-custom-dark-brown)] hover:bg-[var(--bannerlord-custom-med-brown)] border border-[var(--bannerlord-custom-med-brown)] rounded-lg flex items-center justify-center text-[var(--bannerlord-custom-light-cream)] text-sm lg:text-xs font-medium transition-colors shadow-lg touch-manipulation"
          title="Reset Zoom (Ctrl + 0)"
        >
          ⌂
        </button>
      </div>
    </div>
  );
};

export default MapComponent;

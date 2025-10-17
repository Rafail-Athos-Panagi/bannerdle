'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import mapAreasData from '@/data/map_areas.json';

interface MapArea {
  name: string;
  faction: string;
  type: string;
  coordinates: [number, number];
}

interface CollectedCoordinate {
  id: number;
  name: string;
  faction: string;
  type: string;
  coordinates: [number, number];
}

export default function CoordinateCollector() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collectedCoordinates, setCollectedCoordinates] = useState<CollectedCoordinate[]>([]);
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(null);

  // Map zoom and pan state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1.5); // Same default zoom as MapComponent

  const mapAreas = mapAreasData as MapArea[];
  const currentArea = mapAreas[currentIndex];

  // Zoom configuration (same as MapComponent)
  const MIN_ZOOM = 1.1; // 110%
  const MAX_ZOOM = 3.0; // 300%
  const ZOOM_STEP = 0.2;

  // Load existing data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('guessed_map_areas_new');
    if (savedData) {
      try {
        setCollectedCoordinates(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data whenever collectedCoordinates changes
  useEffect(() => {
    if (collectedCoordinates.length > 0) {
      localStorage.setItem('guessed_map_areas_new', JSON.stringify(collectedCoordinates));
    }
  }, [collectedCoordinates]);

  // Drag event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate bounds based on zoom level
    const containerWidth = 1000; // Fixed container size
    const containerHeight = 1000;
    const maxPanX = Math.max(0, (containerWidth * (zoomLevel - 1)) / 2);
    const maxPanY = Math.max(0, (containerHeight * (zoomLevel - 1)) / 2);
    
    setMapOffset({ 
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)), 
      y: Math.max(-maxPanY, Math.min(maxPanY, newY)) 
    });
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Zoom functions
  const zoomIn = useCallback(() => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM);
      // Calculate the center point of the current view
      const centerX = 500; // Center of 1000x1000 container
      const centerY = 500;
      
      // Calculate the current map position at the center point
      const currentMapX = centerX + mapOffset.x;
      const currentMapY = centerY + mapOffset.y;
      
      // Calculate the new offset to keep the same map point at the center
      const zoomRatio = newZoom / prevZoom;
      const newOffsetX = currentMapX * zoomRatio - centerX;
      const newOffsetY = currentMapY * zoomRatio - centerY;
      
      // Apply bounds checking
      const maxPanX = Math.max(0, (1000 * (newZoom - 1)) / 2);
      const maxPanY = Math.max(0, (1000 * (newZoom - 1)) / 2);
      
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
      const centerX = 500;
      const centerY = 500;
      
      // Calculate the current map position at the center point
      const currentMapX = centerX + mapOffset.x;
      const currentMapY = centerY + mapOffset.y;
      
      // Calculate the new offset to keep the same map point at the center
      const zoomRatio = newZoom / prevZoom;
      const newOffsetX = currentMapX * zoomRatio - centerX;
      const newOffsetY = currentMapY * zoomRatio - centerY;
      
      // Apply bounds checking
      const maxPanX = Math.max(0, (1000 * (newZoom - 1)) / 2);
      const maxPanY = Math.max(0, (1000 * (newZoom - 1)) / 2);
      
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [zoomIn, zoomOut, resetZoom]);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Don't register clicks while dragging
    if (isDragging) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
    // Get click position relative to the container
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Account for zoom and pan transformations
    // The map is scaled and translated, so we need to reverse those transformations
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    // Calculate the position on the original (untransformed) map
    // First, subtract the pan offset
    const mapX = (clickX - centerX - mapOffset.x) / zoomLevel + centerX;
    const mapY = (clickY - centerY - mapOffset.y) / zoomLevel + centerY;
    
    // Convert to 1000x1000 coordinate system
    const relativeX = mapX / containerWidth;
    const relativeY = mapY / containerHeight;
    
    const x = Math.round(relativeX * 1000);
    const y = Math.round(relativeY * 1000);
    
    // Clamp coordinates to valid range
    const clampedX = Math.max(0, Math.min(1000, x));
    const clampedY = Math.max(0, Math.min(1000, y));
    
    setClickedCoords([clampedX, clampedY]);
  };

  const saveCoordinate = () => {
    if (!clickedCoords || !currentArea) return;

    const newCoordinate: CollectedCoordinate = {
      id: currentIndex + 1,
      name: currentArea.name,
      faction: currentArea.faction,
      type: currentArea.type,
      coordinates: clickedCoords
    };

    setCollectedCoordinates(prev => {
      const updated = [...prev];
      // Update existing entry if it exists, otherwise add new one
      const existingIndex = updated.findIndex(item => item.id === newCoordinate.id);
      if (existingIndex >= 0) {
        updated[existingIndex] = newCoordinate;
      } else {
        updated.push(newCoordinate);
      }
      return updated.sort((a, b) => a.id - b.id);
    });

    setClickedCoords(null);
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex < mapAreas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToIndex = (index: number) => {
    if (index >= 0 && index < mapAreas.length) {
      setCurrentIndex(index);
    }
  };

  const downloadData = () => {
    const dataStr = JSON.stringify(collectedCoordinates, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guessed_map_areas_new.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all collected coordinates?')) {
      setCollectedCoordinates([]);
      localStorage.removeItem('guessed_map_areas_new');
    }
  };

  const progress = ((currentIndex + 1) / mapAreas.length) * 100;
  const completedCount = collectedCoordinates.length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Map Coordinate Collector</h1>
        
        {/* Progress and Stats */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Progress: {currentIndex + 1} / {mapAreas.length}</span>
            <span className="text-sm">Completed: {completedCount}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Area Info */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Current Area: {currentArea?.name}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Faction:</span> {currentArea?.faction}
            </div>
            <div>
              <span className="text-gray-400">Type:</span> {currentArea?.type}
            </div>
            <div>
              <span className="text-gray-400">Index:</span> {currentIndex + 1}
            </div>
            <div>
              <span className="text-gray-400">Original Coords:</span> ({currentArea?.coordinates[0]}, {currentArea?.coordinates[1]})
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="relative">
            <div 
              className="relative border-2 border-gray-600 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onClick={handleMapClick}
              style={{ aspectRatio: '1/1' }}
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
                <Image 
                  src="/bannerlord_clean_map.jpg" 
                  alt="Bannerlord Map" 
                  width={1920}
                  height={1080}
                  className="w-full h-full object-fill select-none"
                  draggable={false}
                />
                
                {/* Original coordinates indicator */}
                {currentArea && (
                  <div
                    className="absolute w-3 h-3 bg-blue-500 rounded-full border border-white transform -translate-x-1.5 -translate-y-1.5 pointer-events-none z-5"
                    style={{
                      left: `${(currentArea.coordinates[0] / 1000) * 100}%`,
                      top: `${(currentArea.coordinates[1] / 1000) * 100}%`
                    }}
                    title={`Original coordinates: (${currentArea.coordinates[0]}, ${currentArea.coordinates[1]})`}
                  />
                )}
                
                {/* Click indicator */}
                {clickedCoords && (
                  <div
                    className="absolute w-3 h-3 bg-red-500 rounded-full border border-white transform -translate-x-1.5 -translate-y-1.5 pointer-events-none z-10"
                    style={{
                      left: `${(clickedCoords[0] / 1000) * 100}%`,
                      top: `${(clickedCoords[1] / 1000) * 100}%`
                    }}
                  />
                )}
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              {/* Zoom In Button */}
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= MAX_ZOOM}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 border border-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-lg transition-colors shadow-lg"
                title="Zoom In"
              >
                +
              </button>
              
              {/* Zoom Level Display */}
              <div className="w-10 h-8 bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-center text-white text-xs font-medium shadow-lg">
                {Math.round(zoomLevel * 100)}%
              </div>
              
              {/* Zoom Out Button */}
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= MIN_ZOOM}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 border border-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-lg transition-colors shadow-lg"
                title="Zoom Out"
              >
                −
              </button>
              
              {/* Reset Zoom Button */}
              <button
                onClick={resetZoom}
                className="w-10 h-8 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg flex items-center justify-center text-white text-xs font-medium transition-colors shadow-lg"
                title="Reset Zoom"
              >
                ⌂
              </button>
            </div>
            
            {/* Legend */}
            <div className="mt-2 flex justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                <span>Original</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                <span>Your Click</span>
              </div>
            </div>
            
            {/* Coordinates display */}
            {clickedCoords && (
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-400">
                  Clicked coordinates: ({clickedCoords[0]}, {clickedCoords[1]})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Previous
          </button>
          
          <button
            onClick={saveCoordinate}
            disabled={!clickedCoords}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Save & Next
          </button>
          
          <button
            onClick={goToNext}
            disabled={currentIndex === mapAreas.length - 1}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Next (Skip)
          </button>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Quick Navigation</h3>
          
          {/* Range Navigation */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-gray-400 text-sm">Jump to range:</span>
            {Array.from({ length: Math.ceil(mapAreas.length / 100) }, (_, i) => {
              const start = i * 100;
              const end = Math.min(start + 99, mapAreas.length - 1);
              return (
                <button
                  key={i}
                  onClick={() => goToIndex(start)}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
                >
                  {start + 1}-{end + 1}
                </button>
              );
            })}
          </div>
          
          {/* Current Range */}
          <div className="mb-3">
            <span className="text-gray-400 text-sm">Current range: </span>
            <span className="text-white text-sm">
              {Math.floor(currentIndex / 50) * 50 + 1}-{Math.min(Math.floor(currentIndex / 50) * 50 + 50, mapAreas.length)}
            </span>
          </div>
          
          {/* Individual Navigation */}
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {Array.from({ length: 50 }, (_, i) => {
              const index = Math.floor(currentIndex / 50) * 50 + i;
              if (index >= mapAreas.length) return null;
              
              const isCompleted = collectedCoordinates.some(item => item.id === index + 1);
              return (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    currentIndex === index
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          {/* Navigation Controls */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => goToIndex(Math.max(0, Math.floor(currentIndex / 50) * 50 - 50))}
              disabled={currentIndex < 50}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white text-sm rounded transition-colors"
            >
              ← Previous 50
            </button>
            <button
              onClick={() => goToIndex(Math.min(mapAreas.length - 1, Math.floor(currentIndex / 50) * 50 + 50))}
              disabled={currentIndex >= mapAreas.length - 50}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white text-sm rounded transition-colors"
            >
              Next 50 →
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Data Management</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={downloadData}
              disabled={collectedCoordinates.length === 0}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Download JSON ({collectedCoordinates.length} entries)
            </button>
            
            <button
              onClick={clearData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Recent Entries */}
        {collectedCoordinates.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Recent Entries</h3>
            <div className="max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {collectedCoordinates.slice(-10).reverse().map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm">
                    <span>{entry.id}. {entry.name}</span>
                    <span className="text-gray-400">
                      ({entry.coordinates[0]}, {entry.coordinates[1]})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

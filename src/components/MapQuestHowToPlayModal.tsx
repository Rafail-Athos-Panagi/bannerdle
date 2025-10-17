import { useState, useEffect, memo, useCallback } from "react";
import { FaTimes, FaInfoCircle, FaTrophy, FaMapMarkerAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiVillage, GiCastle } from 'react-icons/gi';
import { PiCastleTurretFill } from 'react-icons/pi';

interface MapQuestHowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MapQuestHowToPlayModal = memo(({ isOpen, onClose }: MapQuestHowToPlayModalProps) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsAnimated(true);
      });
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimated(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = useCallback(() => {
    // Disabled overlay click to close - only allow close button click
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 pt-20"
      onClick={handleOverlayClick}
    >
      <div 
        className={`relative bg-[#2D1B0E] border-2 border-[#AF9767] rounded-lg shadow-xl max-w-4xl w-full max-h-[calc(90vh-5rem)] overflow-y-auto transform transition-all duration-300 ease-out ${
          isAnimated ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#AF9767] hover:text-yellow-400 transition-colors duration-200 z-10"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="border-b-2 border-[#AF9767] py-4 px-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <FaMapMarkerAlt className="text-[#AF9767] mr-2" size={24} />
            <h2 className="text-2xl font-bold text-[#AF9767]">Map Quest - How to Play</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Objective */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaTrophy className="mr-2" />
              Objective
            </h3>
            <p className="text-[#D4C4A8] text-base">
              Explore the vast lands of Calradia! Discover map areas by typing their names and learn about 
              different locations, factions, and settlements across the continent. Track your exploration 
              progress and become a true master of Calradia&apos;s geography.
            </p>
          </section>

          {/* How to Play */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaTrophy className="mr-2" />
              How to Play
            </h3>
            <div className="text-[#D4C4A8] space-y-2">
              <p>1. <strong className="text-[#AF9767]">Type an area name</strong> in the search box (e.g., &quot;Pravend&quot;, &quot;Sargot&quot;, &quot;Baltakhand&quot;)</p>
              <p>2. <strong className="text-[#AF9767]">Select from suggestions</strong> that appear as you type</p>
              <p>3. <strong className="text-[#AF9767]">Explore the map</strong> to see where the area is located</p>
              <p>4. <strong className="text-[#AF9767]">Learn about factions</strong> and settlement types</p>
              <p>5. <strong className="text-[#AF9767]">Track your discoveries</strong> in your exploration history</p>
            </div>
          </section>

          {/* Map Features */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaInfoCircle className="mr-2" />
              Map Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4 min-h-[200px] flex flex-col">
                <h4 className="font-bold text-[#AF9767] mb-3">Settlement Types & Icons</h4>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-[#AF9767] rounded-full">
                      <GiCastle className="text-[#1A0F08] text-sm" />
                    </div>
                    <div>
                      <p className="text-[#AF9767] font-semibold text-sm">Towns</p>
                      <p className="text-[#D4C4A8] text-xs">Major settlements with markets and governance</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-[#AF9767] rounded-full">
                      <PiCastleTurretFill className="text-[#1A0F08] text-sm" />
                    </div>
                    <div>
                      <p className="text-[#AF9767] font-semibold text-sm">Castles</p>
                      <p className="text-[#D4C4A8] text-xs">Fortified strongholds and military bases</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-[#AF9767] rounded-full">
                      <GiVillage className="text-[#1A0F08] text-sm" />
                    </div>
                    <div>
                      <p className="text-[#AF9767] font-semibold text-sm">Villages</p>
                      <p className="text-[#D4C4A8] text-xs">Small rural communities and farming settlements</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4 min-h-[200px] flex flex-col">
                <h4 className="font-bold text-[#AF9767] mb-2">Faction Territories</h4>
                <p className="text-[#D4C4A8] text-sm flex-1">
                  Learn which areas belong to which factions - from the Empire to the Khuzait Khanate.
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4 min-h-[200px] flex flex-col">
                <h4 className="font-bold text-[#AF9767] mb-2">Interactive Map</h4>
                <p className="text-[#D4C4A8] text-sm flex-1">
                  Zoom, pan, and explore the detailed map of Calradia with smooth controls.
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4 min-h-[200px] flex flex-col">
                <h4 className="font-bold text-[#AF9767] mb-2">Exploration History</h4>
                <p className="text-[#D4C4A8] text-sm flex-1">
                  Keep track of all the areas you&apos;ve discovered during your exploration journey.
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4 min-h-[200px] flex flex-col">
                <h4 className="font-bold text-[#AF9767] mb-3">Distance-Based Colors</h4>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-700"></div>
                    <p className="text-[#D4C4A8] text-xs"><strong className="text-[#AF9767]">Green:</strong> Correct guess - you found it!</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-orange-700"></div>
                    <p className="text-[#D4C4A8] text-xs"><strong className="text-[#AF9767]">Orange:</strong> Very close (within 30 units)</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-yellow-700"></div>
                    <p className="text-[#D4C4A8] text-xs"><strong className="text-[#AF9767]">Yellow:</strong> Close to moderate distance (30-150 units)</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-700"></div>
                    <p className="text-[#D4C4A8] text-xs"><strong className="text-[#AF9767]">Red:</strong> Far away (150+ units)</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4 min-h-[200px] flex flex-col">
                <h4 className="font-bold text-[#AF9767] mb-2">Search Suggestions</h4>
                <p className="text-[#D4C4A8] text-sm flex-1">
                  Smart search helps you find areas quickly with autocomplete suggestions.
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4 min-h-[200px] flex flex-col">
                <h4 className="font-bold text-[#AF9767] mb-2">Map Navigation</h4>
                <p className="text-[#D4C4A8] text-sm flex-1">
                  Use the zoom controls and pan gestures to explore every corner of Calradia's detailed map.
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4 min-h-[200px] flex flex-col">
                <h4 className="font-bold text-[#AF9767] mb-3">Interactive Markers</h4>
                <div className="space-y-2 flex-1">
                  <p className="text-[#D4C4A8] text-sm">
                    <strong className="text-[#AF9767]">Click any marker</strong> to make it larger and bring it to the front for better visibility.
                  </p>
                  <p className="text-[#D4C4A8] text-sm">
                    <strong className="text-[#AF9767]">Click again</strong> or click elsewhere on the map to deselect the marker.
                  </p>
                  <p className="text-[#D4C4A8] text-sm">
                    Perfect for comparing different settlements or examining specific areas in detail!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Calradic Trials */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaEye className="mr-2" />
              Calradic Trials
            </h3>
            <div className="space-y-4">
              {/* Arrow Visibility Toggle */}
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Arrow Visibility Toggle</h4>
                <p className="text-[#D4C4A8] mb-3">
                  Challenge yourself with the <strong className="text-[#AF9767]">Hide Arrows</strong> feature:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaEye className="text-green-400" />
                    <span className="text-[#D4C4A8]"><strong className="text-[#AF9767]">Show Arrows:</strong> Direction hints are visible on the map</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaEyeSlash className="text-red-400" />
                    <span className="text-[#D4C4A8]"><strong className="text-[#AF9767]">Hide Arrows:</strong> No direction hints - pure exploration challenge!</span>
                  </div>
                </div>
                <p className="text-[#B8A082] text-sm mt-3">
                  When arrows are hidden, you&apos;ll need to rely purely on your knowledge of Calradia&apos;s geography 
                  and settlement names to explore effectively. Perfect for experienced players seeking a greater challenge!
                </p>
              </div>

              {/* Settlement Type Hint */}
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Settlement Type Hint</h4>
                <p className="text-[#D4C4A8] mb-3">
                  Master the art of settlement recognition with the <strong className="text-[#AF9767]">Settlement Type Hint</strong> feature:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaEye className="text-green-400" />
                    <span className="text-[#D4C4A8]"><strong className="text-[#AF9767]">Show Settlement Type Hint:</strong> Icons reveal settlement type correctness</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaEyeSlash className="text-red-400" />
                    <span className="text-[#D4C4A8]"><strong className="text-[#AF9767]">Hide Settlement Type Hint:</strong> All icons use uniform theme colors</span>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-[#B8A082] text-sm">
                    <strong className="text-[#AF9767]">When enabled:</strong> Icons show green for correct settlement type, red for wrong type.
                  </p>
                  <p className="text-[#B8A082] text-sm">
                    <strong className="text-[#AF9767]">When disabled:</strong> All settlement icons use the same Bannerlord theme color for a clean, immersive experience.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Map Controls */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaInfoCircle className="mr-2" />
              Map Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Zoom Controls</h4>
                <div className="space-y-1 text-[#D4C4A8] text-sm">
                  <p>• <strong className="text-[#AF9767]">+ Button:</strong> Zoom in for detailed view</p>
                  <p>• <strong className="text-[#AF9767]">- Button:</strong> Zoom out for overview</p>
                  <p>• <strong className="text-[#AF9767]">⌂ Button:</strong> Reset to default zoom</p>
                  <p>• <strong className="text-[#AF9767]">Mouse Wheel:</strong> Scroll to zoom</p>
                </div>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Navigation</h4>
                <div className="space-y-1 text-[#D4C4A8] text-sm">
                  <p>• <strong className="text-[#AF9767]">Click & Drag:</strong> Pan around the map</p>
                  <p>• <strong className="text-[#AF9767]">Touch:</strong> Mobile-friendly touch controls</p>
                  <p>• <strong className="text-[#AF9767]">Keyboard:</strong> Arrow keys for navigation</p>
                  <p>• <strong className="text-[#AF9767]">Ctrl + Plus/Minus:</strong> Keyboard zoom</p>
                </div>
              </div>
            </div>
          </section>

          {/* Exploration Tips */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaTrophy className="mr-2" />
              Exploration Tips
            </h3>
            <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-[#AF9767] mb-1">Start with Major Cities</h4>
                  <p className="text-[#D4C4A8] text-sm">
                    Begin your exploration with well-known towns like Pravend, Sargot, or Baltakhand to get familiar with the map layout.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[#AF9767] mb-1">Explore by Faction</h4>
                  <p className="text-[#D4C4A8] text-sm">
                    Try exploring all settlements belonging to one faction (e.g., all Empire towns) to understand territorial boundaries.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[#AF9767] mb-1">Use Settlement Types</h4>
                  <p className="text-[#D4C4A8] text-sm">
                    Search for different settlement types - discover all Towns, then all Castles, then all Villages to see the variety.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[#AF9767] mb-1">Challenge Yourself</h4>
                  <p className="text-[#D4C4A8] text-sm">
                    Once comfortable, try the &quot;Hide Arrows&quot; feature for a pure exploration challenge without directional hints.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Example Section */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaTrophy className="mr-2" />
              Example Exploration
            </h3>
            <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
              <p className="text-[#D4C4A8] mb-4">
                Here&apos;s how a typical exploration session might work:
              </p>
              
              <div className="space-y-4">
                <div className="p-3 bg-[#2D1B0E] border border-[#AF9767] rounded">
                  <h4 className="font-bold text-[#AF9767] mb-2">Step 1: Search for an Area</h4>
                  <p className="text-[#D4C4A8] text-sm">
                    Type &quot;Pravend&quot; in the search box. The system will show suggestions and you can select it to explore.
                  </p>
                </div>
                
                <div className="p-3 bg-[#2D1B0E] border border-[#AF9767] rounded">
                  <h4 className="font-bold text-[#AF9767] mb-2">Step 2: Discover on Map</h4>
                  <p className="text-[#D4C4A8] text-sm">
                    Pravend appears on the map with a marker showing it&apos;s a Town in the Kingdom of Vlandia faction.
                  </p>
                </div>
                
                <div className="p-3 bg-[#2D1B0E] border border-[#AF9767] rounded">
                  <h4 className="font-bold text-[#AF9767] mb-2">Step 3: Continue Exploring</h4>
                  <p className="text-[#D4C4A8] text-sm">
                    Search for nearby areas like &quot;Sargot&quot; or &quot;Charas&quot; to build your knowledge of Vlandian territories.
                  </p>
                </div>
                
                <div className="p-3 bg-[#2D1B0E] border border-[#AF9767] rounded">
                  <h4 className="font-bold text-[#AF9767] mb-2">Step 4: Track Progress</h4>
                  <p className="text-[#D4C4A8] text-sm">
                    All discovered areas remain visible on the map, creating your personal exploration history of Calradia.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#AF9767] py-4 px-6 text-center">
          <p className="text-[#8B6F47] text-sm">
            Happy exploring, traveler! May your journey across Calradia be filled with discovery and wonder!
          </p>
        </div>
      </div>
    </div>
  );
});

MapQuestHowToPlayModal.displayName = 'MapQuestHowToPlayModal';

export default MapQuestHowToPlayModal;

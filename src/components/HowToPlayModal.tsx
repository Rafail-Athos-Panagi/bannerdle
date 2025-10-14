import { useState, useEffect, memo, useCallback } from "react";
import { FaTimes, FaInfoCircle, FaTrophy } from "react-icons/fa";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToPlayModal = memo(({ isOpen, onClose }: HowToPlayModalProps) => {
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
    // if (e.target === e.currentTarget) {
    //   onClose();
    // }
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
            <FaInfoCircle className="text-[#AF9767] mr-2" size={24} />
            <h2 className="text-2xl font-bold text-[#AF9767]">How to Play</h2>
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
              Guess today&apos;s Bannerlord troop! Each day, a new troop is selected. Use the hints provided 
              by your incorrect guesses to narrow down the possibilities and find the correct troop.
            </p>
          </section>

          {/* How to Play */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaTrophy className="mr-2" />
              How to Play
            </h3>
            <div className="text-[#D4C4A8] space-y-2">
              <p>1. <strong className="text-[#AF9767]">Type a troop name</strong> in the search box</p>
              <p>2. <strong className="text-[#AF9767]">Select a troop</strong> from the dropdown</p>
              <p>3. <strong className="text-[#AF9767]">Check the indicators</strong> to see how close you are</p>
              <p>4. <strong className="text-[#AF9767]">Use the hints</strong> to make your next guess</p>
              <p>5. <strong className="text-[#AF9767]">Keep guessing</strong> until you find the correct troop!</p>
            </div>
          </section>

          {/* Troop Attributes */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaInfoCircle className="mr-2" />
              Troop Attributes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Tier</h4>
                <p className="text-[#D4C4A8] text-sm">
                  The troop&apos;s level/rank (1-6). Higher tiers are more powerful and expensive.
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Type</h4>
                <p className="text-[#D4C4A8] text-sm">
                  The troop&apos;s combat role (Infantry, Archer, Cavalry, etc.)
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Occupation</h4>
                <p className="text-[#D4C4A8] text-sm">
                  The troop&apos;s profession or role in society (Soldier, Guard, Noble, etc.)
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Banner</h4>
                <p className="text-[#D4C4A8] text-sm">
                  The visual banner/flag associated with the troop&apos;s faction
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Culture</h4>
                <p className="text-[#D4C4A8] text-sm">
                  The cultural group the troop belongs to (Empire, Sturgia, Khuzait, etc.)
                </p>
              </div>
              <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
                <h4 className="font-bold text-[#AF9767] mb-2">Faction</h4>
                <p className="text-[#D4C4A8] text-sm">
                  The specific faction or kingdom the troop serves (Northern Empire, Kingdom of Vlandia, etc.)
                </p>
              </div>
            </div>
          </section>

          {/* Status Indicators */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaInfoCircle className="mr-2" />
              Status Indicators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-800 border-2 border-amber-900 rounded-lg p-3 text-center">
                <div className="w-12 h-12 bg-green-800 border-2 border-amber-900 rounded mx-auto mb-2"></div>
                <h4 className="font-bold text-white">True</h4>
                <p className="text-white text-sm">This attribute matches exactly!</p>
              </div>
              <div className="bg-amber-600 border-2 border-amber-900 rounded-lg p-3 text-center">
                <div className="w-12 h-12 bg-amber-600 border-2 border-amber-900 rounded mx-auto mb-2"></div>
                <h4 className="font-bold text-white">Partial</h4>
                <p className="text-white text-sm">This attribute is partially correct</p>
              </div>
              <div className="bg-red-800 border-2 border-amber-900 rounded-lg p-3 text-center">
                <div className="w-12 h-12 bg-red-800 border-2 border-amber-900 rounded mx-auto mb-2"></div>
                <h4 className="font-bold text-white">False</h4>
                <p className="text-white text-sm">This attribute is incorrect</p>
              </div>
              <div className="bg-[#292929] border-2 border-amber-900 rounded-lg p-3 text-center">
                <div className="w-12 h-12 bg-[#292929] border-2 border-amber-900 rounded mx-auto mb-2 flex items-center justify-center">
                  <img
                    src="/sword4.png"
                    alt="Sword"
                    className="w-8 h-10 rotate-180"
                  />
                </div>
                <h4 className="font-bold text-amber-900">Higher Tier</h4>
                <p className="text-gray-300 text-sm">The correct troop has a higher tier</p>
              </div>
              <div className="bg-[#292929] border-2 border-amber-900 rounded-lg p-3 text-center">
                <div className="w-12 h-12 bg-[#292929] border-2 border-amber-900 rounded mx-auto mb-2 flex items-center justify-center">
                  <img
                    src="/sword4.png"
                    alt="Sword"
                    className="w-8 h-10"
                  />
                </div>
                <h4 className="font-bold text-amber-900">Lower Tier</h4>
                <p className="text-gray-300 text-sm">The correct troop has a lower tier</p>
              </div>
              <div className="bg-[#292929] border-2 border-amber-900 rounded-lg p-3 text-center">
                <div className="w-12 h-12 bg-[#292929] border-2 border-amber-900 rounded mx-auto mb-2 flex items-center justify-center">
                  <img
                    src="/sword_same1.png"
                    alt="Sword"
                    className="w-10 h-10"
                  />
                </div>
                <h4 className="font-bold text-amber-900">Same Tier</h4>
                <p className="text-gray-300 text-sm">The correct troop has the same tier</p>
              </div>
            </div>
          </section>

          {/* Example Section */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaTrophy className="mr-2" />
              Example
            </h3>
            <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
              <p className="text-[#D4C4A8] mb-4">
                Here&apos;s an example showing an <strong className="text-[#AF9767]">&quot;Aserai Archer&quot;</strong> troop with its indicators:
              </p>
              
              {/* Example Image */}
              <div className="mb-6 flex justify-center">
                <img 
                  src="/example.png" 
                  alt="Example of troop indicators" 
                  className="w-auto h-auto max-w-full rounded-lg border-2 border-[#AF9767] shadow-lg"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="font-bold text-[#AF9767]">Culture:</span>
                  <span className="text-[#D4C4A8] ml-2">RED - Aserai (incorrect)</span>
                  <p className="text-[#B8A082] text-sm mt-1 ml-4">
                    The correct troop is NOT from Aserai culture. Look for troops from other cultures like Empire, Sturgia, Khuzait, Vlandia, or Battania.
                  </p>
                </div>
                
                <div>
                  <span className="font-bold text-[#AF9767]">Faction:</span>
                  <span className="text-[#D4C4A8] ml-2">RED - Aserai Sultanate (incorrect)</span>
                  <p className="text-[#B8A082] text-sm mt-1 ml-4">
                    The correct troop is NOT from Aserai Sultanate faction. Try troops from other factions like Northern Empire, Kingdom of Vlandia, etc.
                  </p>
                </div>
                
                <div>
                  <span className="font-bold text-[#AF9767]">Type:</span>
                  <span className="text-[#D4C4A8] ml-2">RED - Archer (incorrect)</span>
                  <p className="text-[#B8A082] text-sm mt-1 ml-4">
                    The correct troop is NOT an Archer. Look for other troop types like Infantry, Cavalry, or Crossbowman.
                  </p>
                </div>
                
                <div>
                  <span className="font-bold text-[#AF9767]">Tier:</span>
                  <span className="text-[#D4C4A8] ml-2">RED - Tier 4 (incorrect) - Sword points up</span>
                  <p className="text-[#B8A082] text-sm mt-1 ml-4">
                    The correct troop has a HIGHER tier than 4. Look for tier 5 or tier 6 troops. The upward-pointing sword indicates &quot;higher tier&quot;.
                  </p>
                </div>
                
                <div>
                  <span className="font-bold text-[#AF9767]">Occupation:</span>
                  <span className="text-[#D4C4A8] ml-2">GREEN - Soldier (correct!)</span>
                  <p className="text-[#B8A082] text-sm mt-1 ml-4">
                    ✅ The correct troop DOES have &quot;Soldier&quot; occupation. Focus on troops with this occupation but different culture, faction, type, and higher tier.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-[#2D1B0E] border border-[#AF9767] rounded">
                <p className="text-[#D4C4A8] text-sm">
                  <strong className="text-[#AF9767]">Strategy Summary:</strong> This example shows how to interpret indicators. 
                  You guessed &quot;Aserai Archer&quot; but the correct troop is NOT Aserai, NOT an Archer, and has a HIGHER tier than 4. 
                  However, it DOES have &quot;Soldier&quot; occupation. So your next guess should be a tier 5-6 troop with &quot;Soldier&quot; occupation 
                  from a different culture (like Empire, Sturgia, Khuzait, Vlandia, or Battania) and different type (Infantry, Cavalry, or Crossbowman).
                </p>
              </div>
              
              {/* Winning Condition Example */}
              <div className="mt-6">
                <h4 className="text-lg font-bold text-[#AF9767] mb-3">Winning Condition</h4>
                <p className="text-[#D4C4A8] mb-4">
                  When you guess the correct troop, you&apos;ll see the victory screen:
                </p>
                
                <div className="flex justify-center mb-4">
                  <img 
                    src="/example_win.png" 
                    alt="Winning condition example" 
                    className="w-auto h-auto max-w-full rounded-lg border-2 border-[#AF9767] shadow-lg"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                </div>
                
                <div className="p-3 bg-gradient-to-r from-[#AF9767] to-[#8B6F47] rounded-lg">
                  <p className="text-black font-bold text-center">
                    🏆 Victory! You&apos;ve successfully guessed today&apos;s troop and conquered Calradia!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#AF9767] py-4 px-6 text-center">
          <p className="text-[#8B6F47] text-sm">
            Good luck, warrior! May your guesses be true and your victory swift!
          </p>
        </div>
      </div>
    </div>
  );
});

HowToPlayModal.displayName = 'HowToPlayModal';

export default HowToPlayModal;

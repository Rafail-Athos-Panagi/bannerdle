import { useEffect, useState, useRef } from "react";
import { FaFlag, FaMapMarkerAlt } from "react-icons/fa";
import { GiCastle, GiVillage } from "react-icons/gi";
import { PiCastleTurretFill } from "react-icons/pi";
import { MapGuess } from "@/services/MapAreaService";
import Countdown from "./Countdown";
import DonationPopup from "./DonationPopup";
import { CONFIG } from "@/config";

interface Props {
  correctGuess: MapGuess;
}

const MapVictoryBanner = ({ correctGuess }: Props) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to victory banner when it appears
  useEffect(() => {
    if (bannerRef.current) {
      const scrollTimer = setTimeout(() => {
        bannerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 800); // Wait for animation to start

      return () => clearTimeout(scrollTimer);
    }
  }, [correctGuess]);

  useEffect(() => {
    // Show donation popup after victory banner animation completes
    const donationTimer = setTimeout(() => {
      setShowDonationPopup(true);
    }, CONFIG.DONATION_POPUP_DELAY);

    return () => clearTimeout(donationTimer);
  }, []);

  // Get settlement type icon
  const getSettlementTypeIcon = () => {
    switch (correctGuess.mapArea.type) {
      case 'Town':
        return <GiCastle className="text-2xl md:text-3xl" />;
      case 'Castle':
        return <PiCastleTurretFill className="text-2xl md:text-3xl" />;
      case 'Village':
        return <GiVillage className="text-2xl md:text-3xl" />;
      default:
        return <FaMapMarkerAlt className="text-2xl md:text-3xl" />;
    }
  };

  return (
    <>
      <div
        ref={bannerRef}
        className={`relative w-full mx-auto mt-4 flex justify-center items-center bg-gradient-to-br from-[var(--bannerlord-custom-dark-brown)] to-[var(--bannerlord-patch-deep-bg)] border-2 border-[var(--bannerlord-patch-brassy-gold)] rounded-lg shadow-lg transition-all duration-700 ease-out transform ${
          isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="w-full bg-black/60 backdrop-blur-sm rounded-xl p-3 md:p-4">
          <div className="relative border-b-2 border-[var(--bannerlord-patch-brassy-gold)] py-3 md:py-4 text-center">
            <h1 className="text-xl md:text-2xl font-bold text-[var(--bannerlord-patch-brassy-gold)]">VICTORY</h1>
            <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--bannerlord-patch-brassy-gold)] to-transparent"></div>
          </div>

          <div className="p-3 md:p-6 flex flex-col items-center justify-center text-center">
            <div
              className={`relative mb-4 transition-all duration-700 ease-out transform ${
                isAnimated
                  ? "opacity-100 translate-y-0 delay-300"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div 
                className="w-20 h-20 md:w-24 md:h-24 border-4 border-[var(--bannerlord-patch-brassy-gold)] rounded-md overflow-hidden flex items-center justify-center"
                style={{ 
                  backgroundImage: `url(/Factions/${correctGuess.mapArea.faction.replace(/\s+/g, '_')}.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
              </div>
            </div>

            <div
              className={`flex-1 transition-all duration-700 ease-out transform ${
                isAnimated
                  ? "opacity-100 translate-y-0 delay-500"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-lg md:text-xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-2">
                {correctGuess.mapArea.name}
              </h2>
              
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex items-center justify-center space-x-2">
                  <FaFlag className="text-[var(--bannerlord-patch-gold-text)]" />
                  <span className="text-[var(--bannerlord-custom-light-cream)]">
                    <strong>Faction:</strong> {correctGuess.mapArea.faction}
                  </span>
                </div>
                
                {correctGuess.mapArea.coordinates && (
                  <div className="flex items-center justify-center space-x-2">
                    <FaMapMarkerAlt className="text-[var(--bannerlord-patch-gold-text)]" />
                    <span className="text-[var(--bannerlord-custom-light-cream)]">
                      <strong>Coordinates:</strong> ({correctGuess.mapArea.coordinates[0]}, {correctGuess.mapArea.coordinates[1]})
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-center space-x-2">
                  {getSettlementTypeIcon()}
                  <span className="text-[var(--bannerlord-custom-light-cream)]">
                    <strong>Map Area Type:</strong> {correctGuess.mapArea.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown to next game */}
          <div
            className={`text-center mt-4 transition-all duration-700 ease-out transform ${
              isAnimated
                ? "opacity-100 translate-y-0 delay-700"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Countdown />
          </div>
        </div>
      </div>

      {/* Donation Popup */}
      {showDonationPopup && (
        <DonationPopup 
          isOpen={showDonationPopup} 
          onClose={() => setShowDonationPopup(false)} 
        />
      )}
    </>
  );
};

export default MapVictoryBanner;

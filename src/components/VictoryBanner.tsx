import { useEffect, useState } from "react";
import { FaUser, FaFlag } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { MdCastle } from "react-icons/md";
import Image from "next/image";
import { Troop } from "@/types/Troop.type";
import Countdown from "./Countdown";
import DonationPopup from "./DonationPopup";
import { CONFIG } from "@/config";

interface Props {
  correctGuess: Troop;
}

const VictoryBanner = ({ correctGuess }: Props) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [showDonationPopup, setShowDonationPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show donation popup after victory banner animation completes
    const donationTimer = setTimeout(() => {
      setShowDonationPopup(true);
    }, CONFIG.DONATION_POPUP_DELAY);

    return () => clearTimeout(donationTimer);
  }, []);

  return (
    <>
      <div
        className={`relative w-full max-w-4xl mx-auto mt-10 flex justify-center items-center bg-cover bg-center border-2 border-yellow-700 rounded-lg shadow-lg transition-all duration-700 ease-out transform ${
          isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ backgroundImage: `url(/${correctGuess.banner})` }}
      >
        <div className="w-full bg-black/60 backdrop-blur-sm rounded-xl p-3 md:p-4">
          <div className="relative border-b-2 border-yellow-700 py-3 md:py-4 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-yellow-400">VICTORY</h1>
            <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          </div>

          <div className="p-4 md:p-12 flex flex-col md:flex-row items-center justify-center text-center">
            <div
              className={`relative mb-6 md:mb-0 md:mr-6 transition-all duration-700 ease-out transform ${
                isAnimated
                  ? "opacity-100 translate-y-0 delay-300"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-yellow-700 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-700 opacity-10"></div>
                <Image
                  src={correctGuess.image}
                  alt="Desert Bandit Boss"
                  width={96}
                  height={96}
                  className="w-18 h-18 md:w-24 md:h-24"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-yellow-600 text-black text-xs font-bold px-1 py-0.5 md:px-2 md:py-1 rounded-full border border-black">
                TIER {correctGuess.tier}
              </div>
            </div>
            <div
              className={`transition-all duration-700 ease-out transform ${
                isAnimated
                  ? "opacity-100 translate-y-0 delay-500"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-xl md:text-2xl text-yellow-500 font-bold mb-3 md:mb-4 text-center md:text-left">
                {correctGuess.name}
              </h2>
              <div className="space-y-3 md:space-y-4 text-center md:text-left">
                <div className={`flex items-center justify-center md:justify-start transition-all duration-800 ease-out transform ${
                  isAnimated ? "opacity-100 translate-x-0 delay-1000" : "opacity-0 -translate-x-4"
                }`}>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-900 flex items-center justify-center mr-2 md:mr-3">
                    <LuSwords className="text-yellow-400" size={14} />
                  </div>
                  <span className="text-yellow-200 text-sm md:text-base min-w-0 flex-shrink-0">TYPE:</span>
                  <span className="text-gray-300 text-sm md:text-base ml-1">{correctGuess.type}</span>
                </div>
                <div className={`flex items-center justify-center md:justify-start transition-all duration-800 ease-out transform ${
                  isAnimated ? "opacity-100 translate-x-0 delay-1400" : "opacity-0 -translate-x-4"
                }`}>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-900 flex items-center justify-center mr-2 md:mr-3">
                    <FaUser className="text-yellow-400" size={12} />
                  </div>
                  <span className="text-yellow-200 text-sm md:text-base min-w-0 flex-shrink-0">OCCUPATION:</span>
                  <span className="text-gray-300 text-sm md:text-base ml-1">
                    {correctGuess.occupation}
                  </span>
                </div>
                <div className={`flex items-center justify-center md:justify-start transition-all duration-800 ease-out transform ${
                  isAnimated ? "opacity-100 translate-x-0 delay-1800" : "opacity-0 -translate-x-4"
                }`}>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-900 flex items-center justify-center mr-2 md:mr-3">
                    <MdCastle className="text-yellow-400" size={14} />
                  </div>
                  <span className="text-yellow-200 text-sm md:text-base min-w-0 flex-shrink-0">FACTION:</span>
                  <span className="text-gray-300 text-sm md:text-base ml-1">{correctGuess.faction}</span>
                </div>
                <div className={`flex items-center justify-center md:justify-start transition-all duration-800 ease-out transform ${
                  isAnimated ? "opacity-100 translate-x-0 delay-2200" : "opacity-0 -translate-x-4"
                }`}>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-900 flex items-center justify-center mr-2 md:mr-3">
                    <FaFlag className="text-yellow-400" size={12} />
                  </div>
                  <span className="text-yellow-200 text-sm md:text-base min-w-0 flex-shrink-0">CULTURE:</span>
                  <span className="text-gray-300 text-sm md:text-base ml-1">{correctGuess.culture}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`relative h-1 bg-yellow-900 transition-all duration-1000 ease-out transform ${
              isAnimated
                ? "opacity-100 translate-y-0 delay-2600"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-900 border-2 border-yellow-400 flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          <div
            className={`py-2 px-3 md:py-3 md:px-4 bg-yellow-700 text-center transition-all duration-1000 ease-out transform ${
              isAnimated
                ? "opacity-100 translate-y-0 delay-3000"
                : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-black font-semibold text-sm md:text-base">
              The battle is won! Glory awaits in Calradia
            </p>
          </div>
          
          <div
            className={`py-3 px-4 md:py-4 md:px-6 bg-gradient-to-r from-yellow-700 to-yellow-800 border-2 border-yellow-500 text-center transition-all duration-1000 ease-out transform ${
              isAnimated
                ? "opacity-100 translate-y-0 delay-3400"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-yellow-100 font-bold text-base md:text-lg mb-2">
              Upcoming Features & Content Games
            </h3>
            <p className="text-yellow-200 text-sm md:text-base">
              New challenges and adventures await! Stay tuned for exciting updates.
            </p>
          </div>
        </div>
      </div>
      <Countdown />
      <DonationPopup 
        isOpen={showDonationPopup} 
        onClose={() => setShowDonationPopup(false)}
        donationUrl={CONFIG.DONATION_URL}
      />
    </>
  );
};

export default VictoryBanner;

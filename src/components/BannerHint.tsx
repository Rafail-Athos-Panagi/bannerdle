import { FaInfoCircle } from "react-icons/fa";
import { IoIosHelpCircle } from "react-icons/io";
import { useState } from "react";
import Tooltip from "./Tooltip";
import HowToPlayModal from "./HowToPlayModal";
import AboutModal from "./AboutModal";
import { CONFIG } from "@/config";

interface BannerHintProps {
  scrollTo: (direction: string) => void;
}

const BannerHint = ({ scrollTo }: BannerHintProps) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="relative inline-block w-full max-w-sm mt-10 md:mt-10">
      <svg
        className="absolute top-[-13px] left-0 w-full h-5.5"
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
      >
        <rect
          x="0"
          y="13"
          width="400"
          height="22"
          fill="var(--bannerlord-patch-brassy-gold)"
        />

        {[0, 90, 180, 270, 360].map((x, index) => (
          <rect
            key={index}
            x={x}
            y="0"
            width="40"
            height="13"
            fill="var(--bannerlord-menu-brownish-gray)"
          />
        ))}
      </svg>
      <div className="bg-[var(--bannerlord-party-dark-bg)] p-2 sm:p-2.5 border-l-2 border-r-2  border-[var(--bannerlord-patch-warm-tan)] shadow-2xl rounded-lg relative  mt-1">
        <div className="flex flex-col items-center">
          <img
            src="/logo_new.png"
            alt="logo_image"
            className="text-center w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 cursor-pointer z-10 transform transition duration-200 hover:scale-110 filter hover:brightness-125"
          />

          {/* <p className="text-sm text-[var(--bannerlord-party-text-cream)] text-center italic">
            Let it be known across the lands, reinforcements are coming...
          </p> */}
          <div className="flex flex-row space-x-1.5 sm:space-x-2.5 md:space-x-3.5 justify-center">
            <Tooltip 
              content="How to Play - Learn the rules and strategies" 
              position="bottom"
              delay={300}
            >
              <IoIosHelpCircle
                onClick={() => setShowHowToPlay(true)}
                className="hover:bg-gray-700 hover:text-yellow-500 bg-[#39352D] border-2 border-yellow-700 rounded text-yellow-600 font-serif text-sm transition-colors duration-200 focus:outline-none shadow-lg cursor-pointer opacity-100"
                size={window.innerWidth < 768 ? 32 : window.innerWidth < 1024 ? 40 : 48}
                style={{ padding: window.innerWidth < 768 ? "5px" : window.innerWidth < 1024 ? "7px" : "9px" }}
              />
            </Tooltip>
            
            <Tooltip 
              content="About Bannerdle - Game information and credits" 
              position="bottom"
              delay={300}
            >
              <FaInfoCircle
                onClick={() => setShowAbout(true)}
                className="hover:bg-gray-700 hover:text-yellow-500 bg-[#39352D] border-2 border-yellow-700 rounded text-yellow-600 font-serif text-sm transition-colors duration-200 focus:outline-none shadow-lg cursor-pointer opacity-100"
                size={window.innerWidth < 768 ? 32 : window.innerWidth < 1024 ? 40 : 48}
                style={{ padding: window.innerWidth < 768 ? "5px" : window.innerWidth < 1024 ? "7px" : "9px" }}
              />
            </Tooltip>
            
            <Tooltip 
              content="Support Development - Buy me a coffee!" 
              position="bottom"
              delay={300}
            >
              <div
                onClick={() => window.open(CONFIG.DONATION_URL, '_blank', 'noopener,noreferrer')}
                className="hover:bg-gray-700 bg-[#39352D] border-2 border-yellow-700 rounded transition-colors duration-200 focus:outline-none shadow-lg cursor-pointer opacity-100 flex items-center justify-center"
                style={{ 
                  padding: window.innerWidth < 768 ? "5px" : window.innerWidth < 1024 ? "7px" : "9px", 
                  width: window.innerWidth < 768 ? "32px" : window.innerWidth < 1024 ? "40px" : "48px", 
                  height: window.innerWidth < 768 ? "32px" : window.innerWidth < 1024 ? "40px" : "48px" 
                }}
              >
                <img 
                  src="/kofi_symbol.png" 
                  alt="Ko-Fi" 
                  className="w-5 h-5"
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      
      <HowToPlayModal 
        isOpen={showHowToPlay} 
        onClose={() => setShowHowToPlay(false)}
      />
      
      <AboutModal 
        isOpen={showAbout} 
        onClose={() => setShowAbout(false)}
      />
    </div>
  );
};

export default BannerHint;

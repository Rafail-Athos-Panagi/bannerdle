import { FaInfoCircle } from "react-icons/fa";
import { IoIosHelpCircle } from "react-icons/io";
import { useState } from "react";
import Tooltip from "./Tooltip";
import HowToPlayModal from "./HowToPlayModal";
import { CONFIG } from "@/config";

interface BannerHintProps {
  scrollTo: (direction: string) => void;
  setShowIndicatorApp: (show: boolean) => void;
}

const BannerHint = ({ scrollTo, setShowIndicatorApp }: BannerHintProps) => {
  const [showIndicator, setShowIndicator] = useState(
    localStorage.getItem("showIndicator") === "false" ? false : true
  );
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const toggleIndicator = (show: boolean) => {
    setShowIndicatorApp(!show);
    setShowIndicator(!show);
    localStorage.setItem("showIndicator", (!show).toString());
    scrollTo("bottom");
  };

  return (
    <div className="relative inline-block w-full max-w-md mt-4 md:mt-10">
      <svg
        className="absolute top-[-20px] left-0 w-full h-8"
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
      >
        <rect
          x="0"
          y="20"
          width="400"
          height="30"
          fill="var(--bannerlord-patch-brassy-gold)"
        />

        {[0, 90, 180, 270, 360].map((x, index) => (
          <rect
            key={index}
            x={x}
            y="0"
            width="40"
            height="20"
            fill="var(--bannerlord-menu-brownish-gray)"
          />
        ))}
      </svg>
      <div className="bg-[var(--bannerlord-party-dark-bg)] p-4 border-l-2 border-r-2  border-[var(--bannerlord-patch-warm-tan)] shadow-2xl rounded-lg relative  mt-2">
        <div className="flex flex-col items-center">
          <img
            src="/logo2.png"
            alt="logo_image"
            className="text-center w-50 h-50 cursor-pointer z-10 transform transition duration-200 hover:scale-110 filter hover:brightness-125"
          />

          {/* <p className="text-sm text-[var(--bannerlord-party-text-cream)] text-center italic">
            Let it be known across the lands, reinforcements are coming...
          </p> */}
          <div className="flex flex-row space-x-4 md:space-x-5 justify-center">
            <Tooltip 
              content={showIndicator ? "Hide status indicators" : "Show status indicators"} 
              position="bottom"
              delay={300}
            >
              <FaInfoCircle
                onClick={() => toggleIndicator(showIndicator)}
                className={`hover:bg-gray-700 hover:text-yellow-500 bg-[#39352D] border-2 border-yellow-700 rounded text-yellow-600 font-serif text-lg transition-colors duration-200 focus:outline-none shadow-lg cursor-pointer ${
                  showIndicator ? "opacity-100" : "opacity-30"
                }`}
                size={window.innerWidth < 768 ? 50 : 60}
                style={{ padding: window.innerWidth < 768 ? "8px" : "10px" }}
              />
            </Tooltip>
            
            <Tooltip 
              content="How to Play - Learn the rules and strategies" 
              position="bottom"
              delay={300}
            >
              <IoIosHelpCircle
                onClick={() => setShowHowToPlay(true)}
                className="hover:bg-gray-700 hover:text-yellow-500 bg-[#39352D] border-2 border-yellow-700 rounded text-yellow-600 font-serif text-lg transition-colors duration-200 focus:outline-none shadow-lg cursor-pointer opacity-100"
                size={window.innerWidth < 768 ? 50 : 60}
                style={{ padding: window.innerWidth < 768 ? "8px" : "10px" }}
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
                  padding: window.innerWidth < 768 ? "8px" : "10px", 
                  width: window.innerWidth < 768 ? "50px" : "60px", 
                  height: window.innerWidth < 768 ? "50px" : "60px" 
                }}
              >
                <img 
                  src="/kofi_symbol.png" 
                  alt="Ko-Fi" 
                  className="w-8 h-8"
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
    </div>
  );
};

export default BannerHint;

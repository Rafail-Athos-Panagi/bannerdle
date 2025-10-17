import { useState, useEffect, memo, useCallback } from "react";
import { FaTimes, FaInfoCircle, FaHeart, FaExternalLinkAlt, FaCoffee, FaGamepad } from "react-icons/fa";
import { CONFIG } from "@/config";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = memo(({ isOpen, onClose }: AboutModalProps) => {
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

  const handleEmailClick = useCallback(() => {
    window.location.href = '/contact';
  }, []);

  const handleDonationClick = useCallback(() => {
    window.open(CONFIG.DONATION_URL, '_blank', 'noopener,noreferrer');
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
            <h2 className="text-2xl font-bold text-[#AF9767]">About Bannerdle</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Game Description */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaGamepad className="mr-2" />
              Game Description
            </h3>
            <p className="text-[#D4C4A8] text-base">
              Every day, guess a different troop from Mount & Blade II: Bannerlord. Test your knowledge of Calradia&apos;s 
              warriors, factions, and military units in this strategic guessing game inspired by the medieval world of Bannerlord.
            </p>
          </section>

          {/* Legal Disclaimer */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaInfoCircle className="mr-2" />
              Legal Disclaimer
            </h3>
            <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
              <p className="text-[#D4C4A8] text-sm mb-3">
                Bannerdle was created in accordance with TaleWorlds Entertainment&apos;s Legal Fan Creations policy using 
                assets that belong to TaleWorlds Entertainment. TaleWorlds Entertainment does not endorse or sponsor this project.
              </p>
            </div>
          </section>

          {/* Inspiration */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaHeart className="mr-2" />
              Inspired By
            </h3>
            <p className="text-[#D4C4A8] text-base mb-3">
              This game was inspired by these wonderful games:
            </p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
               {[
                 { name: 'Wordle', url: 'https://www.nytimes.com/games/wordle/index.html' },
                 { name: 'Loldle', url: 'https://loldle.net/' },
                 { name: 'Globle', url: 'https://globle-game.com/' }
               ].map((game, index) => (
                 <div key={index} className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-3 text-center">
                   <a 
                     href={game.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-[#AF9767] hover:text-yellow-400 font-semibold underline transition-colors duration-200"
                   >
                     {game.name}
                   </a>
                 </div>
               ))}
             </div>
          </section>

          {/* Background Image Credit */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaExternalLinkAlt className="mr-2" />
              Credits
            </h3>
             <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
               <p className="text-[#D4C4A8] text-sm mb-2">
                 <strong className="text-[#AF9767]">Background Image:</strong> Generated using ChatGPT image generation
               </p>
               <p className="text-[#D4C4A8] text-sm mb-2">
                 <strong className="text-[#AF9767]">Game Assets:</strong> Mount & Blade II: Bannerlord official artwork and data from <a href="https://mountandblade.fandom.com/" target="_blank" rel="noopener noreferrer" className="text-[#AF9767] hover:text-yellow-400 underline">Mount & Blade Wiki</a> and <a href="https://mountandblade2bannerlord.wiki.fextralife.com/" target="_blank" rel="noopener noreferrer" className="text-[#AF9767] hover:text-yellow-400 underline">Fextralife Wiki</a>
               </p>
               <p className="text-[#D4C4A8] text-sm">
                 <strong className="text-[#AF9767]">Calradia Map:</strong> <a href="https://mountandblade2bannerlord.wiki.fextralife.com/file/Mount-and-Blade-2-Bannerlord/calradia-1084-bannerlord-wiki-guide.png?v=1586826894378" target="_blank" rel="noopener noreferrer" className="text-[#AF9767] hover:text-yellow-400 underline">Fextralife Wiki</a>
               </p>
             </div>
          </section>

          {/* Privacy Policy */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaInfoCircle className="mr-2" />
              Privacy & Cookies
            </h3>
             <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
               <p className="text-[#D4C4A8] text-sm">
                 This website uses cookies for collecting statistics and improving user experience. 
                 Game progress is stored locally in your browser. No personal data is collected or transmitted.
                 For more information, please refer to our{' '}
                 <a 
                   href="/privacy-policy" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-[#AF9767] hover:text-yellow-400 underline"
                 >
                   Privacy Policy
                 </a>.
               </p>
             </div>
          </section>

          {/* Feedback Section */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaExternalLinkAlt className="mr-2" />
              Feedback / Questions
            </h3>
            <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4">
              <p className="text-[#D4C4A8] text-sm mb-3">
                Please check the FAQ section first for common questions.
              </p>
              <p className="text-[#D4C4A8] text-sm mb-3">
                Have a suggestion? Found a bug? Just want to say hello? 😎
              </p>
               <button
                 onClick={handleEmailClick}
                 className="bg-[#AF9767] hover:bg-[#8B6F47] text-black font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
               >
                 <FaExternalLinkAlt className="mr-2" />
                 Go to Contact Page
               </button>
            </div>
          </section>

          {/* Support Section */}
          <section>
            <h3 className="text-xl font-bold text-[#AF9767] mb-3 flex items-center">
              <FaCoffee className="mr-2" />
              Support the Game
            </h3>
            <div className="bg-[#1A0F08] border border-[#AF9767] rounded-lg p-4 text-center">
              <p className="text-[#D4C4A8] text-sm mb-4">
                If you want to support the game, you can buy me a coffee! ☕
              </p>
              <button
                onClick={handleDonationClick}
                className="bg-gradient-to-r from-[#AF9767] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#6B5A3A] text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center mx-auto"
              >
                <FaCoffee className="mr-2" />
                Support Development
              </button>
            </div>
          </section>

          {/* Thank You */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-[#AF9767] to-[#8B6F47] rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-2">Thank You!</h3>
              <p className="text-black font-semibold">
                Thank you very much for playing Bannerdle! ⚔️
              </p>
              <p className="text-black text-sm mt-2">
                May your guesses be true and your victories swift!
              </p>
              <p className="text-black text-sm mt-3 font-semibold">
                by,
              </p>
              <p className="text-black text-sm font-semibold">
                Raphael Athos Panayi
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#AF9767] py-4 px-6 text-center">
          <p className="text-[#8B6F47] text-sm">
            Bannerdle v{CONFIG.VERSION} - A Mount & Blade II: Bannerlord Fan Game
          </p>
        </div>
      </div>
    </div>
  );
});

AboutModal.displayName = 'AboutModal';

export default AboutModal;

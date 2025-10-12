import { useState, useEffect, memo, useCallback } from "react";
import { FaHeart, FaTimes, FaExternalLinkAlt } from "react-icons/fa";

interface DonationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  donationUrl?: string;
}

const DonationPopup = memo(({ isOpen, onClose, donationUrl = "https://ko-fi.com/yourusername" }: DonationPopupProps) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        setIsAnimated(true);
      });
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimated(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = useCallback((_e: React.MouseEvent) => {
    // Disabled overlay click to close - only allow button clicks
    // if (e.target === e.currentTarget) {
    //   onClose();
    // }
  }, [onClose]);

  const handleDonateClick = useCallback(() => {
    window.open(donationUrl, '_blank', 'noopener,noreferrer');
  }, [donationUrl]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 pt-20"
      onClick={handleOverlayClick}
    >
      <div 
        className={`relative bg-[#2D1B0E] border-2 border-[#AF9767] rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 ease-out ${
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
            <h2 className="text-xl font-bold text-[#AF9767]">Victory Achieved!</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <p className="text-[#D4C4A8] text-base mb-3">
              Congratulations on your victory! 🏆
            </p>
            <p className="text-[#B8A082] text-sm mb-4">
              Enjoyed the game? Consider supporting development with a donation!
            </p>
          </div>

          {/* Upcoming Features Section */}
          <div className="mb-4 py-3 px-4 bg-gradient-to-r from-yellow-700 to-yellow-800 border-2 border-yellow-500 rounded-lg">
            <h3 className="text-yellow-100 font-bold text-sm mb-1">
              Upcoming Features & Content Games
            </h3>
            <p className="text-yellow-200 text-xs">
              New challenges and adventures await! Stay tuned for exciting updates.
            </p>
          </div>

          {/* Donation button */}
          <div className="space-y-3">
            <button
              onClick={handleDonateClick}
              className="w-full bg-[#AF9767] hover:bg-[#C4A876] text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaHeart className="text-red-500" size={16} />
              <span>Support Development</span>
              <FaExternalLinkAlt size={12} />
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-[#4A3A2A]">
            <p className="text-[#8B6F47] text-xs">
              Thank you for playing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

DonationPopup.displayName = 'DonationPopup';

export default DonationPopup;

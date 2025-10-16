import { useState, useEffect, memo, useCallback } from "react";
import { FaUser, FaDesktop, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface ConsentModalProps {
  isOpen: boolean;
  onConsent: () => void;
  onReject: () => void;
}

const ConsentModal = memo(({ isOpen, onConsent, onReject }: ConsentModalProps) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    // Disabled overlay click to close - user must make a choice
  }, []);

  const handleConsent = useCallback(() => {
    onConsent();
  }, [onConsent]);

  const handleReject = useCallback(() => {
    onReject();
  }, [onReject]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className={`relative bg-[#2D1B0E] border-2 border-[#AF9767] rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 ease-out ${
          isAnimated ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header with Logo */}
        <div className="text-center py-6 px-6 border-b-2 border-[#AF9767]">
          <div className="text-3xl font-bold text-[#AF9767] mb-2">
            Bannerdle
          </div>
          <p className="text-[#D4C4A8] text-sm">
            bannerdle.com asks for your consent to use your personal data to:
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Consent Purposes */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <FaUser className="text-[#AF9767] mt-1 flex-shrink-0" size={16} />
              <p className="text-[#D4C4A8] text-sm">
                Personalised advertising and content, advertising and content measurement, audience research and services development
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <FaDesktop className="text-[#AF9767] mt-1 flex-shrink-0" size={16} />
              <p className="text-[#D4C4A8] text-sm">
                Store and/or access information on a device
              </p>
            </div>
          </div>

          {/* Expandable Section */}
          <div className="border-t border-[#AF9767] pt-4">
            <button
              onClick={toggleExpanded}
              className="flex items-center space-x-2 text-[#AF9767] hover:text-yellow-400 transition-colors duration-200"
            >
              <span className="text-sm font-medium">Learn more</span>
              {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
            
            {isExpanded && (
              <div className="mt-3 p-3 bg-[#1A0F08] border border-[#AF9767] rounded-lg">
                <p className="text-[#D4C4A8] text-sm">
                  Your personal data will be processed and information from your device (cookies, unique identifiers, and other device data) may be stored by, accessed by and shared with{' '}
                  <span className="text-[#AF9767] font-medium">289 TCF vendor(s)</span> and{' '}
                  <span className="text-[#AF9767] font-medium">367 ad partner(s)</span>, or used specifically by this site or app.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div className="flex space-x-3 mb-3">
            <button
              onClick={handleReject}
              className="flex-1 bg-[#AF9767] hover:bg-[#8B6F47] text-black font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Do not consent
            </button>
            <button
              onClick={handleConsent}
              className="flex-1 bg-[#AF9767] hover:bg-[#8B6F47] text-black font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Consent
            </button>
          </div>
          
          <div className="text-center">
            <button className="text-[#AF9767] hover:text-yellow-400 text-sm font-medium transition-colors duration-200">
              Manage options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ConsentModal.displayName = 'ConsentModal';

export default ConsentModal;

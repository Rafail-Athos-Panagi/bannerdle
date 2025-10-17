import { useState, useEffect, useCallback } from 'react';

interface ConsentState {
  hasConsented: boolean | null;
  consentTimestamp: number | null;
}

const CONSENT_KEY = 'bannerdle-consent';

export const useConsent = () => {
  const [consentState, setConsentState] = useState<ConsentState>({
    hasConsented: null,
    consentTimestamp: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load consent state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsentState(parsed);
        // If user has already consented or rejected, don't show modal
        if (parsed.hasConsented !== null) {
          setIsModalOpen(false);
        } else {
          setIsModalOpen(true);
        }
      } else {
        // No stored consent, show modal
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error loading consent state:', error);
      // If there's an error, show modal to be safe
      setIsModalOpen(true);
    }
  }, []);

  const handleConsent = useCallback(() => {
    const newState = {
      hasConsented: true,
      consentTimestamp: Date.now(),
    };
    
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(newState));
      setConsentState(newState);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  }, []);

  const handleReject = useCallback(() => {
    const newState = {
      hasConsented: false,
      consentTimestamp: Date.now(),
    };
    
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(newState));
      setConsentState(newState);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving rejection:', error);
    }
  }, []);

  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(CONSENT_KEY);
      setConsentState({
        hasConsented: null,
        consentTimestamp: null,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error resetting consent:', error);
    }
  }, []);

  return {
    consentState,
    isModalOpen,
    handleConsent,
    handleReject,
    resetConsent,
  };
};

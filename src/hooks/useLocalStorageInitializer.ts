import { useEffect } from 'react';
import { TroopService } from '@/services/TroopService';
import { MapAreaService } from '@/services/MapAreaService';

/**
 * Hook to initialize localStorage for both games
 * This runs when the component mounts and clears all previous guess data
 * Vercel cron jobs handle the server-side scheduling
 */
export function useLocalStorageInitializer() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Initialize localStorage for both games and clear all previous data
    const initializeGames = () => {
      try {
        // Force clear all previous guesses and reset both games
        // This ensures clean state every time the app loads
        TroopService.forceClearLocalStorage();
        MapAreaService.forceClearLocalStorage();
        console.log('🔄 [LOCALSTORAGE] All game data force cleared and initialized');
      } catch (error) {
        console.error('❌ Error initializing localStorage:', error);
      }
    };

    // Initialize immediately when component mounts
    initializeGames();

    // No interval timer - let Vercel cron jobs handle the timing
    // localStorage will be cleared when users visit the site after new selections
  }, []);
}

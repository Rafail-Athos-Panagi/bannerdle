import { useEffect } from 'react';
import { TroopService } from '@/services/TroopService';
import { MapAreaService } from '@/services/MapAreaService';

/**
 * Hook to initialize localStorage for both games
 * This runs when the component mounts and checks for day changes
 * If the stored currentDay differs from today's date, localStorage will be cleared
 */
export function useLocalStorageInitializer() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Initialize localStorage for both games and check for day changes
    const initializeGames = async () => {
      try {
        // Get game states - this will automatically clear localStorage if day has changed
        // Each service checks if currentDay !== today and clears data if different
        const troopState = TroopService.getGameState();
        const mapAreaState = MapAreaService.getGameState();
        
      } catch (error) {
        console.error('❌ Error initializing localStorage:', error);
      }
    };

    // Initialize immediately when component mounts
    initializeGames();
  }, []);
}

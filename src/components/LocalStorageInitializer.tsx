'use client';

import { useLocalStorageInitializer } from '@/hooks/useLocalStorageInitializer';

/**
 * Client component to initialize localStorage for both games
 * This runs on the client side and checks for day changes
 * If the stored currentDay differs from today's date, localStorage will be cleared
 */
export default function LocalStorageInitializer() {
  useLocalStorageInitializer();
  
  // This component doesn't render anything visible
  return null;
}

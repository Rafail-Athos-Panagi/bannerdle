'use client';

import { useLocalStorageInitializer } from '@/hooks/useLocalStorageInitializer';

/**
 * Client component to initialize localStorage for both games
 * This runs on the client side and ensures localStorage is properly initialized
 */
export default function LocalStorageInitializer() {
  useLocalStorageInitializer();
  
  // This component doesn't render anything visible
  return null;
}

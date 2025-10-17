import { MapArea } from '@/types/MapArea.type';
import { LastMapArea } from '@/services/MapAreaGameService';

export interface MapGuess {
  mapArea: MapArea;
  distance: number; // Distance from target in map units
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  isCorrect: boolean;
  correctSettlementType: boolean; // Whether the settlement type matches
  timestamp: Date;
}

export interface MapGameState {
  guesses: MapGuess[];
  currentDay: string; // YYYY-MM-DD format
  correctGuess?: MapGuess; // Store the correct guess when found
  lastSelection?: LastMapArea;
}

export class MapAreaService {
  private static readonly STORAGE_KEY = 'mapAreaGame';

  // Get today's date in YYYY-MM-DD format
  private static getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Initialize or get current game state
  static getGameState(): MapGameState {
    // Only run on client side to prevent SSR errors
    if (typeof window === 'undefined') {
      return this.initializeNewGame();
    }

    const today = this.getTodayString();
    const stored = localStorage.getItem(this.STORAGE_KEY);
    
    if (stored) {
      try {
        const parsedState = JSON.parse(stored) as MapGameState;
        // Check if it's a new day
        if (parsedState.currentDay !== today) {
          return this.initializeNewGame();
        }
        return parsedState;
      } catch (error) {
        console.error('Error parsing stored map game state:', error);
        return this.initializeNewGame();
      }
    }
    
    return this.initializeNewGame();
  }

  // Initialize a new game for today
  private static initializeNewGame(): MapGameState {
    const newState: MapGameState = {
      guesses: [],
      currentDay: this.getTodayString()
    };
    
    this.saveGameState(newState);
    return newState;
  }

  // Save game state to localStorage
  private static saveGameState(gameState: MapGameState): void {
    // Only run on client side to prevent SSR errors
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gameState));
  }


  // Make a guess
  static async makeGuess(guessedMapArea: MapArea): Promise<{ success: boolean; guess?: MapGuess; gameState?: MapGameState }> {
    const currentState = this.getGameState();
    
    // Check if already guessed this map area
    const alreadyGuessed = currentState.guesses.some(guess => 
      guess.mapArea.name === guessedMapArea.name
    );
    
    if (alreadyGuessed) {
      return { success: false };
    }

    try {
      // Use the API endpoint that reads from JSON files
      const response = await fetch(`/api/checkMapArea?name=${encodeURIComponent(guessedMapArea.name)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Create guess with data from secure API
      const guess: MapGuess = {
        mapArea: guessedMapArea,
        distance: data.distance,
        direction: data.direction,
        isCorrect: data.correct,
        correctSettlementType: data.correctSettlementType,
        timestamp: new Date()
      };

      // Update game state
      const newGuesses = [...currentState.guesses, guess];

      const newGameState: MapGameState = {
        ...currentState,
        guesses: newGuesses,
        // Store the correct guess if this is the right answer
        correctGuess: data.correct ? guess : currentState.correctGuess
      };

      this.saveGameState(newGameState);

      return {
        success: true,
        guess,
        gameState: newGameState
      };
    } catch (error) {
      console.error('Error making map area guess:', error);
      return { success: false };
    }
  }

  // Get all map areas
  static async getMapAreas(): Promise<MapArea[]> {
    try {
      const response = await fetch('/api/map-areas');
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data as MapArea[];
    } catch (error) {
      console.error('Error fetching map areas:', error);
      return [];
    }
  }

  // Get map area by name
  static async getMapAreaByName(name: string): Promise<MapArea | undefined> {
    try {
      const response = await fetch(`/api/map-areas?name=${encodeURIComponent(name)}`);
      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`API request failed: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        return undefined;
      }
      return data as MapArea;
    } catch (error) {
      console.error('Error fetching map area:', error);
      return undefined;
    }
  }

  // Reset game (for testing purposes)
  static resetGame(): void {
    // Only run on client side to prevent SSR errors
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Helper function to calculate direction from one point to another
  private static calculateDirection(from: [number, number], to: [number, number]): 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const angle = Math.atan2(dy, dx);
    const degrees = (angle * 180) / Math.PI;
    
    // Convert to 0-360 range
    const normalizedDegrees = (degrees + 360) % 360;
    
    if (normalizedDegrees >= 337.5 || normalizedDegrees < 22.5) return 'E';
    if (normalizedDegrees >= 22.5 && normalizedDegrees < 67.5) return 'NE';
    if (normalizedDegrees >= 67.5 && normalizedDegrees < 112.5) return 'N';
    if (normalizedDegrees >= 112.5 && normalizedDegrees < 157.5) return 'NW';
    if (normalizedDegrees >= 157.5 && normalizedDegrees < 202.5) return 'W';
    if (normalizedDegrees >= 202.5 && normalizedDegrees < 247.5) return 'SW';
    if (normalizedDegrees >= 247.5 && normalizedDegrees < 292.5) return 'S';
    if (normalizedDegrees >= 292.5 && normalizedDegrees < 337.5) return 'SE';
    
    return 'E'; // fallback
  }

  // Get the correct guess if found
  static getCorrectGuess(): MapGuess | null {
    const currentState = this.getGameState();
    return currentState.correctGuess || null;
  }

  // Force clear localStorage (for testing or manual reset)
  static forceClearLocalStorage(): void {
    if (typeof window === 'undefined') return; // Only run on client side
    
    const today = this.getTodayString();
    const newState: MapGameState = {
      guesses: [], // Clear all previous guesses
      currentDay: today,
      correctGuess: undefined, // Clear any previous correct guess
      lastSelection: undefined // Clear previous last selection
    };
    
    this.saveGameState(newState);
  }

  // Update lastSelection
  static updateLastSelection(lastSelection: LastMapArea): void {
    const currentState = this.getGameState();
    const newState = { ...currentState, lastSelection };
    this.saveGameState(newState);
  }

  // Check if the user has found the correct area
  static hasFoundCorrectArea(): boolean {
    const currentState = this.getGameState();
    return !!currentState.correctGuess;
  }

  // Get game statistics
  static getGameStats(): {
    totalGames: number;
    wins: number;
    averageGuesses: number;
    currentStreak: number;
  } {
    // This would require additional storage for statistics
    // For now, return basic stats
    return {
      totalGames: 0,
      wins: 0,
      averageGuesses: 0,
      currentStreak: 0
    };
  }
}

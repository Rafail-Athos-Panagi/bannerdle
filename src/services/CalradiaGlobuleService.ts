import { Settlement, Guess, GameState } from '@/types/Settlement.type';

export class CalradiaGlobuleService {
  private static readonly STORAGE_KEY = 'calradiaGlobuleGame';
  private static readonly MAX_GUESSES = 6;

  // Utility functions (previously imported from settlements)
  private static async getSettlements(): Promise<Settlement[]> {
    try {
      const response = await fetch('/api/settlements');
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching settlements:', error);
      return [];
    }
  }

  private static async getRandomSettlement(): Promise<Settlement | null> {
    const settlements = await this.getSettlements();
    if (settlements.length === 0) return null;
    return settlements[Math.floor(Math.random() * settlements.length)];
  }

  private static calculateDistance(point1: [number, number], point2: [number, number]): number {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  private static calculateDirection(point1: [number, number], point2: [number, number]): 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' {
    const dx = point2[0] - point1[0];
    const dy = point2[1] - point1[1];
    const angle = Math.atan2(dy, dx);
    const degrees = (angle * 180) / Math.PI;
    
    if (degrees >= -22.5 && degrees < 22.5) return 'E';
    if (degrees >= 22.5 && degrees < 67.5) return 'NE';
    if (degrees >= 67.5 && degrees < 112.5) return 'N';
    if (degrees >= 112.5 && degrees < 157.5) return 'NW';
    if (degrees >= 157.5 || degrees < -157.5) return 'W';
    if (degrees >= -157.5 && degrees < -112.5) return 'SW';
    if (degrees >= -112.5 && degrees < -67.5) return 'S';
    if (degrees >= -67.5 && degrees < -22.5) return 'SE';
    
    return 'E'; // Default fallback
  }

  // Get today's date in YYYY-MM-DD format
  private static getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Initialize or get current game state
  static async getGameState(): Promise<GameState> {
    const today = this.getTodayString();
    const stored = localStorage.getItem(this.STORAGE_KEY);
    
    if (stored) {
      try {
        const parsedState = JSON.parse(stored) as GameState;
        // Check if it's a new day
        if (parsedState.currentDay !== today) {
          return await this.initializeNewGame();
        }
        return parsedState;
      } catch (error) {
        console.error('Error parsing stored game state:', error);
        return await this.initializeNewGame();
      }
    }
    
    return await this.initializeNewGame();
  }

  // Initialize a new game for today
  private static async initializeNewGame(): Promise<GameState> {
    const targetSettlement = await this.getRandomSettlement();
    const newState: GameState = {
      targetSettlement,
      guesses: [],
      gameStatus: 'playing',
      maxGuesses: this.MAX_GUESSES,
      currentDay: this.getTodayString()
    };
    
    this.saveGameState(newState);
    return newState;
  }

  // Save game state to localStorage
  private static saveGameState(gameState: GameState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gameState));
  }

  // Make a guess
  static makeGuess(guessedSettlement: Settlement): { success: boolean; guess?: Guess; gameState?: GameState } {
    const currentState = this.getGameState();
    
    // Check if game is already over
    if (currentState.gameStatus !== 'playing') {
      return { success: false };
    }

    // Check if already guessed this settlement
    const alreadyGuessed = currentState.guesses.some(guess => 
      guess.settlement.id === guessedSettlement.id
    );
    
    if (alreadyGuessed) {
      return { success: false };
    }

    // Check if max guesses reached
    if (currentState.guesses.length >= currentState.maxGuesses) {
      return { success: false };
    }

    // Calculate distance and direction
    const distance = this.calculateDistance(
      guessedSettlement.center,
      currentState.targetSettlement!.center
    );
    const direction = this.calculateDirection(
      guessedSettlement.center,
      currentState.targetSettlement!.center
    );

    // Create guess
    const guess: Guess = {
      settlement: guessedSettlement,
      distance: Math.round(distance),
      direction,
      isCorrect: guessedSettlement.id === currentState.targetSettlement!.id,
      timestamp: new Date()
    };

    // Update game state
    const newGuesses = [...currentState.guesses, guess];
    let newGameStatus: 'playing' | 'won' | 'lost' = 'playing';

    if (guess.isCorrect) {
      newGameStatus = 'won';
    } else if (newGuesses.length >= currentState.maxGuesses) {
      newGameStatus = 'lost';
    }

    const newGameState: GameState = {
      ...currentState,
      guesses: newGuesses,
      gameStatus: newGameStatus
    };

    this.saveGameState(newGameState);

    return {
      success: true,
      guess,
      gameState: newGameState
    };
  }

  // Get all settlements
  static async getAllSettlements(): Promise<Settlement[]> {
    return await this.getSettlements();
  }

  // Get settlement by ID
  static async getSettlementById(id: string): Promise<Settlement | undefined> {
    const settlements = await this.getSettlements();
    return settlements.find(settlement => settlement.id === id);
  }

  // Reset game (for testing purposes)
  static resetGame(): void {
    localStorage.removeItem(this.STORAGE_KEY);
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

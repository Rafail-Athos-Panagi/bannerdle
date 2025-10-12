import { Settlement, Guess, GameState } from '@/types/Settlement.type';
import { settlements, getRandomSettlement, calculateDistance, calculateDirection } from '@/data/settlements';

export class CalradiaGlobuleService {
  private static readonly STORAGE_KEY = 'calradiaGlobuleGame';
  private static readonly MAX_GUESSES = 6;

  // Get today's date in YYYY-MM-DD format
  private static getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Initialize or get current game state
  static getGameState(): GameState {
    const today = this.getTodayString();
    const stored = localStorage.getItem(this.STORAGE_KEY);
    
    if (stored) {
      try {
        const parsedState = JSON.parse(stored) as GameState;
        // Check if it's a new day
        if (parsedState.currentDay !== today) {
          return this.initializeNewGame();
        }
        return parsedState;
      } catch (error) {
        console.error('Error parsing stored game state:', error);
        return this.initializeNewGame();
      }
    }
    
    return this.initializeNewGame();
  }

  // Initialize a new game for today
  private static initializeNewGame(): GameState {
    const newState: GameState = {
      targetSettlement: getRandomSettlement(),
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
    const distance = calculateDistance(
      guessedSettlement.center,
      currentState.targetSettlement!.center
    );
    const direction = calculateDirection(
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
  static getSettlements(): Settlement[] {
    return settlements;
  }

  // Get settlement by ID
  static getSettlementById(id: string): Settlement | undefined {
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

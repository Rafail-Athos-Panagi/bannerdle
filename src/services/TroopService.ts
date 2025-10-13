import { supabase } from '@/lib/supabase';
import { Troop, TroopStatus, LastTroop } from '@/types/Troop.type';
import TroopsData from '@/data/Troops.json';

export interface TroopGuess {
  troop: Troop;
  troopStatus: TroopStatus;
  isCorrect: boolean;
  timestamp: Date;
}

export interface TroopGameState {
  guesses: TroopGuess[];
  currentDay: string; // YYYY-MM-DD format
  correctGuess?: TroopGuess; // Store the correct guess when found
  showIndicator: boolean;
  lastSelection?: LastTroop;
}

export class TroopService {
  private static readonly STORAGE_KEY = 'troopGame'

  // Mapping function to normalize faction and culture names
  private static normalizeFactionAndCulture(data: Record<string, any>): Record<string, any> {
    const factionMap: { [key: string]: string } = {
      'Vlandia': 'Kingdom of Vlandia',
      'Empire': 'Calradic Empire',
      'Sturgia': 'Principality of Sturgia',
      'Aserai': 'Aserai Sultanate',
      'Battania': 'High Kingdom of the Battanians',
      'Khuzait': 'Khuzait Khanate'
    };

    const cultureMap: { [key: string]: string } = {
      'Vlandian': 'Vlandia',
      'Empire': 'Empire',
      'Sturgian': 'Sturgia',
      'Aserai': 'Aserai',
      'Battanian': 'Battania',
      'Khuzait': 'Khuzait'
    };

    const bannerMap: { [key: string]: string } = {
      'Vlandia': 'Factions/Kingdom_of_Vlandia.png',
      'Empire': 'Factions/Calradic_Empire.png',
      'Sturgia': 'Factions/Principality_of_Sturgia.png',
      'Aserai': 'Factions/Aserai_Sultanate.png',
      'Battania': 'Factions/High_Kingdom_of_the_Battanians.png',
      'Khuzait': 'Factions/Khuzait_Khanate.png'
    };

    return {
      ...data,
      faction: factionMap[data.faction as string] || data.faction,
      culture: cultureMap[data.culture as string] || data.culture,
      banner: bannerMap[data.banner as string] || data.banner
    };
  };

  // Get today's date in YYYY-MM-DD format
  private static getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Migrate from old localStorage structure to new consolidated structure
  static migrateFromOldStructure(): TroopGameState {
    const today = this.getTodayString();
    
    // Get old localStorage values
    const oldCorrectGuess = localStorage.getItem("correctGuess");
    const oldIncorrectGuesses = localStorage.getItem("incorrectGuesses");
    const oldLastSelection = localStorage.getItem("lastSelection");
    const oldShowIndicator = localStorage.getItem("showIndicator");
    
    // Parse old values
    let correctGuess: TroopGuess | undefined;
    let guesses: TroopGuess[] = [];
    let lastSelection: LastTroop | undefined;
    let showIndicator = true;
    
    try {
      if (oldCorrectGuess) {
        const parsedCorrectGuess = JSON.parse(oldCorrectGuess) as TroopStatus;
        correctGuess = {
          troop: parsedCorrectGuess,
          troopStatus: parsedCorrectGuess,
          isCorrect: true,
          timestamp: new Date()
        };
      }
      
      if (oldIncorrectGuesses) {
        const parsedIncorrectGuesses = JSON.parse(oldIncorrectGuesses) as TroopStatus[];
        guesses = parsedIncorrectGuesses.map(guess => ({
          troop: guess,
          troopStatus: guess,
          isCorrect: false,
          timestamp: new Date()
        }));
      }
      
      if (oldLastSelection) {
        lastSelection = JSON.parse(oldLastSelection) as LastTroop;
      }
      
      if (oldShowIndicator) {
        showIndicator = oldShowIndicator === "true";
      }
    } catch (error) {
      console.error("Error parsing old localStorage values:", error);
    }
    
    // Create new consolidated state
    const newState: TroopGameState = {
      guesses,
      currentDay: today,
      correctGuess,
      showIndicator,
      lastSelection
    };
    
    // Save new state and clear old keys
    this.saveGameState(newState);
    this.clearOldKeys();
    
    return newState;
  }
  
  // Clear old localStorage keys
  private static clearOldKeys(): void {
    localStorage.removeItem("correctGuess");
    localStorage.removeItem("incorrectGuesses");
    localStorage.removeItem("lastSelection");
    localStorage.removeItem("showIndicator");
  }

  // Initialize or get current game state
  static getGameState(): TroopGameState {
    const today = this.getTodayString();
    const stored = localStorage.getItem(this.STORAGE_KEY);
    
    if (stored) {
      try {
        const parsedState = JSON.parse(stored) as TroopGameState;
        // Check if it's a new day
        if (parsedState.currentDay !== today) {
          return this.initializeNewGame();
        }
        return parsedState;
      } catch (error) {
        console.error('Error parsing stored troop game state:', error);
        return this.initializeNewGame();
      }
    }
    
    // Check if old localStorage keys exist and migrate them
    const hasOldKeys = localStorage.getItem("correctGuess") || 
                      localStorage.getItem("incorrectGuesses") || 
                      localStorage.getItem("lastSelection") || 
                      localStorage.getItem("showIndicator");
    
    if (hasOldKeys) {
      console.log('Migrating from old localStorage structure...');
      return this.migrateFromOldStructure();
    }
    
    return this.initializeNewGame();
  }

  // Initialize a new game for today
  private static initializeNewGame(): TroopGameState {
    const newState: TroopGameState = {
      guesses: [],
      currentDay: this.getTodayString(),
      showIndicator: true
    };
    
    this.saveGameState(newState);
    return newState;
  }

  // Save game state to localStorage
  private static saveGameState(gameState: TroopGameState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gameState));
  }

  // Make a troop guess
  static async makeTroopGuess(troopName: string): Promise<{ success: boolean; guess?: TroopGuess; gameState?: TroopGameState }> {
    const currentState = this.getGameState();
    
    // Check if already guessed this troop
    const alreadyGuessed = currentState.guesses.some(guess => 
      guess.troop.name === troopName
    );
    
    if (alreadyGuessed) {
      return { success: false };
    }

    try {
      const data = await this.checkTroop(troopName);
      
      const guess: TroopGuess = {
        troop: data.troopStatus,
        troopStatus: data.troopStatus,
        isCorrect: data.correct,
        timestamp: new Date()
      };

      // Update game state
      const newGuesses = [...currentState.guesses, guess];

      const newGameState: TroopGameState = {
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
      console.error('Error making troop guess:', error);
      return { success: false };
    }
  }

  // Update showIndicator setting
  static updateShowIndicator(showIndicator: boolean): void {
    const currentState = this.getGameState();
    const newState = { ...currentState, showIndicator };
    this.saveGameState(newState);
  }

  // Force clear localStorage (for testing or manual reset)
  static forceClearLocalStorage(): void {
    if (typeof window === 'undefined') return; // Only run on client side
    
    const today = this.getTodayString();
    const newState: TroopGameState = {
      guesses: [], // Clear all previous guesses
      currentDay: today,
      showIndicator: true,
      correctGuess: undefined, // Clear any previous correct guess
      lastSelection: undefined // Clear previous last selection
    };
    
    this.saveGameState(newState);
    console.log('🔄 [TROOP GAME] localStorage force cleared for:', today);
  }

  // Update lastSelection
  static updateLastSelection(lastSelection: LastTroop): void {
    const currentState = this.getGameState();
    const newState = { ...currentState, lastSelection };
    this.saveGameState(newState);
  }

  // Get the correct guess if found
  static getCorrectGuess(): TroopGuess | null {
    const currentState = this.getGameState();
    return currentState.correctGuess || null;
  }

  // Check if the user has found the correct troop
  static hasFoundCorrectTroop(): boolean {
    const currentState = this.getGameState();
    return !!currentState.correctGuess;
  }

  // Reset game (for testing purposes)
  static resetGame(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Check if a troop guess is correct
  static async checkTroop(troopName: string): Promise<{
    correct: boolean;
    currentSelection: Troop;
    troopStatus: TroopStatus;
  }> {
    try {
      // Find troop data from static JSON
      const troopData = (TroopsData as Troop[]).find(
        (troop) => troop.name.toLowerCase() === troopName.toLowerCase()
      );

      if (!troopData) {
        throw new Error('Troop not found');
      }

      // Get current selection from Supabase (last entry from used_troops table)
      const { data: usedTroops, error: selectionError } = await supabase
        .from('used_troops')
        .select('*')
        .order('used_date', { ascending: false })
        .limit(1);

      if (selectionError) {
        throw selectionError;
      }

      if (!usedTroops || usedTroops.length === 0) {
        throw new Error('No current troop selection found');
      }

      const currentSelection = usedTroops[0];

      // Normalize the current selection data to match Troops.json format
      const normalizedCurrentSelection = this.normalizeFactionAndCulture(currentSelection) as Troop;

      const isCorrect = normalizedCurrentSelection.name.toLowerCase() === troopName.toLowerCase();

      const troopStatus: TroopStatus = {
        ...troopData,
        nameStatus: isCorrect ? "Same" : "Wrong",
        tierStatus: (() => {
          if (troopData.tier === normalizedCurrentSelection.tier) return "Same";
          return troopData.tier > normalizedCurrentSelection.tier ? "Higher" : "Lower";
        })(),
        typeStatus: (() => {
          if (troopData.type === normalizedCurrentSelection.type) return "Same";
          // Check for partial match between Archer and Mounted Archer
          if ((troopData.type === "Archer" && normalizedCurrentSelection.type === "Mounted Archer") ||
              (troopData.type === "Mounted Archer" && normalizedCurrentSelection.type === "Archer")) {
            return "Partial";
          }
          return "Wrong";
        })(),
        occupationStatus: troopData.occupation === normalizedCurrentSelection.occupation ? "Same" : "Wrong",
        factionStatus: troopData.faction === normalizedCurrentSelection.faction ? "Same" : "Wrong",
        bannerStatus: troopData.banner === normalizedCurrentSelection.banner ? "Same" : "Wrong",
        cultureStatus: troopData.culture === normalizedCurrentSelection.culture ? "Same" : "Wrong",
      };

      return {
        correct: isCorrect,
        currentSelection: normalizedCurrentSelection,
        troopStatus,
      };
    } catch (error) {
      console.error('Error checking troop:', error);
      throw error;
    }
  }

  // Get last selection (second-to-last entry from used_troops table)
  static async getLastSelection(): Promise<LastTroop> {
    try {
      const { data: usedTroops, error } = await supabase
        .from('used_troops')
        .select('*')
        .order('used_date', { ascending: false })
        .limit(2);

      if (error) {
        throw error;
      }

      // Return the second entry (last selection) or empty object if not enough entries
      const lastSelection = usedTroops && usedTroops.length >= 2 ? usedTroops[1] : {};
      
      return lastSelection || {};
    } catch (error) {
      console.error('Error fetching last selection:', error);
      throw error;
    }
  }

  // Daily troop selection method
  static async dailyTroopSelection(): Promise<void> {
    try {
      // This method would typically handle the daily troop selection logic
      // For now, it's a placeholder that can be implemented based on your requirements
      console.log('Daily troop selection called');
      
      // Example implementation - you can modify this based on your needs:
      // 1. Select a random troop from TroopsData
      // 2. Insert it into the used_troops table
      // 3. Handle any other daily selection logic
      
      const randomTroop = TroopsData[Math.floor(Math.random() * TroopsData.length)];
      
      const { error } = await supabase
        .from('used_troops')
        .insert([
          {
            ...randomTroop,
            used_date: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      console.log('Daily troop selection completed:', randomTroop.name);
    } catch (error) {
      console.error('Error in daily troop selection:', error);
      throw error;
    }
  }

  // Select troop method (alias for dailyTroopSelection)
  static async selectTroop(): Promise<void> {
    return this.dailyTroopSelection();
  }

}

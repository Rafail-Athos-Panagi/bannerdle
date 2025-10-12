export interface Settlement {
  id: string;
  name: string;
  type: 'town' | 'castle' | 'village';
  faction: string;
  center: [number, number]; // [x, y] coordinates on the map
  radius: number; // Radius of the clickable circle
}

export interface Guess {
  settlement: Settlement;
  distance: number; // Distance from target in map units
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  isCorrect: boolean;
  timestamp: Date;
}

export interface GameState {
  targetSettlement: Settlement | null;
  guesses: Guess[];
  gameStatus: 'playing' | 'won' | 'lost';
  maxGuesses: number;
  currentDay: string; // YYYY-MM-DD format
}

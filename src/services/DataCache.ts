import fs from 'fs';
import path from 'path';
import type { Troop } from '@/types/Troop.type';
import type { MapArea } from '@/types/MapArea.type';

// Type for guessed troops data structure
interface GuessedTroopEntry {
  id: number;
  name: string;
}

type GuessedTroopsData = Record<string, GuessedTroopEntry>;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class DataCache {
  private static instance: DataCache;
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache();
    }
    return DataCache.instance;
  }

  private isExpired(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Troops cache
  getTroops(): Troop[] | null {
    return this.get<Troop[]>('troops');
  }

  setTroops(troops: Troop[]): void {
    this.set('troops', troops, 10 * 60 * 1000); // 10 minutes cache
  }

  // Map areas cache
  getMapAreas(): MapArea[] | null {
    return this.get<MapArea[]>('mapAreas');
  }

  setMapAreas(mapAreas: MapArea[]): void {
    this.set('mapAreas', mapAreas, 10 * 60 * 1000); // 10 minutes cache
  }

  // Guessed troops cache
  getGuessedTroops(): GuessedTroopsData | null {
    return this.get<GuessedTroopsData>('guessedTroops');
  }

  setGuessedTroops(guessedTroops: GuessedTroopsData): void {
    this.set('guessedTroops', guessedTroops, 60 * 1000); // 1 minute cache (changes daily)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Clear specific cache entry
  clearKey(key: string): void {
    this.cache.delete(key);
  }

  // Get cache stats
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// File reading utilities with caching
export class DataService {
  private static cache = DataCache.getInstance();

  static getTroops(): Troop[] {
    // Try cache first
    const cached = this.cache.getTroops();
    if (cached) {
      return cached;
    }

    // Read from file
    const troopsFilePath = path.join(process.cwd(), 'src', 'data', 'troops.json');
    const troopsData: Troop[] = JSON.parse(fs.readFileSync(troopsFilePath, 'utf8'));
    
    // Cache the result
    this.cache.setTroops(troopsData);
    
    return troopsData;
  }

  static getMapAreas(): MapArea[] {
    // Try cache first
    const cached = this.cache.getMapAreas();
    if (cached) {
      return cached;
    }

    // Read from file
    const mapAreasFilePath = path.join(process.cwd(), 'src', 'data', 'map_areas.json');
    const mapAreasData: MapArea[] = JSON.parse(fs.readFileSync(mapAreasFilePath, 'utf8'));
    
    // Cache the result
    this.cache.setMapAreas(mapAreasData);
    
    return mapAreasData;
  }

  static getGuessedTroops(): GuessedTroopsData {
    // Try cache first
    const cached = this.cache.getGuessedTroops();
    if (cached) {
      return cached;
    }

    // Read from file
    const guessedTroopsFilePath = path.join(process.cwd(), 'src', 'data', 'guessed_troops.json');
    const guessedTroopsData = JSON.parse(fs.readFileSync(guessedTroopsFilePath, 'utf8'));
    
    // Cache the result
    this.cache.setGuessedTroops(guessedTroopsData);
    
    return guessedTroopsData;
  }

  static getTroopByName(name: string): Troop | undefined {
    const troops = this.getTroops();
    return troops.find(t => t.name.toLowerCase() === name.toLowerCase());
  }

  static getMapAreaByName(name: string): MapArea | undefined {
    const mapAreas = this.getMapAreas();
    return mapAreas.find(m => m.name.toLowerCase() === name.toLowerCase());
  }
}

export default DataCache;

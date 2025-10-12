import { supabase } from '@/lib/supabase';

export interface CurrentMapArea {
  id: number;
  name: string;
  faction: string;
  type: string;
  coordinates: [number, number];
  date: string;
}

export interface LastMapArea {
  id: number;
  name: string;
  faction: string;
  type: string;
  coordinates: [number, number];
  date?: string;
}

export class MapAreaGameService {
  // Get the current map area selection from database (last entry from used_map_areas table)
  static async getCurrentMapArea(): Promise<CurrentMapArea | null> {
    try {
      const { data: usedMapAreas, error } = await supabase
        .from('used_map_areas')
        .select('*')
        .order('used_date', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching current map area:', error);
        return null;
      }

      if (!usedMapAreas || usedMapAreas.length === 0) {
        return null;
      }

      const currentMapArea = usedMapAreas[0];

      return {
        id: currentMapArea.id,
        name: currentMapArea.name,
        faction: currentMapArea.faction,
        type: currentMapArea.type,
        coordinates: currentMapArea.coordinates as [number, number],
        date: currentMapArea.used_date
      };
    } catch (error) {
      console.error('Error fetching current map area:', error);
      return null;
    }
  }

  // Calculate distance between two coordinate points
  static calculateDistance(point1: [number, number], point2: [number, number]): number {
    const dx = point2[0] - point1[0];
    const dy = point2[1] - point1[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Determine pin color based on distance from target
  static getPinColor(distance: number): 'green' | 'yellow' | 'red' {
    if (distance < 50) {
      return 'green'; // Very close - correct or very close
    } else if (distance < 150) {
      return 'yellow'; // Close - moderate distance
    } else {
      return 'red'; // Far - far away
    }
  }

  // Check if the guessed area is the correct one
  static isCorrectArea(guessedArea: { name: string }, targetArea: CurrentMapArea): boolean {
    return guessedArea.name.toLowerCase() === targetArea.name.toLowerCase();
  }

  // Get last selection (second-to-last entry from used_map_areas table)
  static async getLastSelection(): Promise<LastMapArea> {
    try {
      const { data: usedMapAreas, error } = await supabase
        .from('used_map_areas')
        .select('*')
        .order('used_date', { ascending: false })
        .limit(2);

      if (error) {
        throw error;
      }

      // Return the second entry (last selection) or empty object if not enough entries
      const lastSelection = usedMapAreas && usedMapAreas.length >= 2 ? usedMapAreas[1] : {};
      
      return lastSelection || {};
    } catch (error) {
      console.error('Error fetching last map selection:', error);
      throw error;
    }
  }
}

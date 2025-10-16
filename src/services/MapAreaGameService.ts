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

  // Get last selection from JSON file (yesterday's map area)
  static async getLastSelection(): Promise<LastMapArea> {
    try {
      // Use the API endpoint that now reads from JSON files
      const response = await fetch('/api/lastMapAreaSelection');
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data.lastSelection || {};
    } catch (error) {
      console.error('Error fetching last map selection:', error);
      throw error;
    }
  }
}

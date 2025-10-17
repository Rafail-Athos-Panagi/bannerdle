import { NextResponse } from 'next/server';
import { DataService } from '@/services/DataCache';

/**
 * Troops API
 * Provides access to troops data from JSON file with caching
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (name) {
      // Get specific troop by name
      const troop = DataService.getTroopByName(name);
      
      if (!troop) {
        return NextResponse.json(
          { error: "Troop not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(troop);
    } else {
      // Get all troops
      const troopsData = DataService.getTroops();
      return NextResponse.json(troopsData);
    }
  } catch (error) {
    console.error("Error in troops API:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

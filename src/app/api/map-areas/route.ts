import { NextResponse } from 'next/server';
import { DataService } from '@/services/DataCache';

/**
 * Map Areas API
 * Provides access to map areas data from JSON file with caching
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (name) {
      // Get specific map area by name
      const mapArea = DataService.getMapAreaByName(name);
      
      if (!mapArea) {
        return NextResponse.json(
          { error: "Map area not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(mapArea);
    } else {
      // Get all map areas
      const mapAreasData = DataService.getMapAreas();
      return NextResponse.json(mapAreasData);
    }
  } catch (error) {
    console.error("Error in map areas API:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

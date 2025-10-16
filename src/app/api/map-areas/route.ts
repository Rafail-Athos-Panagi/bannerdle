import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { MapArea } from '@/types/MapArea.type';

/**
 * Map Areas API
 * Provides access to map areas data from JSON file
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    // Read map areas data from JSON file
    const mapAreasFilePath = path.join(process.cwd(), 'src', 'data', 'map_areas.json');
    const mapAreasData: MapArea[] = JSON.parse(fs.readFileSync(mapAreasFilePath, 'utf8'));
    
    if (name) {
      // Get specific map area by name
      const mapArea = mapAreasData.find(m => m.name.toLowerCase() === name.toLowerCase());
      
      if (!mapArea) {
        return NextResponse.json(
          { error: "Map area not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(mapArea);
    } else {
      // Get all map areas
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

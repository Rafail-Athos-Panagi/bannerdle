import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { MapArea } from '@/types/MapArea.type';

interface CheckMapAreaResponse {
  correct: boolean;
  distance: number;
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
}

// Calculate distance between two coordinate points
function calculateDistance(point1: [number, number], point2: [number, number]): number {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate direction from guess to target
function calculateDirection(
  guessCoords: [number, number], 
  targetCoords: [number, number]
): 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' {
  const dx = targetCoords[0] - guessCoords[0];
  const dy = targetCoords[1] - guessCoords[1];
  
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  if (angle >= -22.5 && angle < 22.5) return 'E';
  if (angle >= 22.5 && angle < 67.5) return 'NE';
  if (angle >= 67.5 && angle < 112.5) return 'N';
  if (angle >= 112.5 && angle < 157.5) return 'NW';
  if (angle >= 157.5 || angle < -157.5) return 'W';
  if (angle >= -157.5 && angle < -112.5) return 'SW';
  if (angle >= -112.5 && angle < -67.5) return 'S';
  if (angle >= -67.5 && angle < -22.5) return 'SE';
  
  return 'E'; // fallback
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryName = searchParams.get('name');
    
    if (!queryName || typeof queryName !== "string") {
      return NextResponse.json(
        { error: "Map area name is required as a query parameter" },
        { status: 400 }
      );
    }

    // Read map areas data from JSON file
    const mapAreasFilePath = path.join(process.cwd(), 'src', 'data', 'map_areas.json');
    const mapAreasData: MapArea[] = JSON.parse(fs.readFileSync(mapAreasFilePath, 'utf8'));

    // Find map area data from JSON
    const mapAreaData = mapAreasData.find(m => m.name.toLowerCase() === queryName.toLowerCase());

    if (!mapAreaData) {
      return NextResponse.json(
        { error: "Map area not found" },
        { status: 404 }
      );
    }

    if (!mapAreaData.coordinates) {
      return NextResponse.json(
        { error: "Map area missing coordinates" },
        { status: 500 }
      );
    }

    // Get current selection from guessed_map_areas.json
    const today = new Date().toISOString().split('T')[0]; // UTC date
    const guessedMapAreasFilePath = path.join(process.cwd(), 'src', 'data', 'guessed_map_areas.json');
    const guessedMapAreasData = JSON.parse(fs.readFileSync(guessedMapAreasFilePath, 'utf8'));

    const currentSelection = guessedMapAreasData[today];

    if (!currentSelection) {
      return NextResponse.json(
        { error: "No current map area selection found" },
        { status: 500 }
      );
    }

    // Get the full map area data for the current selection
    const currentMapAreaData = mapAreasData.find(m => m.name.toLowerCase() === currentSelection.name.toLowerCase());

    if (!currentMapAreaData || !currentMapAreaData.coordinates) {
      return NextResponse.json(
        { error: "Current selection map area data not found or missing coordinates" },
        { status: 500 }
      );
    }

    const isCorrect: boolean = 
      currentMapAreaData.name.toLowerCase() === queryName.toLowerCase();

    // Calculate distance and direction
    const distance = calculateDistance(
      mapAreaData.coordinates,
      currentMapAreaData.coordinates as [number, number]
    );
    
    const direction = calculateDirection(
      mapAreaData.coordinates,
      currentMapAreaData.coordinates as [number, number]
    );

    const responseData: CheckMapAreaResponse = {
      correct: isCorrect,
      distance: Math.round(distance),
      direction,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error checking map area selection:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

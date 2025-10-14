import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

    // Find map area data from database
    const { data: mapAreaData, error: mapAreaError } = await supabase
      .from('map_areas')
      .select('*')
      .eq('name', queryName)
      .single();

    if (mapAreaError) {
      if (mapAreaError.code === 'PGRST116') {
        return NextResponse.json(
          { error: "Map area not found" },
          { status: 404 }
        );
      }
      console.error('Error fetching map area:', mapAreaError);
      return NextResponse.json(
        { error: "Failed to fetch map area" },
        { status: 500 }
      );
    }

    if (!mapAreaData.coordinates) {
      return NextResponse.json(
        { error: "Map area missing coordinates" },
        { status: 500 }
      );
    }

    // Get current selection from Supabase
    const { data: currentSelection, error: selectionError } = await supabase
      .from('used_map_areas')
      .select('*')
      .order('used_date', { ascending: false })
      .limit(1)
      .single();

    if (selectionError && selectionError.code !== 'PGRST116') {
      console.error('Error fetching current selection:', selectionError);
      return NextResponse.json(
        { error: "Failed to fetch current selection" },
        { status: 500 }
      );
    }

    // Validate current selection data structure
    if (!currentSelection.name || !currentSelection.coordinates) {
      return NextResponse.json(
        { error: "Invalid current selection data structure" },
        { status: 500 }
      );
    }

    const isCorrect: boolean = 
      currentSelection.name.toLowerCase() === queryName.toLowerCase();

    // Calculate distance and direction
    const distance = calculateDistance(
      mapAreaData.coordinates,
      currentSelection.coordinates as [number, number]
    );
    
    const direction = calculateDirection(
      mapAreaData.coordinates,
      currentSelection.coordinates as [number, number]
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

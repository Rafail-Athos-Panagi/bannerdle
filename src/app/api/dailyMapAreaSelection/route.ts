import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Daily Map Area Selection API
 * Returns the current map area selection from guessed_map_areas.json based on today's date
 * Current selection = map area for today's date
 * Last selection = map area for yesterday's date
 */
export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const today = new Date().toISOString().split('T')[0]; // UTC date (YYYY-MM-DD format)
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    // Read guessed map areas data from JSON file
    const guessedMapAreasFilePath = path.join(process.cwd(), 'src', 'data', 'guessed_map_areas.json');
    const guessedMapAreasData = JSON.parse(fs.readFileSync(guessedMapAreasFilePath, 'utf8'));

    // Get current selection (today's map area in UTC)
    const currentSelection = guessedMapAreasData[today];
    
    // Get last selection (yesterday's map area in UTC)
    const lastSelection = guessedMapAreasData[yesterdayString];

    if (!currentSelection) {
      return NextResponse.json(
        { 
          success: false,
          error: "No map area selection found for today",
          details: `No entry found for UTC date: ${today}`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Current map area selection: ${currentSelection.name}`,
      data: {
        currentSelection: currentSelection,
        lastSelection: lastSelection || null,
        timestamp: new Date().toISOString(), // UTC timestamp
        utcDate: today,
        initializeLocalStorage: true
      }
    });
  } catch (error) {
    console.error("Error in daily map area selection API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

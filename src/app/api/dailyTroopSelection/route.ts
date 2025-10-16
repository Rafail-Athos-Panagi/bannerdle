import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Daily Troop Selection API
 * Returns the current troop selection from guessed_troops.json based on today's date
 * Current selection = troop for today's date
 * Last selection = troop for yesterday's date
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

    // Read guessed troops data from JSON file
    const guessedTroopsFilePath = path.join(process.cwd(), 'src', 'data', 'guessed_troops.json');
    const guessedTroopsData = JSON.parse(fs.readFileSync(guessedTroopsFilePath, 'utf8'));

    // Get current selection (today's troop in UTC)
    const currentSelection = guessedTroopsData[today];
    
    // Get last selection (yesterday's troop in UTC)
    const lastSelection = guessedTroopsData[yesterdayString];

    if (!currentSelection) {
      return NextResponse.json(
        { 
          success: false,
          error: "No troop selection found for today",
          details: `No entry found for UTC date: ${today}`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Current troop selection: ${currentSelection.name}`,
      data: {
        currentSelection: currentSelection,
        lastSelection: lastSelection || null,
        timestamp: new Date().toISOString(), // UTC timestamp
        utcDate: today,
        initializeLocalStorage: true
      }
    });
  } catch (error) {
    console.error("Error in daily troop selection API:", error);
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
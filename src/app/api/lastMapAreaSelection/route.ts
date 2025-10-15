import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0]; // UTC date

    // Read guessed map areas data from JSON file
    const guessedMapAreasFilePath = path.join(process.cwd(), 'src', 'data', 'guessed_map_areas.json');
    const guessedMapAreasData = JSON.parse(fs.readFileSync(guessedMapAreasFilePath, 'utf8'));

    // Get last selection (yesterday's map area in UTC)
    const lastSelection = guessedMapAreasData[yesterdayString];
    
    return NextResponse.json({ lastSelection: lastSelection || {} });
  } catch (error) {
    console.error('Error in lastMapAreaSelection handler:', error);
    return NextResponse.json(
      { 
        error: "Failed to retrieve last map area selection",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0]; // UTC date

    // Read guessed troops data from JSON file
    const guessedTroopsFilePath = path.join(process.cwd(), 'src', 'data', 'guessed_troops.json');
    const guessedTroopsData = JSON.parse(fs.readFileSync(guessedTroopsFilePath, 'utf8'));

    // Get last selection (yesterday's troop in UTC)
    const lastSelection = guessedTroopsData[yesterdayString];
    
    return NextResponse.json(lastSelection || {});
  } catch (error) {
    console.error('Error in lastSelection handler:', error);
    return NextResponse.json(
      { 
        error: "Failed to retrieve lastSelection",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

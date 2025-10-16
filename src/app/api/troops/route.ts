import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Troop } from '@/types/Troop.type';

/**
 * Troops API
 * Provides access to troops data from JSON file
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    // Read troops data from JSON file
    const troopsFilePath = path.join(process.cwd(), 'src', 'data', 'Troops.json');
    const troopsData: Troop[] = JSON.parse(fs.readFileSync(troopsFilePath, 'utf8'));
    
    if (name) {
      // Get specific troop by name
      const troop = troopsData.find(t => t.name.toLowerCase() === name.toLowerCase());
      
      if (!troop) {
        return NextResponse.json(
          { error: "Troop not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(troop);
    } else {
      // Get all troops
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

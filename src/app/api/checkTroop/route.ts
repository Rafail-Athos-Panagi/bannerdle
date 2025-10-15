import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Troop, TroopStatus } from '@/types/Troop.type';

// Mapping function to normalize faction and culture names
function normalizeFactionAndCulture(data: Troop) {
  const factionMap: { [key: string]: string } = {
    'Vlandia': 'Kingdom of Vlandia',
    'Empire': 'Calradic Empire',
    'Sturgia': 'Principality of Sturgia',
    'Aserai': 'Aserai Sultanate',
    'Battania': 'High Kingdom of the Battanians',
    'Khuzait': 'Khuzait Khanate'
  };

  const cultureMap: { [key: string]: string } = {
    'Vlandian': 'Vlandia',
    'Empire': 'Empire',
    'Sturgian': 'Sturgia',
    'Aserai': 'Aserai',
    'Battanian': 'Battania',
    'Khuzait': 'Khuzait'
  };

  const bannerMap: { [key: string]: string } = {
    'Vlandia': 'Factions/Kingdom_of_Vlandia.png',
    'Empire': 'Factions/Calradic_Empire.png',
    'Sturgia': 'Factions/Principality_of_Sturgia.png',
    'Aserai': 'Factions/Aserai_Sultanate.png',
    'Battania': 'Factions/High_Kingdom_of_the_Battanians.png',
    'Khuzait': 'Factions/Khuzait_Khanate.png'
  };

  return {
    ...data,
    faction: factionMap[data.faction] || data.faction,
    culture: cultureMap[data.culture] || data.culture,
    banner: bannerMap[data.banner] || data.banner
  };
}

interface CheckTroopResponse {
  correct: boolean;
  troopStatus: TroopStatus;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryName = searchParams.get('name');
    
    if (!queryName || typeof queryName !== "string") {
      return NextResponse.json(
        { error: "Troop name is required as a query parameter" },
        { status: 400 }
      );
    }

    // Read troops data from JSON file
    const troopsFilePath = path.join(process.cwd(), 'src', 'data', 'Troops.json');
    const troopsData: Troop[] = JSON.parse(fs.readFileSync(troopsFilePath, 'utf8'));

    // Find troop data from JSON
    const troopData = troopsData.find(t => t.name.toLowerCase() === queryName.toLowerCase());

    if (!troopData) {
      return NextResponse.json(
        { error: "Troop not found" },
        { status: 404 }
      );
    }

    // Get current selection from guessed_troops.json
    const today = new Date().toISOString().split('T')[0]; // UTC date
    const guessedTroopsFilePath = path.join(process.cwd(), 'src', 'data', 'guessed_troops.json');
    const guessedTroopsData = JSON.parse(fs.readFileSync(guessedTroopsFilePath, 'utf8'));

    const currentSelection = guessedTroopsData[today];

    if (!currentSelection) {
      return NextResponse.json(
        { error: "No current troop selection found" },
        { status: 500 }
      );
    }

    // Get the full troop data for the current selection
    const currentTroopData = troopsData.find(t => t.name.toLowerCase() === currentSelection.name.toLowerCase());

    if (!currentTroopData) {
      return NextResponse.json(
        { error: "Current selection troop data not found" },
        { status: 500 }
      );
    }

    // Normalize the current selection data to match Troops.json format
    const normalizedCurrentSelection = normalizeFactionAndCulture(currentTroopData);

    const isCorrect: boolean =
      normalizedCurrentSelection.name.toLowerCase() === queryName.toLowerCase();

    // Calculate status for each property with proper validation
    const troopStatus: TroopStatus = {
      ...troopData,
      nameStatus: isCorrect ? "Same" : "Wrong",
      tierStatus: (() => {
        if (troopData.tier === normalizedCurrentSelection.tier) return "Same";
        return troopData.tier > normalizedCurrentSelection.tier ? "Higher" : "Lower";
      })(),
      typeStatus: (() => {
        if (troopData.type === normalizedCurrentSelection.type) return "Same";
        // Check for partial match between Archer and Mounted Archer
        if ((troopData.type === "Archer" && normalizedCurrentSelection.type === "Mounted Archer") ||
            (troopData.type === "Mounted Archer" && normalizedCurrentSelection.type === "Archer")) {
          return "Partial";
        }
        return "Wrong";
      })(),
      occupationStatus: troopData.occupation === normalizedCurrentSelection.occupation ? "Same" : "Wrong",
      factionStatus: troopData.faction === normalizedCurrentSelection.faction ? "Same" : "Wrong",
      bannerStatus: troopData.banner === normalizedCurrentSelection.banner ? "Same" : "Wrong",
      cultureStatus: troopData.culture === normalizedCurrentSelection.culture ? "Same" : "Wrong",
    };

    const responseData: CheckTroopResponse = {
      correct: isCorrect,
      troopStatus,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error checking troop selection:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

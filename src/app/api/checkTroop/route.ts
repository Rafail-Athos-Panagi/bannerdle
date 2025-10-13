import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import TroopsData from '@/data/Troops.json';
import type { Troop, TroopStatus } from '@/types/Troop.type';

// Mapping function to normalize faction and culture names
function normalizeFactionAndCulture(data: Record<string, unknown>) {
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
    faction: factionMap[data.faction as string] || data.faction,
    culture: cultureMap[data.culture as string] || data.culture,
    banner: bannerMap[data.banner as string] || data.banner
  } as Record<string, unknown>;
}

interface CheckTroopResponse {
  correct: boolean;
  currentSelection: Troop;
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

    // Find troop data from static JSON
    const troopData: Troop | undefined = (TroopsData as Troop[]).find(
      (troop: Troop) => troop.name.toLowerCase() === queryName.toLowerCase()
    );
    
    if (!troopData) {
      return NextResponse.json(
        { error: "Troop not found" },
        { status: 404 }
      );
    }

    // Get current selection from Supabase
    const { data: currentSelection, error: selectionError } = await supabase
      .from('current_troop_selection')
      .select('*')
      .single();

    if (selectionError && selectionError.code !== 'PGRST116') {
      console.error('Error fetching current selection:', selectionError);
      return NextResponse.json(
        { error: "Failed to fetch current selection" },
        { status: 500 }
      );
    }

    // Validate current selection data structure
    if (!currentSelection.name || !currentSelection.tier || !currentSelection.type) {
      return NextResponse.json(
        { error: "Invalid current selection data structure" },
        { status: 500 }
      );
    }

    // Normalize the current selection data to match Troops.json format
    const normalizedCurrentSelection = normalizeFactionAndCulture(currentSelection);

    const isCorrect: boolean =
      (normalizedCurrentSelection.name as string).toLowerCase() === queryName.toLowerCase();

    // Calculate status for each property with proper validation
    const troopStatus: TroopStatus = {
      ...troopData,
      nameStatus: isCorrect ? "Same" : "Wrong",
      tierStatus: (() => {
        if (troopData.tier === (normalizedCurrentSelection.tier as number)) return "Same";
        return troopData.tier > (normalizedCurrentSelection.tier as number) ? "Higher" : "Lower";
      })(),
      typeStatus: (() => {
        if (troopData.type === (normalizedCurrentSelection.type as string)) return "Same";
        // Check for partial match between Archer and Mounted Archer
        if ((troopData.type === "Archer" && (normalizedCurrentSelection.type as string) === "Mounted Archer") ||
            (troopData.type === "Mounted Archer" && (normalizedCurrentSelection.type as string) === "Archer")) {
          return "Partial";
        }
        return "Wrong";
      })(),
      occupationStatus: troopData.occupation === (normalizedCurrentSelection.occupation as string) ? "Same" : "Wrong",
      factionStatus: troopData.faction === (normalizedCurrentSelection.faction as string) ? "Same" : "Wrong",
      bannerStatus: troopData.banner === (normalizedCurrentSelection.banner as string) ? "Same" : "Wrong",
      cultureStatus: troopData.culture === (normalizedCurrentSelection.culture as string) ? "Same" : "Wrong",
    };

    const responseData: CheckTroopResponse = {
      correct: isCorrect,
      currentSelection: normalizedCurrentSelection as unknown as Troop,
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

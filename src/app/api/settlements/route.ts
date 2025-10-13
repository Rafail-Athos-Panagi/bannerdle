import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Settlement } from '@/types/Settlement.type';

/**
 * Settlements API
 * Provides settlement data for map rendering
 * Settlements are map areas with specific types (town, castle, village)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // town, castle, village
    
    let query = supabase
      .from('map_areas')
      .select('*')
      .order('name');

    // Filter by settlement type if specified
    if (type) {
      query = query.eq('type', type);
    }

    const { data: mapAreas, error } = await query;

    if (error) {
      console.error('Error fetching settlements:', error);
      return NextResponse.json(
        { error: "Failed to fetch settlements" },
        { status: 500 }
      );
    }

    // Convert map areas to settlements format
    const settlements: Settlement[] = (mapAreas || []).map((area, index) => ({
      id: area.id.toString(),
      name: area.name,
      type: area.type as 'town' | 'castle' | 'village',
      faction: area.faction,
      center: area.coordinates as [number, number],
      radius: 20 // Default radius for clickable area
    }));

    return NextResponse.json(settlements);
  } catch (error) {
    console.error("Error in settlements API:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

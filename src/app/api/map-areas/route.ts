import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { MapArea } from '@/types/MapArea.type';

/**
 * Map Areas API
 * Provides access to map areas data from database
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (name) {
      // Get specific map area by name
      const { data: mapArea, error } = await supabase
        .from('map_areas')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { error: "Map area not found" },
            { status: 404 }
          );
        }
        console.error('Error fetching map area:', error);
        return NextResponse.json(
          { error: "Failed to fetch map area" },
          { status: 500 }
        );
      }

      return NextResponse.json(mapArea);
    } else {
      // Get all map areas
      const { data: mapAreas, error } = await supabase
        .from('map_areas')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching map areas:', error);
        return NextResponse.json(
          { error: "Failed to fetch map areas" },
          { status: 500 }
        );
      }

      return NextResponse.json(mapAreas);
    }
  } catch (error) {
    console.error("Error in map areas API:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

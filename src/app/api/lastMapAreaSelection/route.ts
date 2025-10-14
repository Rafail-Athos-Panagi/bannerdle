import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get the second-to-last entry from used_map_areas table (last selection)
    const { data: usedMapAreas, error } = await supabase
      .from('used_map_areas')
      .select('*')
      .order('used_date', { ascending: false })
      .limit(2);

    if (error) {
      console.error('Error fetching last map area selection:', error);
      return NextResponse.json(
        { error: "Failed to retrieve last map area selection" },
        { status: 500 }
      );
    }

    // Return the second entry (last selection) or empty object if not enough entries
    const lastSelection = usedMapAreas && usedMapAreas.length >= 2 ? usedMapAreas[1] : {};
    
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

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ApiResponse {
  error?: string;
  [key: string]: unknown;
}

export async function GET() {
  try {
    // Get the second-to-last entry from used_troops table (last selection)
    const { data: usedTroops, error } = await supabase
      .from('used_troops')
      .select('*')
      .order('used_date', { ascending: false })
      .limit(2);

    if (error) {
      console.error('Error fetching last selection:', error);
      return NextResponse.json(
        { error: "Failed to retrieve lastSelection" },
        { status: 500 }
      );
    }

    // Return the second entry (last selection) or empty object if not enough entries
    const lastSelection = usedTroops && usedTroops.length >= 2 ? usedTroops[1] : {};
    
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

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Troop } from '@/types/Troop.type';

/**
 * Troops API
 * Provides access to troops data from database
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (name) {
      // Get specific troop by name
      const { data: troop, error } = await supabase
        .from('troops')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { error: "Troop not found" },
            { status: 404 }
          );
        }
        console.error('Error fetching troop:', error);
        return NextResponse.json(
          { error: "Failed to fetch troop" },
          { status: 500 }
        );
      }

      return NextResponse.json(troop);
    } else {
      // Get all troops
      const { data: troops, error } = await supabase
        .from('troops')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching troops:', error);
        return NextResponse.json(
          { error: "Failed to fetch troops" },
          { status: 500 }
        );
      }

      return NextResponse.json(troops);
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

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import mapAreasData from '@/data/map_areas.json';
import type { MapArea } from '@/types/MapArea.type';

/**
 * Daily Map Area Selection API
 * This endpoint should be called every 24 hours to select a new map area
 * It ensures the selected map area is not in used_map_areas and properly updates the database
 * Current selection = last entry in used_map_areas table
 * Last selection = second-to-last entry in used_map_areas table
 */
export async function GET() {
  return POST();
}

export async function POST() {
  try {
        console.log(`🚀 [MAP AREA SELECTION] Starting daily map area selection at ${new Date().toISOString()}`);
        console.log(`📅 [MAP AREA SELECTION] Called by: ${process.env.VERCEL ? 'Vercel Cron Job (00:55 UTC daily)' : 'Manual/Development'}`);

    // Get list of used map areas from Supabase
    console.log('🔍 [MAP AREA SELECTION] Fetching used map areas...');
    const { data: usedMapAreas, error: usedError } = await supabase
      .from('used_map_areas')
      .select('name')
      .order('used_date', { ascending: false });

    if (usedError) {
      console.error('Error fetching used map areas:', usedError);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to fetch used map areas" 
        },
        { status: 500 }
      );
    }

    const usedMapAreaNames: string[] = usedMapAreas?.map(a => a.name) || [];
    console.log(`📊 [MAP AREA SELECTION] Found ${usedMapAreaNames.length} used map areas:`, usedMapAreaNames);

    // Filter available map areas from static JSON (exclude used map areas)
    console.log('🎯 [MAP AREA SELECTION] Filtering available map areas...');
    const availableMapAreas: MapArea[] = (mapAreasData as MapArea[]).filter(
      (mapArea: MapArea) => !usedMapAreaNames.includes(mapArea.name)
    );

    console.log(`✅ [MAP AREA SELECTION] Found ${availableMapAreas.length} available map areas`);

    let selectedMapArea: MapArea;

    if (availableMapAreas.length === 0) {
      console.log('🔄 [MAP AREA SELECTION] No available map areas found, resetting used_map_areas table');
      
      // If no map areas available, reset the used_map_areas table to start over
      const { error: resetError } = await supabase
        .from('used_map_areas')
        .delete()
        .neq('id', 0); // Delete all records

      if (resetError) {
        console.error('Error resetting used map areas:', resetError);
        return NextResponse.json(
          { 
            success: false,
            error: "Failed to reset used map areas" 
          },
          { status: 500 }
        );
      }

      // Now select from all map areas
      const randomIndex = Math.floor(Math.random() * (mapAreasData as MapArea[]).length);
      selectedMapArea = (mapAreasData as MapArea[])[randomIndex];
      console.log(`🎲 [MAP AREA SELECTION] Selected map area after reset: ${selectedMapArea.name}`);
    } else {
      // Randomly select one map area from the available ones
      const randomIndex = Math.floor(Math.random() * availableMapAreas.length);
      selectedMapArea = availableMapAreas[randomIndex];
      console.log(`🎲 [MAP AREA SELECTION] Selected map area: ${selectedMapArea.name}`);
    }

    // Add the new map area to used_map_areas table with all attributes
    console.log(`💾 [MAP AREA SELECTION] Adding map area to used_map_areas: ${selectedMapArea.name}`);
    const mapAreaData = {
      name: selectedMapArea.name,
      faction: selectedMapArea.faction,
      type: selectedMapArea.type,
      coordinates: selectedMapArea.coordinates,
      used_date: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('used_map_areas')
      .insert([mapAreaData]);

    if (insertError) {
      console.error('Error adding map area to used_map_areas:', insertError);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to add map area to used_map_areas" 
        },
        { status: 500 }
      );
    }

    console.log(`✅ [MAP AREA SELECTION] Successfully added map area to used_map_areas: ${selectedMapArea.name}`);

    // Get the current selection (last entry) and last selection (second-to-last entry)
    const { data: allUsedMapAreas, error: fetchError } = await supabase
      .from('used_map_areas')
      .select('*')
      .order('used_date', { ascending: false });

    if (fetchError) {
      console.error('❌ [MAP AREA SELECTION] Error fetching all used map areas:', fetchError);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to fetch all used map areas" 
        },
        { status: 500 }
      );
    }

    const currentSelection = allUsedMapAreas?.[0] || null;
    const lastSelection = allUsedMapAreas?.[1] || null;

    console.log(`📋 [MAP AREA SELECTION] Current selection: ${currentSelection?.name || 'None'}`);
    console.log(`📋 [MAP AREA SELECTION] Last selection: ${lastSelection?.name || 'None'}`);
    console.log(`🎉 [MAP AREA SELECTION] Daily map area selection completed successfully!`);

    return NextResponse.json({ 
      success: true, 
      currentSelection: currentSelection,
      lastSelection: lastSelection,
      message: `Daily map area selection completed. New map area: ${selectedMapArea.name}`,
      timestamp: new Date().toISOString(),
      initializeLocalStorage: true
    });

  } catch (error) {
    console.error("Error in daily map area selection:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

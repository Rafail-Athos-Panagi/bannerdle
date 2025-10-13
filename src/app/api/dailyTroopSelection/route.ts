import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Troop } from '@/types/Troop.type';

/**
 * Daily Troop Selection API
 * This endpoint should be called every 24 hours to select a new troop
 * It ensures the selected troop is not in used_troops and properly updates the database
 * Current selection = last entry in used_troops table
 * Last selection = second-to-last entry in used_troops table
 */
export async function GET() {
  return POST();
}

export async function POST() {
  try {
    console.log(`🚀 [TROOP SELECTION] Starting daily troop selection at ${new Date().toISOString()}`);
    console.log(`📅 [TROOP SELECTION] Called by: External Cron Service (15:20 UTC daily)`);

    // Check if selections were already made today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const { data: todaySelections, error: todayError } = await supabase
      .from('used_troops')
      .select('used_date')
      .gte('used_date', `${today}T00:00:00`)
      .lt('used_date', `${today}T23:59:59`);

    if (todayError) {
      console.error('Error checking today\'s selections:', todayError);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to check today's selections" 
        },
        { status: 500 }
      );
    }

    if (todaySelections && todaySelections.length > 0) {
      console.log('✅ [TROOP SELECTION] Selections already made today, skipping');
      return NextResponse.json({
        success: true,
        message: "Selections already made today",
        timestamp: new Date().toISOString()
      });
    }
    console.log('🔍 [TROOP SELECTION] Fetching used troops...');
    const { data: usedTroops, error: usedError } = await supabase
      .from('used_troops')
      .select('name')
      .order('used_date', { ascending: false });

    if (usedError) {
      console.error('Error fetching used troops:', usedError);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to fetch used troops" 
        },
        { status: 500 }
      );
    }

    const usedTroopNames: string[] = usedTroops?.map(t => t.name) || [];
    console.log(`📊 [TROOP SELECTION] Found ${usedTroopNames.length} used troops:`, usedTroopNames);

    // Get all available troops from database
    console.log('🎯 [TROOP SELECTION] Fetching available troops from database...');
    const { data: allTroops, error: troopsError } = await supabase
      .from('troops')
      .select('*');

    if (troopsError) {
      console.error('Error fetching troops from database:', troopsError);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to fetch troops from database" 
        },
        { status: 500 }
      );
    }

    // Filter available troops (exclude used troops)
    const availableTroops: Troop[] = (allTroops as Troop[]).filter(
      (troop: Troop) => !usedTroopNames.includes(troop.name)
    );

    console.log(`✅ [TROOP SELECTION] Found ${availableTroops.length} available troops`);

    let selectedTroop: Troop;

    if (availableTroops.length === 0) {
      console.log('🔄 [TROOP SELECTION] No available troops found, resetting used_troops table');
      
      // If no troops available, reset the used_troops table to start over
      const { error: resetError } = await supabase
        .from('used_troops')
        .delete()
        .neq('id', 0); // Delete all records

      if (resetError) {
        console.error('Error resetting used troops:', resetError);
        return NextResponse.json(
          { 
            success: false,
            error: "Failed to reset used troops" 
          },
          { status: 500 }
        );
      }

      // Now select from all troops in database
      const randomIndex = Math.floor(Math.random() * (allTroops as Troop[]).length);
      selectedTroop = (allTroops as Troop[])[randomIndex];
      console.log(`🎲 [TROOP SELECTION] Selected troop after reset: ${selectedTroop.name}`);
    } else {
      // Randomly select one troop from the available ones
      const randomIndex = Math.floor(Math.random() * availableTroops.length);
      selectedTroop = availableTroops[randomIndex];
      console.log(`🎲 [TROOP SELECTION] Selected troop: ${selectedTroop.name}`);
    }

    // Add the new troop to used_troops table with all attributes
    console.log(`💾 [TROOP SELECTION] Adding troop to used_troops: ${selectedTroop.name}`);
    const troopData = {
      name: selectedTroop.name,
      tier: selectedTroop.tier,
      type: selectedTroop.type,
      occupation: selectedTroop.occupation,
      faction: selectedTroop.faction,
      banner: selectedTroop.banner,
      culture: selectedTroop.culture,
      image: selectedTroop.image,
      used_date: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('used_troops')
      .insert([troopData]);

    if (insertError) {
      console.error('Error adding troop to used_troops:', insertError);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to add troop to used_troops" 
        },
        { status: 500 }
      );
    }

    console.log(`✅ [TROOP SELECTION] Successfully added troop to used_troops: ${selectedTroop.name}`);

    // Get the current selection (last entry) and last selection (second-to-last entry)
    const { data: allUsedTroops, error: fetchError } = await supabase
      .from('used_troops')
      .select('*')
      .order('used_date', { ascending: false });

    if (fetchError) {
      console.error('❌ [TROOP SELECTION] Error fetching all used troops:', fetchError);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to fetch all used troops" 
        },
        { status: 500 }
      );
    }

    const currentSelection = allUsedTroops?.[0] || null;
    const lastSelection = allUsedTroops?.[1] || null;

    console.log(`📋 [TROOP SELECTION] Current selection: ${currentSelection?.name || 'None'}`);
    console.log(`📋 [TROOP SELECTION] Last selection: ${lastSelection?.name || 'None'}`);
    console.log(`🎉 [TROOP SELECTION] Daily troop selection completed successfully!`);

    return NextResponse.json({ 
      success: true, 
      currentSelection: currentSelection,
      lastSelection: lastSelection,
      message: `Daily troop selection completed. New troop: ${selectedTroop.name}`,
      timestamp: new Date().toISOString(),
      initializeLocalStorage: true
    });

  } catch (error) {
    console.error("Error in daily troop selection:", error);
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
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Troop } from '@/types/Troop.type';

/**
 * Manual Troop Selection API (for testing/admin purposes)
 * This endpoint allows manual selection of troops and should be used sparingly
 * The daily selection is handled by dailyTroopSelection.ts
 * Updated to work with new schema using used_troops table
 */
export async function POST() {
  try {
    console.log(`Starting manual troop selection at ${new Date().toISOString()}`);

    // Get list of used troops from Supabase
    const { data: usedTroops, error: usedError } = await supabase
      .from('used_troops')
      .select('name');

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

    // Get all available troops from database
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
    const availableTroops = (allTroops as Troop[]).filter(
      (troop) => !usedTroopNames.includes(troop.name)
    );

    if (availableTroops.length === 0) {
      console.log('No available troops found, resetting used_troops table');
      
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
      const selectedTroop = (allTroops as Troop[])[randomIndex];
      console.log(`Selected troop after reset: ${selectedTroop.name}`);
    } else {
      // Randomly select one troop
      const randomIndex = Math.floor(Math.random() * availableTroops.length);
      const selectedTroop = availableTroops[randomIndex];
      console.log(`Selected troop: ${selectedTroop.name}`);
    }

    // Select the new troop
    const newTroop = availableTroops.length > 0 
      ? availableTroops[Math.floor(Math.random() * availableTroops.length)]
      : (allTroops as Troop[])[Math.floor(Math.random() * (allTroops as Troop[]).length)];

    // Add the new troop to used_troops table with all attributes
    const troopData = {
      name: newTroop.name,
      tier: newTroop.tier,
      type: newTroop.type,
      occupation: newTroop.occupation,
      faction: newTroop.faction,
      banner: newTroop.banner,
      culture: newTroop.culture,
      image: newTroop.image,
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

    console.log(`Successfully added troop to used_troops: ${newTroop.name}`);

    return NextResponse.json({ 
      success: true, 
      troop: newTroop,
      message: `Manual troop selection completed. New troop: ${newTroop.name}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error in manual troop selection:", error);
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
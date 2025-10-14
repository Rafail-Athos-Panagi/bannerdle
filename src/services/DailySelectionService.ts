import { supabase } from '@/lib/supabase';
import type { Troop } from '@/types/Troop.type';
import type { MapArea } from '@/types/MapArea.type';

/**
 * Daily Selection Service
 * Contains the core logic for daily troop and map area selections
 * Can be called directly without HTTP requests to avoid connection issues
 */
export class DailySelectionService {
  
  /**
   * Perform daily troop selection
   */
  static async selectDailyTroop(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log(`🚀 [TROOP SELECTION] Starting daily troop selection at ${new Date().toISOString()}`);

      // Check if selections were already made today
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const { data: todaySelections, error: todayError } = await supabase
        .from('used_troops')
        .select('used_date')
        .gte('used_date', `${today}T00:00:00`)
        .lt('used_date', `${today}T23:59:59`);

      if (todayError) {
        console.error('Error checking today\'s selections:', todayError);
        return { success: false, message: "Failed to check today's selections" };
      }

      if (todaySelections && todaySelections.length > 0) {
        console.log('✅ [TROOP SELECTION] Selections already made today, skipping');
        return {
          success: true,
          message: "Selections already made today",
          data: { timestamp: new Date().toISOString() }
        };
      }

      console.log('🔍 [TROOP SELECTION] Fetching used troops...');
      const { data: usedTroops, error: usedError } = await supabase
        .from('used_troops')
        .select('name')
        .order('used_date', { ascending: false });

      if (usedError) {
        console.error('Error fetching used troops:', usedError);
        return { success: false, message: "Failed to fetch used troops" };
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
        return { success: false, message: "Failed to fetch troops from database" };
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
          return { success: false, message: "Failed to reset used troops" };
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
        return { success: false, message: "Failed to add troop to used_troops" };
      }

      console.log(`✅ [TROOP SELECTION] Successfully added troop to used_troops: ${selectedTroop.name}`);

      // Get the current selection (last entry) and last selection (second-to-last entry)
      const { data: allUsedTroops, error: fetchError } = await supabase
        .from('used_troops')
        .select('*')
        .order('used_date', { ascending: false });

      if (fetchError) {
        console.error('❌ [TROOP SELECTION] Error fetching all used troops:', fetchError);
        return { success: false, message: "Failed to fetch all used troops" };
      }

      const currentSelection = allUsedTroops?.[0] || null;
      const lastSelection = allUsedTroops?.[1] || null;

      console.log(`📋 [TROOP SELECTION] Current selection: ${currentSelection?.name || 'None'}`);
      console.log(`📋 [TROOP SELECTION] Last selection: ${lastSelection?.name || 'None'}`);
      console.log(`🎉 [TROOP SELECTION] Daily troop selection completed successfully!`);

      return {
        success: true,
        message: `Daily troop selection completed. New troop: ${selectedTroop.name}`,
        data: {
          currentSelection: currentSelection,
          lastSelection: lastSelection,
          timestamp: new Date().toISOString(),
          initializeLocalStorage: true
        }
      };

    } catch (error) {
      console.error("Error in daily troop selection:", error);
      return {
        success: false,
        message: "Internal Server Error",
        data: { details: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Perform daily map area selection
   */
  static async selectDailyMapArea(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log(`🚀 [MAP AREA SELECTION] Starting daily map area selection at ${new Date().toISOString()}`);

      // Get list of used map areas from Supabase
      console.log('🔍 [MAP AREA SELECTION] Fetching used map areas...');
      const { data: usedMapAreas, error: usedError } = await supabase
        .from('used_map_areas')
        .select('name')
        .order('used_date', { ascending: false });

      if (usedError) {
        console.error('Error fetching used map areas:', usedError);
        return { success: false, message: "Failed to fetch used map areas" };
      }

      const usedMapAreaNames: string[] = usedMapAreas?.map(a => a.name) || [];
      console.log(`📊 [MAP AREA SELECTION] Found ${usedMapAreaNames.length} used map areas:`, usedMapAreaNames);

      // Get all available map areas from database
      console.log('🎯 [MAP AREA SELECTION] Fetching available map areas from database...');
      const { data: allMapAreas, error: mapAreasError } = await supabase
        .from('map_areas')
        .select('*');

      if (mapAreasError) {
        console.error('Error fetching map areas from database:', mapAreasError);
        return { success: false, message: "Failed to fetch map areas from database" };
      }

      // Filter available map areas (exclude used map areas)
      const availableMapAreas: MapArea[] = (allMapAreas as MapArea[]).filter(
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
          return { success: false, message: "Failed to reset used map areas" };
        }

        // Now select from all map areas in database
        const randomIndex = Math.floor(Math.random() * (allMapAreas as MapArea[]).length);
        selectedMapArea = (allMapAreas as MapArea[])[randomIndex];
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
        return { success: false, message: "Failed to add map area to used_map_areas" };
      }

      console.log(`✅ [MAP AREA SELECTION] Successfully added map area to used_map_areas: ${selectedMapArea.name}`);

      // Get the current selection (last entry) and last selection (second-to-last entry)
      const { data: allUsedMapAreas, error: fetchError } = await supabase
        .from('used_map_areas')
        .select('*')
        .order('used_date', { ascending: false });

      if (fetchError) {
        console.error('❌ [MAP AREA SELECTION] Error fetching all used map areas:', fetchError);
        return { success: false, message: "Failed to fetch all used map areas" };
      }

      const currentSelection = allUsedMapAreas?.[0] || null;
      const lastSelection = allUsedMapAreas?.[1] || null;

      console.log(`📋 [MAP AREA SELECTION] Current selection: ${currentSelection?.name || 'None'}`);
      console.log(`📋 [MAP AREA SELECTION] Last selection: ${lastSelection?.name || 'None'}`);
      console.log(`🎉 [MAP AREA SELECTION] Daily map area selection completed successfully!`);

      return {
        success: true,
        message: `Daily map area selection completed. New map area: ${selectedMapArea.name}`,
        data: {
          currentSelection: currentSelection,
          lastSelection: lastSelection,
          timestamp: new Date().toISOString(),
          initializeLocalStorage: true
        }
      };

    } catch (error) {
      console.error("Error in daily map area selection:", error);
      return {
        success: false,
        message: "Internal Server Error",
        data: { details: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Check if selections were made today
   */
  static async checkSelectionsForToday(today: string): Promise<boolean> {
    try {
      const [troopResponse, mapResponse] = await Promise.all([
        supabase
          .from('used_troops')
          .select('used_date')
          .gte('used_date', `${today}T00:00:00`)
          .lt('used_date', `${today}T23:59:59`),
        supabase
          .from('used_map_areas')
          .select('used_date')
          .gte('used_date', `${today}T00:00:00`)
          .lt('used_date', `${today}T23:59:59`)
      ]);

      const hasTroopSelection = troopResponse.data && troopResponse.data.length > 0;
      const hasMapAreaSelection = mapResponse.data && mapResponse.data.length > 0;

      return Boolean(hasTroopSelection && hasMapAreaSelection);
    } catch (error) {
      console.error('Error checking selections for today:', error);
      return false;
    }
  }
}

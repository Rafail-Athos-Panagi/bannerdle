import { NextResponse } from 'next/server';
import { DailySelectionService } from '@/services/DailySelectionService';

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
    const result = await DailySelectionService.selectDailyMapArea();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        ...result.data,
        message: result.message
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result.message,
          details: result.data?.details
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in daily map area selection API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

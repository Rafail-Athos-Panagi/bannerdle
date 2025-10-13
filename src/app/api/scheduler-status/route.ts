import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "Database Scheduler Control Panel",
    status: "Database-Based Scheduling Active",
    endpoints: {
      scheduler_check: "GET /api/scheduler - Check and trigger due selections",
      manual_trigger: "POST /api/scheduler - Manual trigger for testing",
      troop_selection: "POST /api/dailyTroopSelection - Manual troop selection",
      map_area_selection: "POST /api/dailyMapAreaSelection - Manual map area selection"
    },
    schedule: {
      description: "Database scheduler runs daily selections at 15:37 UTC",
      time: "15:37 UTC (17:37 Cyprus time)",
      troop_selection: "/api/dailyTroopSelection",
      map_area_selection: "/api/dailyMapAreaSelection",
      next_check: "Scheduler checks every minute for due selections"
    },
    note: "Vercel cron jobs have been removed. Use database scheduler instead."
  });
}

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "Scheduler Control Panel",
    status: "Vercel Cron Jobs Only",
    endpoints: {
      troop_selection: "POST /api/dailyTroopSelection - Manual troop selection",
      map_area_selection: "POST /api/dailyMapAreaSelection - Manual map area selection"
    },
    cron_schedule: {
      description: "Vercel cron jobs run automatically at 02:12 UTC daily (05:12 Cyprus time)",
      schedule: "12 2 * * * (UTC time)",
      troop_selection: "/api/dailyTroopSelection",
      map_area_selection: "/api/dailyMapAreaSelection",
      next_run: "Today at 02:12 UTC (05:12 Cyprus time) in about " + getTimeUntilNextRun()
    },
    note: "Local scheduler is disabled. Production uses Vercel cron jobs only."
  });
}

function getTimeUntilNextRun(): string {
  const now = new Date();
  const nextRun = new Date();
  nextRun.setUTCHours(2, 12, 0, 0);
  
  // If it's already past 02:12 today, set for tomorrow
  if (now >= nextRun) {
    nextRun.setUTCDate(nextRun.getUTCDate() + 1);
  }
  
  const diffMs = nextRun.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHours}h ${diffMinutes}m`;
}

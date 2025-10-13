import { NextResponse } from 'next/server';
import SchedulerService from '@/services/SchedulerService';

/**
 * Built-in Scheduler Control API
 * Manages the server-side scheduler
 */
export async function GET() {
  try {
    const scheduler = SchedulerService.getInstance();
    const status = scheduler.getStatus();
    
    return NextResponse.json({
      message: "Built-in Scheduler Control Panel",
      status: status.isRunning ? "Running" : "Stopped",
      nextRun: status.nextRun,
      schedule: "Daily at 15:26 UTC",
      endpoints: {
        start: "POST /api/scheduler-control - Start the scheduler",
        stop: "DELETE /api/scheduler-control - Stop the scheduler",
        status: "GET /api/scheduler-control - Get scheduler status"
      },
      note: "Scheduler runs while the server is active. Restarts automatically when server restarts."
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json(
      { 
        error: "Failed to get scheduler status",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Start the scheduler
 */
export async function POST() {
  try {
    const scheduler = SchedulerService.getInstance();
    scheduler.start();
    
    return NextResponse.json({
      message: "Scheduler started successfully",
      status: "Running",
      schedule: "Daily at 15:37 UTC",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error starting scheduler:', error);
    return NextResponse.json(
      { 
        error: "Failed to start scheduler",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Stop the scheduler
 */
export async function DELETE() {
  try {
    const scheduler = SchedulerService.getInstance();
    scheduler.stop();
    
    return NextResponse.json({
      message: "Scheduler stopped successfully",
      status: "Stopped",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error stopping scheduler:', error);
    return NextResponse.json(
      { 
        error: "Failed to stop scheduler",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

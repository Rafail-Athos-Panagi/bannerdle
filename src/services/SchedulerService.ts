import cron from 'node-cron';

/**
 * Built-in Scheduler Service
 * Runs daily selections at 15:00 UTC while the server is active
 */
class SchedulerService {
  private static instance: SchedulerService;
  private static isInitialized = false;
  private isRunning = false;

  private constructor() {
    if (SchedulerService.isInitialized) {
      throw new Error('SchedulerService is a singleton. Use getInstance() instead.');
    }
    SchedulerService.isInitialized = true;
  }

  static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  private cronJob: any = null;
  private isExecuting: boolean = false;
  private lastExecutionDate: string | null = null;

  /**
   * Start the scheduler
   * Runs daily at 15:26 UTC (3:26 PM UTC)
   */
  start(): void {
    if (this.isRunning) {
      console.log('🔄 [SCHEDULER] Already running');
      return;
    }

    // Stop any existing cron job first
    if (this.cronJob) {
      this.cronJob.destroy();
      this.cronJob = null;
    }

    console.log('🚀 [SCHEDULER] Starting built-in scheduler...');
    console.log('⏰ [SCHEDULER] Will run daily selections at 15:26 UTC');

    // Schedule daily selections at 15:26 UTC
    // Cron format: minute hour day month dayOfWeek
    // '26 15 * * *' = At 15:26 UTC every day
    this.cronJob = cron.schedule('26 15 * * *', async () => {
      console.log('🕐 [SCHEDULER] 15:26 UTC reached - triggering daily selections');
      await this.triggerDailySelections();
    }, {
      timezone: "UTC"
    });

    // Also run immediately if it's past 15:26 UTC today and no selections made
    this.checkAndRunIfNeeded();

    this.isRunning = true;
    console.log('✅ [SCHEDULER] Built-in scheduler started successfully');
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (this.cronJob) {
      this.cronJob.destroy();
      this.cronJob = null;
    }
    this.isRunning = false;
    this.isExecuting = false;
    this.lastExecutionDate = null; // Reset execution tracking
    console.log('🛑 [SCHEDULER] Built-in scheduler stopped');
  }

  /**
   * Check if selections need to be run and run them if needed
   */
  private async checkAndRunIfNeeded(): Promise<void> {
    try {
      const now = new Date();
      const currentHour = now.getUTCHours();
      const currentMinute = now.getUTCMinutes();
      
      // If it's past 15:26 UTC today
      if (currentHour > 15 || (currentHour === 15 && currentMinute >= 26)) {
        console.log('🔍 [SCHEDULER] Checking if selections were made today...');
        await this.triggerDailySelections();
      }
    } catch (error) {
      console.error('❌ [SCHEDULER] Error checking if selections needed:', error);
    }
  }

  /**
   * Trigger daily selections
   */
  private async triggerDailySelections(): Promise<void> {
    // Prevent multiple simultaneous executions
    if (this.isExecuting) {
      console.log('⏭️ [SCHEDULER] Already executing, skipping...');
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if we already executed today using local tracking
    if (this.lastExecutionDate === today) {
      console.log('⏭️ [SCHEDULER] Already executed today, skipping...');
      return;
    }

    this.isExecuting = true;
    
    try {
      // Double-check with database to prevent duplicates
      const hasSelectionsToday = await this.checkSelectionsForToday(today);
      
      if (hasSelectionsToday) {
        console.log('⏭️ [SCHEDULER] Selections already made today, skipping...');
        this.lastExecutionDate = today; // Update local tracking
        return;
      }

      console.log('🎯 [SCHEDULER] Triggering daily troop selection...');
      
      // Trigger troop selection
      const troopResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/dailyTroopSelection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const troopResult = await troopResponse.json();
      console.log('📊 [SCHEDULER] Troop selection result:', troopResult.success ? '✅ Success' : '❌ Failed');

      console.log('🗺️ [SCHEDULER] Triggering daily map area selection...');
      
      // Trigger map area selection
      const mapResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/dailyMapAreaSelection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const mapResult = await mapResponse.json();
      console.log('📊 [SCHEDULER] Map area selection result:', mapResult.success ? '✅ Success' : '❌ Failed');

      console.log('🎉 [SCHEDULER] Daily selections completed!');
      
    } catch (error) {
      console.error('❌ [SCHEDULER] Error triggering daily selections:', error);
    } finally {
      this.isExecuting = false;
      this.lastExecutionDate = today; // Mark as executed for today
    }
  }

  private async checkSelectionsForToday(today: string): Promise<boolean> {
    try {
      // Check both troop and map area selections for today
      const [troopResponse, mapResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/lastSelection`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/lastMapAreaSelection`)
      ]);

      if (!troopResponse.ok || !mapResponse.ok) return false;
      
      const [troopData, mapData] = await Promise.all([
        troopResponse.json(),
        mapResponse.json()
      ]);

      // Check if both have selections for today
      const troopHasToday = troopData.lastSelection?.used_date && 
        new Date(troopData.lastSelection.used_date).toISOString().split('T')[0] === today;
      
      const mapHasToday = mapData.lastSelection?.used_date && 
        new Date(mapData.lastSelection.used_date).toISOString().split('T')[0] === today;

      return troopHasToday && mapHasToday;
    } catch (error) {
      console.error('❌ [SCHEDULER] Error checking selections for today:', error);
      return false;
    }
  }

  /**
   * Get scheduler status
   */
  getStatus(): { isRunning: boolean; nextRun: string } {
    const now = new Date();
    const nextRun = new Date();
    nextRun.setUTCHours(15, 26, 0, 0);
    
    // If it's already past 15:26 today, set for tomorrow
    if (nextRun <= now) {
      nextRun.setUTCDate(nextRun.getUTCDate() + 1);
    }

    return {
      isRunning: this.isRunning,
      nextRun: nextRun.toISOString()
    };
  }
}

export default SchedulerService;

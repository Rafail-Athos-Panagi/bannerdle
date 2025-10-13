import SchedulerService from '@/services/SchedulerService';

/**
 * Auto-start the scheduler when the server starts
 * This runs when the module is imported
 */
console.log('🚀 [STARTUP] Initializing built-in scheduler...');

// Start the scheduler automatically
const scheduler = SchedulerService.getInstance();
scheduler.start();

// Log startup completion
console.log('✅ [STARTUP] Built-in scheduler initialized');
console.log('⏰ [STARTUP] Daily selections will run at 15:26 UTC');
console.log('🌐 [STARTUP] Server is ready with automatic scheduling');

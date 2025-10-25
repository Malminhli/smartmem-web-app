/**
 * Scheduler Service
 * Handles scheduled tasks like daily summaries and reminders
 */

export interface ScheduledTask {
  id: string;
  name: string;
  interval: number; // in milliseconds
  handler: () => Promise<void>;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

class Scheduler {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private tasks: Map<string, ScheduledTask> = new Map();

  /**
   * Schedule a task with interval
   */
  scheduleTask(task: ScheduledTask): void {
    try {
      if (this.intervals.has(task.id)) {
        console.warn(`[Scheduler] Task already scheduled: ${task.id}`);
        return;
      }

      const intervalId = setInterval(async () => {
        try {
          console.log(`[Scheduler] Running task: ${task.name}`);
          await task.handler();
          task.lastRun = new Date();
          task.nextRun = new Date(Date.now() + task.interval);
          console.log(`[Scheduler] Task completed: ${task.name}`);
        } catch (error) {
          console.error(`[Scheduler] Task failed: ${task.name}`, error);
        }
      }, task.interval);

      this.intervals.set(task.id, intervalId);
      this.tasks.set(task.id, task);

      if (!task.isActive) {
        clearInterval(intervalId);
        this.intervals.delete(task.id);
      }

      console.log(`[Scheduler] Task scheduled: ${task.name} (every ${task.interval}ms)`);
    } catch (error) {
      console.error(`[Scheduler] Failed to schedule task: ${task.name}`, error);
      throw error;
    }
  }

  /**
   * Schedule a task with cron-like expression (simplified)
   */
  scheduleTaskDaily(task: ScheduledTask, timeStr: string): void {
    // Parse time string (HH:mm format)
    const [hours, minutes] = timeStr.split(":").map(Number);

    // Calculate delay until next scheduled time
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If scheduled time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delayMs = scheduledTime.getTime() - now.getTime();

    // Schedule first run
    setTimeout(async () => {
      try {
        console.log(`[Scheduler] Running daily task: ${task.name}`);
        await task.handler();
        task.lastRun = new Date();
        console.log(`[Scheduler] Daily task completed: ${task.name}`);
      } catch (error) {
        console.error(`[Scheduler] Daily task failed: ${task.name}`, error);
      }

      // Schedule recurring runs (24 hours = 86400000ms)
      this.scheduleTask({
        ...task,
        interval: 24 * 60 * 60 * 1000,
      });
    }, delayMs);

    console.log(`[Scheduler] Daily task scheduled: ${task.name} at ${timeStr}`);
  }

  /**
   * Start a scheduled task
   */
  startTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task && !task.isActive) {
      task.isActive = true;
      const interval = setInterval(async () => {
        try {
          console.log(`[Scheduler] Running task: ${task.name}`);
          await task.handler();
          task.lastRun = new Date();
          console.log(`[Scheduler] Task completed: ${task.name}`);
        } catch (error) {
          console.error(`[Scheduler] Task failed: ${task.name}`, error);
        }
      }, task.interval);

      this.intervals.set(taskId, interval);
      console.log(`[Scheduler] Task started: ${taskId}`);
    }
  }

  /**
   * Stop a scheduled task
   */
  stopTask(taskId: string): void {
    const intervalId = this.intervals.get(taskId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(taskId);

      const task = this.tasks.get(taskId);
      if (task) {
        task.isActive = false;
      }
      console.log(`[Scheduler] Task stopped: ${taskId}`);
    }
  }

  /**
   * Remove a scheduled task
   */
  removeTask(taskId: string): void {
    const intervalId = this.intervals.get(taskId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(taskId);
    }
    this.tasks.delete(taskId);
    console.log(`[Scheduler] Task removed: ${taskId}`);
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): ScheduledTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Stop all tasks
   */
  stopAll(): void {
    const entries = Array.from(this.intervals.entries());
    for (const [taskId, intervalId] of entries) {
      clearInterval(intervalId);
      const task = this.tasks.get(taskId);
      if (task) {
        task.isActive = false;
      }
    }
    this.intervals.clear();
    console.log("[Scheduler] All tasks stopped");
  }
}

// Export singleton instance
export const scheduler = new Scheduler();

/**
 * Common intervals
 */
export const INTERVALS = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
};

/**
 * Initialize default scheduled tasks
 */
export async function initializeScheduler(): Promise<void> {
  console.log("[Scheduler] Initializing scheduler...");

  // TODO: Add default tasks
  // Example:
  // scheduler.scheduleTaskDaily({
  //   id: "daily-summary",
  //   name: "Generate Daily Summaries",
  //   interval: INTERVALS.ONE_DAY,
  //   handler: async () => {
  //     // Generate daily summaries for all users
  //   },
  //   isActive: true,
  // }, "00:00");

  console.log("[Scheduler] Scheduler initialized");
}

/**
 * Shutdown scheduler gracefully
 */
export async function shutdownScheduler(): Promise<void> {
  console.log("[Scheduler] Shutting down scheduler...");
  scheduler.stopAll();
  console.log("[Scheduler] Scheduler shut down");
}


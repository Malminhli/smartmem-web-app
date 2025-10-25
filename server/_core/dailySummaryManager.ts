import { generateDailySummary } from "./summaryGenerator";

/**
 * Daily Summary Manager
 * Manages the creation and storage of daily summaries
 */

export interface DailySummaryJob {
  userId: string;
  date: string; // YYYY-MM-DD
  createdAt: Date;
  completedAt?: Date;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

class DailySummaryManager {
  private jobs: Map<string, DailySummaryJob> = new Map();

  /**
   * Create a daily summary for a user
   */
  async createDailySummary(userId: string, date: string): Promise<void> {
    const jobId = `${userId}_${date}`;

    try {
      // Check if job already exists
      if (this.jobs.has(jobId)) {
        const existingJob = this.jobs.get(jobId);
        if (existingJob?.status === "completed") {
          console.log(`[DailySummary] Summary already exists for ${jobId}`);
          return;
        }
      }

      // Create job
      const job: DailySummaryJob = {
        userId,
        date,
        createdAt: new Date(),
        status: "processing",
      };

      this.jobs.set(jobId, job);

      // TODO: Fetch entries for the date
      // const entries = await getEntriesForDate(userId, date);

      // TODO: Generate summary
      // const summary = generateDailySummary({
      //   entries,
      //   date,
      //   language: "ar",
      // });

      // TODO: Save summary to database
      // await saveDailySummary(userId, summary);

      // Mark job as completed
      job.status = "completed";
      job.completedAt = new Date();

      console.log(`[DailySummary] Summary created for ${jobId}`);
    } catch (error) {
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = "failed";
        job.error = error instanceof Error ? error.message : "Unknown error";
      }
      console.error(`[DailySummary] Failed to create summary for ${jobId}:`, error);
      throw error;
    }
  }

  /**
   * Create summaries for all users
   */
  async createSummariesForAllUsers(date: string): Promise<void> {
    console.log(`[DailySummary] Creating summaries for all users for ${date}`);

    try {
      // TODO: Get all active users
      // const users = await getAllActiveUsers();

      // for (const user of users) {
      //   try {
      //     await this.createDailySummary(user.id, date);
      //   } catch (error) {
      //     console.error(`[DailySummary] Failed for user ${user.id}:`, error);
      //   }
      // }

      console.log(`[DailySummary] Completed creating summaries for ${date}`);
    } catch (error) {
      console.error(`[DailySummary] Failed to create summaries for ${date}:`, error);
      throw error;
    }
  }

  /**
   * Get job status
   */
  getJobStatus(userId: string, date: string): DailySummaryJob | undefined {
    const jobId = `${userId}_${date}`;
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs for a user
   */
  getJobsForUser(userId: string): DailySummaryJob[] {
    return Array.from(this.jobs.values()).filter(job => job.userId === userId);
  }

  /**
   * Get pending jobs
   */
  getPendingJobs(): DailySummaryJob[] {
    return Array.from(this.jobs.values()).filter(job => job.status === "pending");
  }

  /**
   * Retry failed jobs
   */
  async retryFailedJobs(): Promise<void> {
    const failedJobs = Array.from(this.jobs.values()).filter(
      job => job.status === "failed"
    );

    console.log(`[DailySummary] Retrying ${failedJobs.length} failed jobs`);

    for (const job of failedJobs) {
      try {
        await this.createDailySummary(job.userId, job.date);
      } catch (error) {
        console.error(
          `[DailySummary] Retry failed for ${job.userId}_${job.date}:`,
          error
        );
      }
    }
  }

  /**
   * Clear old jobs
   */
  clearOldJobs(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    let deletedCount = 0;
    const entries = Array.from(this.jobs.entries());
    for (const [jobId, job] of entries) {
      if (job.completedAt && job.completedAt < cutoffDate) {
        this.jobs.delete(jobId);
        deletedCount++;
      }
    }

    console.log(`[DailySummary] Cleared ${deletedCount} old jobs`);
  }
}

// Export singleton instance
export const dailySummaryManager = new DailySummaryManager();

/**
 * Initialize daily summary generation
 */
export async function initializeDailySummaryGeneration(): Promise<void> {
  console.log("[DailySummary] Initializing daily summary generation...");

  // TODO: Schedule daily summary generation at midnight
  // scheduler.scheduleTaskDaily({
  //   id: "daily-summary-generation",
  //   name: "Generate Daily Summaries",
  //   interval: 24 * 60 * 60 * 1000,
  //   handler: async () => {
  //     const today = new Date().toISOString().split("T")[0];
  //     await dailySummaryManager.createSummariesForAllUsers(today);
  //   },
  //   isActive: true,
  // }, "00:00");

  console.log("[DailySummary] Daily summary generation initialized");
}


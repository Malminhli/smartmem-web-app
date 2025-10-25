import { shouldTriggerReminder, getNextTriggerTime } from "./notificationService";

/**
 * Reminder Manager
 * Manages reminders and sends notifications when they trigger
 */

export interface ReminderTriggerEvent {
  reminderId: string;
  userId: string;
  triggeredAt: Date;
  nextTrigger?: Date;
}

class ReminderManager {
  private activeReminders: Map<string, any> = new Map();
  private triggerHistory: ReminderTriggerEvent[] = [];

  /**
   * Register a reminder for monitoring
   */
  registerReminder(reminder: any): void {
    if (reminder.isActive) {
      this.activeReminders.set(reminder.id, reminder);
      console.log(`[ReminderManager] Reminder registered: ${reminder.id}`);
    }
  }

  /**
   * Unregister a reminder
   */
  unregisterReminder(reminderId: string): void {
    this.activeReminders.delete(reminderId);
    console.log(`[ReminderManager] Reminder unregistered: ${reminderId}`);
  }

  /**
   * Check all active reminders and trigger if needed
   */
  async checkReminders(): Promise<ReminderTriggerEvent[]> {
    const triggeredReminders: ReminderTriggerEvent[] = [];
    const now = new Date();

    const reminders = Array.from(this.activeReminders.values());
    for (const reminder of reminders) {
      try {
        if (shouldTriggerReminder(reminder, now)) {
          const event: ReminderTriggerEvent = {
            reminderId: reminder.id,
            userId: reminder.userId,
            triggeredAt: now,
            nextTrigger: getNextTriggerTime(reminder, now),
          };

          triggeredReminders.push(event);
          this.triggerHistory.push(event);

          // TODO: Send notification to user
          // await notifyUser(reminder.userId, {
          //   title: reminder.title,
          //   content: reminder.description,
          //   type: "reminder",
          // });

          console.log(
            `[ReminderManager] Reminder triggered: ${reminder.id} for user ${reminder.userId}`
          );
        }
      } catch (error) {
        console.error(`[ReminderManager] Error checking reminder ${reminder.id}:`, error);
      }
    }

    return triggeredReminders;
  }

  /**
   * Get all active reminders
   */
  getActiveReminders(): any[] {
    return Array.from(this.activeReminders.values());
  }

  /**
   * Get reminders for a user
   */
  getRemindersForUser(userId: string): any[] {
    return Array.from(this.activeReminders.values()).filter(
      reminder => reminder.userId === userId
    );
  }

  /**
   * Get trigger history
   */
  getTriggerHistory(limit: number = 100): ReminderTriggerEvent[] {
    return this.triggerHistory.slice(-limit);
  }

  /**
   * Get trigger history for a user
   */
  getTriggerHistoryForUser(userId: string, limit: number = 50): ReminderTriggerEvent[] {
    return this.triggerHistory
      .filter(event => event.userId === userId)
      .slice(-limit);
  }

  /**
   * Clear old trigger history
   */
  clearOldHistory(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const beforeCount = this.triggerHistory.length;
    this.triggerHistory = this.triggerHistory.filter(
      event => event.triggeredAt > cutoffDate
    );
    const deletedCount = beforeCount - this.triggerHistory.length;

    console.log(`[ReminderManager] Cleared ${deletedCount} old trigger events`);
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    activeReminders: number;
    totalTriggered: number;
    triggeredToday: number;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const triggeredToday = this.triggerHistory.filter(
      event => new Date(event.triggeredAt) >= today
    ).length;

    return {
      activeReminders: this.activeReminders.size,
      totalTriggered: this.triggerHistory.length,
      triggeredToday,
    };
  }
}

// Export singleton instance
export const reminderManager = new ReminderManager();

/**
 * Initialize reminder checking
 */
export async function initializeReminderChecking(checkIntervalMs: number = 60000): Promise<void> {
  console.log("[ReminderManager] Initializing reminder checking...");

  // Check reminders every minute
  setInterval(async () => {
    try {
      const triggered = await reminderManager.checkReminders();
      if (triggered.length > 0) {
        console.log(`[ReminderManager] ${triggered.length} reminders triggered`);
      }
    } catch (error) {
      console.error("[ReminderManager] Error during reminder check:", error);
    }
  }, checkIntervalMs);

  console.log("[ReminderManager] Reminder checking initialized");
}

/**
 * Shutdown reminder manager
 */
export async function shutdownReminderManager(): Promise<void> {
  console.log("[ReminderManager] Shutting down reminder manager...");
  // Cleanup if needed
  console.log("[ReminderManager] Reminder manager shut down");
}


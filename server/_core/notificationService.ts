/**
 * Notification & Reminder Service
 * Handles scheduling and sending notifications
 */

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  scheduleTime: string; // HH:mm format
  frequency: "daily" | "weekly" | "monthly" | "once";
  daysOfWeek?: number[]; // 0-6 for weekly
  label?: string;
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: "reminder" | "alert" | "summary" | "info";
  priority: "low" | "medium" | "high";
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Check if a reminder should trigger
 */
export function shouldTriggerReminder(reminder: Reminder, currentTime: Date): boolean {
  const [hours, minutes] = reminder.scheduleTime.split(":").map(Number);
  const reminderTime = new Date(currentTime);
  reminderTime.setHours(hours, minutes, 0, 0);

  // Check if current time matches reminder time (within 1 minute window)
  const timeDiff = Math.abs(currentTime.getTime() - reminderTime.getTime());
  if (timeDiff > 60000) {
    return false;
  }

  // Check frequency
  switch (reminder.frequency) {
    case "daily":
      return true;

    case "weekly":
      if (!reminder.daysOfWeek) return false;
      return reminder.daysOfWeek.includes(currentTime.getDay());

    case "monthly":
      // Check if it's the same day of month
      const reminderDate = new Date(reminder.createdAt);
      return currentTime.getDate() === reminderDate.getDate();

    case "once":
      // Check if it hasn't been triggered yet
      return !reminder.lastTriggered;

    default:
      return false;
  }
}

/**
 * Create a notification from a reminder
 */
export function createNotificationFromReminder(reminder: Reminder): Notification {
  return {
    id: `notif_${Date.now()}`,
    userId: reminder.userId,
    title: reminder.title,
    content: reminder.description || "",
    type: "reminder",
    priority: reminder.label === "emergency" ? "high" : "medium",
    isRead: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
  };
}

/**
 * Format reminder for display
 */
export function formatReminder(reminder: Reminder, language: string = "ar"): string {
  const timeStr = reminder.scheduleTime;
  const freqLabels: Record<string, Record<string, string>> = {
    ar: {
      daily: "يومي",
      weekly: "أسبوعي",
      monthly: "شهري",
      once: "مرة واحدة",
    },
    en: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      once: "Once",
    },
  };

  const freq = freqLabels[language]?.[reminder.frequency] || reminder.frequency;
  return `${reminder.title} - ${timeStr} (${freq})`;
}

/**
 * Get next trigger time for a reminder
 */
export function getNextTriggerTime(reminder: Reminder, from: Date = new Date()): Date {
  const [hours, minutes] = reminder.scheduleTime.split(":").map(Number);
  const nextTime = new Date(from);
  nextTime.setHours(hours, minutes, 0, 0);

  // If the time has already passed today, move to tomorrow
  if (nextTime <= from) {
    nextTime.setDate(nextTime.getDate() + 1);
  }

  // For weekly reminders, find the next matching day
  if (reminder.frequency === "weekly" && reminder.daysOfWeek) {
    while (!reminder.daysOfWeek.includes(nextTime.getDay())) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
  }

  return nextTime;
}

/**
 * Validate reminder
 */
export function validateReminder(reminder: Reminder): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!reminder.title || reminder.title.trim().length === 0) {
    issues.push("Reminder title is required");
  }

  if (!/^\d{2}:\d{2}$/.test(reminder.scheduleTime)) {
    issues.push("Invalid schedule time format (use HH:mm)");
  }

  if (reminder.frequency === "weekly" && (!reminder.daysOfWeek || reminder.daysOfWeek.length === 0)) {
    issues.push("Weekly reminders must have at least one day selected");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Check for overdue reminders
 */
export function getOverdueReminders(reminders: Reminder[]): Reminder[] {
  const now = new Date();
  const overdueWindow = 60 * 60 * 1000; // 1 hour

  return reminders.filter(reminder => {
    if (!reminder.isActive) return false;

    const nextTrigger = getNextTriggerTime(reminder, new Date(now.getTime() - overdueWindow));
    return nextTrigger <= now && shouldTriggerReminder(reminder, now);
  });
}

/**
 * Format notification for display
 */
export function formatNotification(notification: Notification, language: string = "ar"): string {
  const typeLabels: Record<string, Record<string, string>> = {
    ar: {
      reminder: "تذكير",
      alert: "تنبيه",
      summary: "ملخص",
      info: "معلومة",
    },
    en: {
      reminder: "Reminder",
      alert: "Alert",
      summary: "Summary",
      info: "Info",
    },
  };

  const type = typeLabels[language]?.[notification.type] || notification.type;
  return `[${type}] ${notification.title}`;
}


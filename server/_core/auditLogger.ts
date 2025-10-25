/**
 * Audit Logger
 * Logs all user activities for security and compliance
 */

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, any>;
  status: "success" | "failure";
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  duration?: number; // in milliseconds
}

export enum AuditAction {
  // Authentication
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  FAILED_LOGIN = "FAILED_LOGIN",

  // Data operations
  CREATE_ENTRY = "CREATE_ENTRY",
  UPDATE_ENTRY = "UPDATE_ENTRY",
  DELETE_ENTRY = "DELETE_ENTRY",
  VIEW_ENTRY = "VIEW_ENTRY",
  SEARCH_ENTRIES = "SEARCH_ENTRIES",

  // Reminders
  CREATE_REMINDER = "CREATE_REMINDER",
  UPDATE_REMINDER = "UPDATE_REMINDER",
  DELETE_REMINDER = "DELETE_REMINDER",

  // Contacts
  ADD_CONTACT = "ADD_CONTACT",
  REMOVE_CONTACT = "REMOVE_CONTACT",
  SHARE_DATA = "SHARE_DATA",

  // Settings
  UPDATE_SETTINGS = "UPDATE_SETTINGS",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
  ENABLE_2FA = "ENABLE_2FA",
  DISABLE_2FA = "DISABLE_2FA",

  // Privacy
  REQUEST_DATA_EXPORT = "REQUEST_DATA_EXPORT",
  REQUEST_DATA_DELETION = "REQUEST_DATA_DELETION",
  REVOKE_CONSENT = "REVOKE_CONSENT",

  // Admin
  ADMIN_ACCESS = "ADMIN_ACCESS",
  ADMIN_MODIFY_USER = "ADMIN_MODIFY_USER",
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs: number = 10000; // Keep last 10k logs in memory

  /**
   * Log an action
   */
  log(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.logs.push(auditEntry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console for debugging
    console.log(
      `[Audit] ${auditEntry.action} - User: ${auditEntry.userId} - Status: ${auditEntry.status}`
    );

    // TODO: Persist to database
    // await persistAuditLog(auditEntry);

    return auditEntry;
  }

  /**
   * Get logs for a user
   */
  getUserLogs(userId: string, limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get logs for a specific action
   */
  getActionLogs(action: AuditAction, limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.action === action)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get logs for a resource
   */
  getResourceLogs(
    resourceType: string,
    resourceId: string,
    limit: number = 100
  ): AuditLogEntry[] {
    return this.logs
      .filter(log => log.resourceType === resourceType && log.resourceId === resourceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get logs in a date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date, limit: number = 1000): AuditLogEntry[] {
    return this.logs
      .filter(log => log.timestamp >= startDate && log.timestamp <= endDate)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get failed operations
   */
  getFailedOperations(userId?: string, limit: number = 100): AuditLogEntry[] {
    let filtered = this.logs.filter(log => log.status === "failure");

    if (userId) {
      filtered = filtered.filter(log => log.userId === userId);
    }

    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get suspicious activities
   */
  getSuspiciousActivities(limit: number = 100): AuditLogEntry[] {
    // Find patterns that might indicate suspicious activity
    const failedLogins = this.logs.filter(log => log.action === AuditAction.FAILED_LOGIN);

    // Group by user and IP
    const suspiciousPatterns: AuditLogEntry[] = [];

    // Find users with multiple failed login attempts
    const userFailedAttempts: Record<string, number> = {};
    for (const log of failedLogins) {
      userFailedAttempts[log.userId] = (userFailedAttempts[log.userId] || 0) + 1;
    }

    // Add logs from users with 5+ failed attempts
    for (const log of failedLogins) {
      if (userFailedAttempts[log.userId] >= 5) {
        suspiciousPatterns.push(log);
      }
    }

    return suspiciousPatterns.slice(0, limit);
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalLogs: number;
    totalUsers: number;
    successfulOperations: number;
    failedOperations: number;
    suspiciousActivities: number;
  } {
    const users = new Set(this.logs.map(log => log.userId));
    const successful = this.logs.filter(log => log.status === "success").length;
    const failed = this.logs.filter(log => log.status === "failure").length;
    const suspicious = this.getSuspiciousActivities().length;

    return {
      totalLogs: this.logs.length,
      totalUsers: users.size,
      successfulOperations: successful,
      failedOperations: failed,
      suspiciousActivities: suspicious,
    };
  }

  /**
   * Clear old logs
   */
  clearOldLogs(daysToKeep: number = 90): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const beforeCount = this.logs.length;
    this.logs = this.logs.filter(log => log.timestamp > cutoffDate);
    const deletedCount = beforeCount - this.logs.length;

    console.log(`[Audit] Cleared ${deletedCount} old audit logs`);
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();

/**
 * Initialize audit logging
 */
export async function initializeAuditLogging(): Promise<void> {
  console.log("[Audit] Initializing audit logging...");

  // Schedule periodic cleanup
  setInterval(() => {
    auditLogger.clearOldLogs(90); // Keep 90 days of logs
  }, 24 * 60 * 60 * 1000); // Every 24 hours

  console.log("[Audit] Audit logging initialized");
}


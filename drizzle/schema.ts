import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  json,
  int,
  boolean,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow
 */
export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin", "caregiver"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow(),
    language: varchar("language", { length: 10 }).default("ar"),
    privacyConsent: boolean("privacyConsent").default(false),
    dataRetentionDays: int("dataRetentionDays").default(90),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Entries table - stores daily notes (audio, image, text)
 */
export const entries = mysqlTable(
  "entries",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }).notNull(),
    type: mysqlEnum("type", ["audio", "image", "text"]).notNull(),
    rawPath: text("rawPath"),
    transcript: text("transcript"),
    labels: json("labels").$type<string[]>().default([]),
    timestamp: timestamp("timestamp").defaultNow(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("userId_idx").on(table.userId),
    timestampIdx: index("timestamp_idx").on(table.timestamp),
  })
);

export type Entry = typeof entries.$inferSelect;
export type InsertEntry = typeof entries.$inferInsert;

/**
 * Events table - tracks reminders and system events
 */
export const events = mysqlTable(
  "events",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }).notNull(),
    eventType: mysqlEnum("eventType", [
      "reminder",
      "taken",
      "missed",
      "alert",
      "notification",
    ]).notNull(),
    relatedEntryId: varchar("relatedEntryId", { length: 64 }),
    status: mysqlEnum("status", ["pending", "done", "failed", "dismissed"]).default("pending"),
    scheduledTime: timestamp("scheduledTime"),
    completedTime: timestamp("completedTime"),
    details: json("details").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("event_userId_idx").on(table.userId),
  })
);

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Reminders table - stores reminder rules and schedules
 */
export const reminders = mysqlTable(
  "reminders",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    label: varchar("label", { length: 100 }),
    reminderType: mysqlEnum("reminderType", [
      "time_based",
      "context_based",
      "recurring",
    ]).default("time_based"),
    scheduleTime: varchar("scheduleTime", { length: 10 }),
    frequency: mysqlEnum("frequency", [
      "once",
      "daily",
      "weekly",
      "monthly",
    ]).default("daily"),
    daysOfWeek: json("daysOfWeek").$type<number[]>(),
    conditions: json("conditions").$type<Record<string, unknown>>(),
    notificationMethod: mysqlEnum("notificationMethod", [
      "sound",
      "text",
      "both",
    ]).default("both"),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("reminder_userId_idx").on(table.userId),
  })
);

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = typeof reminders.$inferInsert;

/**
 * Trusted contacts - family members or caregivers
 */
export const trustedContacts = mysqlTable(
  "trustedContacts",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    relationship: varchar("relationship", { length: 100 }),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 20 }),
    notifyOnAlert: boolean("notifyOnAlert").default(true),
    canViewEntries: boolean("canViewEntries").default(false),
    canManageReminders: boolean("canManageReminders").default(false),
    verificationToken: varchar("verificationToken", { length: 255 }),
    isVerified: boolean("isVerified").default(false),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("contact_userId_idx").on(table.userId),
  })
);

export type TrustedContact = typeof trustedContacts.$inferSelect;
export type InsertTrustedContact = typeof trustedContacts.$inferInsert;

/**
 * Daily summaries - AI-generated summaries of daily entries
 */
export const dailySummaries = mysqlTable(
  "dailySummaries",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(),
    summary: text("summary"),
    events: json("events").$type<Record<string, unknown>[]>(),
    keywordCounts: json("keywordCounts").$type<Record<string, number>>(),
    generatedAt: timestamp("generatedAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({
    userDateIdx: index("user_date_idx").on(table.userId, table.date),
  })
);

export type DailySummary = typeof dailySummaries.$inferSelect;
export type InsertDailySummary = typeof dailySummaries.$inferInsert;

/**
 * Audit logs - track all actions for security
 */
export const auditLogs = mysqlTable(
  "auditLogs",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }),
    actionType: varchar("actionType", { length: 100 }).notNull(),
    resourceType: varchar("resourceType", { length: 100 }),
    resourceId: varchar("resourceId", { length: 64 }),
    details: json("details").$type<Record<string, unknown>>(),
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: text("userAgent"),
    status: mysqlEnum("status", ["success", "failure"]).default("success"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("audit_userId_idx").on(table.userId),
    actionTypeIdx: index("actionType_idx").on(table.actionType),
  })
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Classification labels - predefined categories for entries
 */
export const classificationLabels = mysqlTable(
  "classificationLabels",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }).notNull(),
    label: varchar("label", { length: 100 }).notNull(),
    arabicName: varchar("arabicName", { length: 100 }).notNull(),
    color: varchar("color", { length: 7 }).default("#3B82F6"),
    icon: varchar("icon", { length: 50 }),
    isDefault: boolean("isDefault").default(false),
    usageCount: int("usageCount").default(0),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    userLabelIdx: index("user_label_idx").on(table.userId, table.label),
  })
);

export type ClassificationLabel = typeof classificationLabels.$inferSelect;
export type InsertClassificationLabel = typeof classificationLabels.$inferInsert;

/**
 * Embeddings cache - for semantic search
 */
export const embeddings = mysqlTable(
  "embeddings",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    entryId: varchar("entryId", { length: 64 }).notNull(),
    embedding: json("embedding").$type<number[]>().notNull(),
    model: varchar("model", { length: 100 }).default("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    entryIdIdx: index("embedding_entryId_idx").on(table.entryId),
  })
);

export type Embedding = typeof embeddings.$inferSelect;
export type InsertEmbedding = typeof embeddings.$inferInsert;

/**
 * Messages table - stores encrypted messages
 */
export const messages = mysqlTable(
  "messages",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }).notNull(),
    senderId: varchar("senderId", { length: 64 }).notNull(),
    subject: text("subject"),
    content: text("content").notNull(),
    messageType: mysqlEnum("messageType", [
      "notification",
      "reminder",
      "alert",
      "contact",
      "system",
    ]).default("notification"),
    isRead: boolean("isRead").default(false),
    readAt: timestamp("readAt"),
    encryptionIv: varchar("encryptionIv", { length: 32 }).notNull(),
    encryptionSalt: varchar("encryptionSalt", { length: 32 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("message_userId_idx").on(table.userId),
    isReadIdx: index("isRead_idx").on(table.isRead),
  })
);

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;


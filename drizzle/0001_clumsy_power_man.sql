CREATE TABLE `auditLogs` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64),
	`actionType` varchar(100) NOT NULL,
	`resourceType` varchar(100),
	`resourceId` varchar(64),
	`details` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`status` enum('success','failure') DEFAULT 'success',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classificationLabels` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`label` varchar(100) NOT NULL,
	`arabicName` varchar(100) NOT NULL,
	`color` varchar(7) DEFAULT '#3B82F6',
	`icon` varchar(50),
	`isDefault` boolean DEFAULT false,
	`usageCount` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `classificationLabels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailySummaries` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`date` varchar(10) NOT NULL,
	`summary` text,
	`events` json,
	`keywordCounts` json,
	`generatedAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `dailySummaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `embeddings` (
	`id` varchar(64) NOT NULL,
	`entryId` varchar(64) NOT NULL,
	`embedding` json NOT NULL,
	`model` varchar(100) DEFAULT 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `embeddings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `entries` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`type` enum('audio','image','text') NOT NULL,
	`rawPath` text,
	`transcript` text,
	`labels` json DEFAULT ('[]'),
	`timestamp` timestamp DEFAULT (now()),
	`metadata` json,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`eventType` enum('reminder','taken','missed','alert','notification') NOT NULL,
	`relatedEntryId` varchar(64),
	`status` enum('pending','done','failed','dismissed') DEFAULT 'pending',
	`scheduledTime` timestamp,
	`completedTime` timestamp,
	`details` json,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`label` varchar(100),
	`reminderType` enum('time_based','context_based','recurring') DEFAULT 'time_based',
	`scheduleTime` varchar(10),
	`frequency` enum('once','daily','weekly','monthly') DEFAULT 'daily',
	`daysOfWeek` json,
	`conditions` json,
	`notificationMethod` enum('sound','text','both') DEFAULT 'both',
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `reminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trustedContacts` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20),
	`email` varchar(320),
	`role` enum('caregiver','family','doctor','emergency') DEFAULT 'caregiver',
	`canViewData` boolean DEFAULT false,
	`canEditReminders` boolean DEFAULT false,
	`canReceiveAlerts` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `trustedContacts_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_contact` UNIQUE(`userId`,`email`,`phone`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','caregiver') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `dateOfBirth` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `language` varchar(10) DEFAULT 'ar';--> statement-breakpoint
ALTER TABLE `users` ADD `encryptionKeyMeta` text;--> statement-breakpoint
ALTER TABLE `users` ADD `privacyConsent` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `dataRetentionDays` int DEFAULT 90;--> statement-breakpoint
CREATE INDEX `audit_userId_idx` ON `auditLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `actionType_idx` ON `auditLogs` (`actionType`);--> statement-breakpoint
CREATE INDEX `audit_createdAt_idx` ON `auditLogs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `user_label_idx` ON `classificationLabels` (`userId`,`label`);--> statement-breakpoint
CREATE INDEX `user_date_idx` ON `dailySummaries` (`userId`,`date`);--> statement-breakpoint
CREATE INDEX `embedding_entryId_idx` ON `embeddings` (`entryId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `entries` (`userId`);--> statement-breakpoint
CREATE INDEX `timestamp_idx` ON `entries` (`timestamp`);--> statement-breakpoint
CREATE INDEX `user_timestamp_idx` ON `entries` (`userId`,`timestamp`);--> statement-breakpoint
CREATE INDEX `event_userId_idx` ON `events` (`userId`);--> statement-breakpoint
CREATE INDEX `scheduledTime_idx` ON `events` (`scheduledTime`);--> statement-breakpoint
CREATE INDEX `reminder_userId_idx` ON `reminders` (`userId`);--> statement-breakpoint
CREATE INDEX `contact_userId_idx` ON `trustedContacts` (`userId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);
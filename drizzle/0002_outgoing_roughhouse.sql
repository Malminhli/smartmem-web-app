CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`senderId` varchar(64) NOT NULL,
	`subject` text,
	`content` text NOT NULL,
	`messageType` enum('notification','reminder','alert','contact','system') DEFAULT 'notification',
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`encryptionIv` varchar(32) NOT NULL,
	`encryptionSalt` varchar(32) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `message_userId_idx` ON `messages` (`userId`);--> statement-breakpoint
CREATE INDEX `isRead_idx` ON `messages` (`isRead`);--> statement-breakpoint
CREATE INDEX `message_createdAt_idx` ON `messages` (`createdAt`);
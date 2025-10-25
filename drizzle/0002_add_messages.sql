CREATE TABLE IF NOT EXISTS `messages` (
  `id` varchar(64) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `senderId` varchar(64) NOT NULL,
  `subject` text,
  `content` text NOT NULL,
  `messageType` enum('notification','reminder','alert','contact','system') DEFAULT 'notification',
  `isRead` boolean DEFAULT false,
  `readAt` timestamp NULL,
  `encryptionIv` varchar(32) NOT NULL,
  `encryptionSalt` varchar(32) NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `message_userId_idx` (`userId`),
  KEY `isRead_idx` (`isRead`),
  KEY `message_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


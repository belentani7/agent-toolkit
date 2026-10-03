CREATE TABLE `pvc_outbox` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` varchar(96) NOT NULL,
	`tenantKey` varchar(64) NOT NULL,
	`aggregateType` varchar(64) NOT NULL,
	`aggregateId` varchar(96) NOT NULL,
	`eventType` varchar(128) NOT NULL,
	`payload` json NOT NULL,
	`eventHash` varchar(128) NOT NULL,
	`status` enum('pending','published','failed') NOT NULL DEFAULT 'pending',
	`attempts` int NOT NULL DEFAULT 0,
	`availableAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`publishedAt` timestamp,
	CONSTRAINT `pvc_outbox_id` PRIMARY KEY(`id`),
	CONSTRAINT `pvc_outbox_eventId_unique` UNIQUE(`eventId`)
);

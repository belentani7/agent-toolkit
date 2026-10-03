ALTER TABLE `projects` ADD CONSTRAINT `projects_sourceUrl_unique` UNIQUE(`sourceUrl`);
ALTER TABLE `projects` ADD `externalId` varchar(180);
ALTER TABLE `projects` ADD `defaultBranch` varchar(120);
ALTER TABLE `projects` ADD `lastSyncedAt` timestamp;
ALTER TABLE `projects` ADD `syncError` text;
ALTER TABLE `projects` ADD `syncVersion` varchar(120);
CREATE TABLE `pipeline_runs` (
  `id` int AUTO_INCREMENT NOT NULL,
  `runKey` varchar(180) NOT NULL,
  `trigger` varchar(80) NOT NULL,
  `status` enum('queued','running','completed','partial','failed') NOT NULL DEFAULT 'queued',
  `currentStage` varchar(40) NOT NULL DEFAULT 'discovery',
  `totalItems` int NOT NULL DEFAULT 0,
  `processedItems` int NOT NULL DEFAULT 0,
  `failedItems` int NOT NULL DEFAULT 0,
  `error` text,
  `startedAt` timestamp,
  `finishedAt` timestamp,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `pipeline_runs_id` PRIMARY KEY(`id`),
  CONSTRAINT `pipeline_runs_runKey_unique` UNIQUE(`runKey`)
);
CREATE TABLE `pipeline_steps` (
  `id` int AUTO_INCREMENT NOT NULL,
  `runId` int NOT NULL,
  `projectId` int,
  `stage` varchar(40) NOT NULL,
  `status` enum('pending','running','completed','failed','skipped') NOT NULL DEFAULT 'pending',
  `attempts` int NOT NULL DEFAULT 0,
  `inputHash` varchar(64),
  `outputHash` varchar(64),
  `error` text,
  `startedAt` timestamp,
  `finishedAt` timestamp,
  CONSTRAINT `pipeline_steps_id` PRIMARY KEY(`id`)
);
CREATE TABLE `audit_events` (
  `id` int AUTO_INCREMENT NOT NULL,
  `eventHash` varchar(64) NOT NULL,
  `previousHash` varchar(64),
  `actor` varchar(120) NOT NULL,
  `action` varchar(160) NOT NULL,
  `resourceType` varchar(80) NOT NULL,
  `resourceId` varchar(180),
  `result` varchar(40) NOT NULL,
  `metadata` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `audit_events_id` PRIMARY KEY(`id`),
  CONSTRAINT `audit_events_eventHash_unique` UNIQUE(`eventHash`)
);

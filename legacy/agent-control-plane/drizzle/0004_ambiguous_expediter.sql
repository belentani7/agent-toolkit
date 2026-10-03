CREATE TABLE `pvc_approval_gates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`approvalId` varchar(96) NOT NULL,
	`tenantKey` varchar(64) NOT NULL,
	`validationId` varchar(64) NOT NULL,
	`requiredApprovals` int NOT NULL DEFAULT 2,
	`status` enum('pending','approved','rejected','expired') NOT NULL DEFAULT 'pending',
	`firstApprover` varchar(128),
	`firstApprovedAt` timestamp,
	`secondApprover` varchar(128),
	`secondApprovedAt` timestamp,
	`decisionHash` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pvc_approval_gates_id` PRIMARY KEY(`id`),
	CONSTRAINT `pvc_approval_gates_approvalId_unique` UNIQUE(`approvalId`),
	CONSTRAINT `pvc_approval_gates_validationId_unique` UNIQUE(`validationId`)
);

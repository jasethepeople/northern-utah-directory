CREATE TABLE `attorneys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`lawyerName` varchar(160) NOT NULL,
	`firmName` varchar(200) NOT NULL,
	`bio` text NOT NULL,
	`practiceAreas` text NOT NULL,
	`city` varchar(80) NOT NULL,
	`neighborhood` varchar(100),
	`address` varchar(255) NOT NULL,
	`phone` varchar(40) NOT NULL,
	`website` varchar(255),
	`officeHours` varchar(255),
	`barAdmissions` text,
	`latitude` decimal(10,7) NOT NULL,
	`longitude` decimal(10,7) NOT NULL,
	`photoUrl` text,
	`claimedByUserId` int,
	`status` enum('pending','published','hidden') NOT NULL DEFAULT 'published',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attorneys_id` PRIMARY KEY(`id`),
	CONSTRAINT `attorneys_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `claims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attorneyId` int NOT NULL,
	`userId` int NOT NULL,
	`message` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `claims_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attorneyId` int NOT NULL,
	`name` varchar(140) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(40),
	`caseType` varchar(100) NOT NULL,
	`message` text NOT NULL,
	`response` text,
	`status` enum('new','responded','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attorneyId` int NOT NULL,
	`reviewerName` varchar(120) NOT NULL,
	`rating` int NOT NULL,
	`body` text NOT NULL,
	`status` enum('pending','published','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(255);
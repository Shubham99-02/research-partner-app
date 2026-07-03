CREATE TABLE `analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`query` text NOT NULL,
	`summary` text,
	`keyThemes` text,
	`contrastingViews` text,
	`researchGaps` text,
	`recommendations` text,
	`sourceAttribution` json,
	`papersAnalyzed` text,
	`model` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`color` varchar(7),
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paperCollections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paperId` int NOT NULL,
	`collectionId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `paperCollections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `papers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` text NOT NULL,
	`authors` text,
	`abstract` text,
	`source` varchar(50) NOT NULL,
	`sourceId` varchar(255) NOT NULL,
	`publicationDate` timestamp,
	`url` varchar(2048),
	`doi` varchar(255),
	`keywords` text,
	`citations` int DEFAULT 0,
	`relevanceScore` text,
	`fullText` text,
	`metadata` json,
	`savedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `papers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `searchHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`query` text NOT NULL,
	`sources` text,
	`filters` json,
	`resultCount` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `searchHistory_id` PRIMARY KEY(`id`)
);

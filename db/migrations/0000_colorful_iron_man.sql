CREATE TABLE `daily_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`user_id` text NOT NULL,
	`group_id` text NOT NULL,
	`meal` integer NOT NULL,
	`grocery` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `groups_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(255),
	`group_id` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`code` integer NOT NULL,
	`owner_id` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `monthly_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`rent` integer NOT NULL,
	`paid` integer NOT NULL,
	`utilities_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`utilities_id`) REFERENCES `monthly_utilities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `monthly_utilities` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`electricity` integer NOT NULL,
	`internet` integer NOT NULL,
	`water` integer NOT NULL,
	`gas` integer NOT NULL,
	`cook` integer NOT NULL,
	`other_utils` integer NOT NULL,
	`group_id` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reset_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`active` integer NOT NULL,
	`type` text NOT NULL,
	`user_id` text NOT NULL,
	`group_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`hash` text(255),
	`salt` text(255),
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `groups_name_unique` ON `groups` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_utilities_id_unique` ON `monthly_utilities` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
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

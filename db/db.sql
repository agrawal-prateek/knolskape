CREATE TABLE `Teacher` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Student` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`teacher_id` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Assessment` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`assignee_id` INT NOT NULL,
	`assigner_id` INT NOT NULL,
	`assessment_name` VARCHAR(255) NOT NULL,
	`assesment_detail` VARCHAR(255),
	PRIMARY KEY (`id`)
);

ALTER TABLE `Student` ADD CONSTRAINT `Student_fk0` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`id`);

ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_fk0` FOREIGN KEY (`assignee_id`) REFERENCES `Student`(`id`);

ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_fk1` FOREIGN KEY (`assigner_id`) REFERENCES `Teacher`(`id`);


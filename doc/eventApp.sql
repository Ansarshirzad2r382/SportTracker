CREATE DATABASE IF NOT EXISTS eventApp;
USE eventApp;

SET FOREIGN_KEY_CHECKS = 0;

-- USER
CREATE TABLE `user` (
                        `user_id` INT AUTO_INCREMENT NOT NULL,
                        `username` VARCHAR(255) NOT NULL,
                        `email` VARCHAR(255) NOT NULL,
                        PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- EVENT_KATEGORIE
CREATE TABLE `event_kategorie` (
                                   `category_id` INT AUTO_INCREMENT NOT NULL,
                                   `name` VARCHAR(255) NOT NULL,
                                   `metric_unit` VARCHAR(100) NOT NULL,
                                   `description` TEXT,
                                   PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- EVENTS
CREATE TABLE `events` (
                          `event_id` INT AUTO_INCREMENT NOT NULL,
                          `category_id` INT NOT NULL,
                          `creator_id` INT NOT NULL,
                          `target_value` INT NOT NULL,
                          `start_date` DATETIME NOT NULL,
                          `end_date` DATETIME NOT NULL,
                          PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- EVENT_TEILNAHME
CREATE TABLE `event_teilnahme` (
                                   `event_id` INT NOT NULL,
                                   `user_id` INT NOT NULL,
                                   `current_score` INT DEFAULT 0,
                                   `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                                   PRIMARY KEY (`event_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- FREUNDSCHAFT
CREATE TABLE `freundschaft` (
                                `requester_id` INT NOT NULL,
                                `addressee_id` INT NOT NULL,
                                `status` VARCHAR(50) NOT NULL,
                                PRIMARY KEY (`requester_id`, `addressee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Constraints
ALTER TABLE `events`
    ADD CONSTRAINT `fk_event_category` FOREIGN KEY (`category_id`) REFERENCES `EVENT_KATEGORIE` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_event_creator` FOREIGN KEY (`creator_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `event_teilnahme`
    ADD CONSTRAINT `fk_participation_event` FOREIGN KEY (`event_id`) REFERENCES `EVENTS` (`event_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_participation_user` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `freundschaft`
    ADD CONSTRAINT `fk_friend_requester` FOREIGN KEY (`requester_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_friend_addressee` FOREIGN KEY (`addressee_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
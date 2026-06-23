SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS gameService;
USE gameService;

CREATE TABLE `player` (
                          `PlayerId` varchar(100) NOT NULL,
                          `Username` varchar(255) NOT NULL,
                          `AvatarUrl` varchar(255) DEFAULT NULL,
                          `NamecardUrl` varchar(255) DEFAULT NULL,
                          `EndorsementLevel` int(11) DEFAULT 0,
                          `EndorsementFrame` varchar(100) DEFAULT NULL,
                          `LastUpdated` datetime DEFAULT current_timestamp(),
                          PRIMARY KEY (`PlayerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `competitive_stat` (
                                    `CompStatId` int(11) NOT NULL AUTO_INCREMENT,
                                    `PlayerId` varchar(100) NOT NULL,
                                    `Platform` varchar(50) DEFAULT NULL,
                                    `Season` int(11) NOT NULL,
                                    PRIMARY KEY (`CompStatId`),
                                    KEY `fk_comp_player` (`PlayerId`),
                                    CONSTRAINT `fk_comp_player` FOREIGN KEY (`PlayerId`) REFERENCES `player` (`PlayerId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `role_rank` (
                             `RoleRankId` int(11) NOT NULL AUTO_INCREMENT,
                             `CompStatId` int(11) NOT NULL,
                             `RoleName` varchar(50) DEFAULT NULL,
                             `Division` varchar(50) DEFAULT NULL,
                             `Tier` int(11) DEFAULT NULL,
                             PRIMARY KEY (`RoleRankId`),
                             KEY `fk_rank_comp` (`CompStatId`),
                             CONSTRAINT `fk_rank_comp` FOREIGN KEY (`CompStatId`) REFERENCES `competitive_stat` (`CompStatId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `stats_snapshot` (
                                  `SnapshotId` int(11) NOT NULL AUTO_INCREMENT,
                                  `PlayerId` varchar(100) NOT NULL,
                                  `CreatedAt` datetime DEFAULT current_timestamp(),
                                  PRIMARY KEY (`SnapshotId`),
                                  KEY `fk_snapshot_player` (`PlayerId`),
                                  CONSTRAINT `fk_snapshot_player` FOREIGN KEY (`PlayerId`) REFERENCES `player` (`PlayerId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `stat_block` (
                              `StatBlockId` int(11) NOT NULL AUTO_INCREMENT,
                              `SnapshotId` int(11) NOT NULL,
                              `CategoryType` varchar(50) DEFAULT NULL,
                              `CategoryName` varchar(100) DEFAULT NULL,
                              `GamesPlayed` int(11) DEFAULT 0,
                              `GamesWon` int(11) DEFAULT 0,
                              `GamesLost` int(11) DEFAULT 0,
                              `TimePlayed` bigint(20) DEFAULT 0,
                              `Winrate` float DEFAULT 0,
                              `Kda` float DEFAULT 0,
                              `TotalEliminations` float DEFAULT 0,
                              `TotalAssists` float DEFAULT 0,
                              `TotalDeaths` float DEFAULT 0,
                              `TotalDamage` float DEFAULT 0,
                              `TotalHealing` float DEFAULT 0,
                              `AvgEliminations` float DEFAULT 0,
                              `AvgAssists` float DEFAULT 0,
                              `AvgDeaths` float DEFAULT 0,
                              `AvgDamage` float DEFAULT 0,
                              `AvgHealing` float DEFAULT 0,
                              PRIMARY KEY (`StatBlockId`),
                              KEY `fk_block_snapshot` (`SnapshotId`),
                              CONSTRAINT `fk_block_snapshot` FOREIGN KEY (`SnapshotId`) REFERENCES `stats_snapshot` (`SnapshotId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
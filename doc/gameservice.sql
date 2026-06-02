-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 19. Mai 2026 um 14:02
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `gameservice`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `competitive_stat`
--

CREATE TABLE `competitive_stat` (
  `CompStatId` int(11) NOT NULL,
  `PlayerId` varchar(100) NOT NULL,
  `Platform` varchar(50) DEFAULT NULL,
  `Season` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `competitive_stat`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `player`
--

CREATE TABLE `player` (
  `PlayerId` varchar(100) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `AvatarUrl` varchar(255) DEFAULT NULL,
  `NamecardUrl` varchar(255) DEFAULT NULL,
  `EndorsementLevel` int(11) DEFAULT 0,
  `EndorsementFrame` varchar(100) DEFAULT NULL,
  `LastUpdated` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `player`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `role_rank`
--

CREATE TABLE `role_rank` (
  `RoleRankId` int(11) NOT NULL,
  `CompStatId` int(11) NOT NULL,
  `RoleName` varchar(50) DEFAULT NULL,
  `Division` varchar(50) DEFAULT NULL,
  `Tier` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `role_rank`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `stats_snapshot`
--

CREATE TABLE `stats_snapshot` (
  `SnapshotId` int(11) NOT NULL,
  `PlayerId` varchar(100) NOT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `stat_block`
--

CREATE TABLE `stat_block` (
  `StatBlockId` int(11) NOT NULL,
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
  `AvgHealing` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `competitive_stat`
--
ALTER TABLE `competitive_stat`
  ADD PRIMARY KEY (`CompStatId`),
  ADD KEY `fk_comp_player` (`PlayerId`);

--
-- Indizes für die Tabelle `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`PlayerId`);

--
-- Indizes für die Tabelle `role_rank`
--
ALTER TABLE `role_rank`
  ADD PRIMARY KEY (`RoleRankId`),
  ADD KEY `fk_rank_comp` (`CompStatId`);

--
-- Indizes für die Tabelle `stats_snapshot`
--
ALTER TABLE `stats_snapshot`
  ADD PRIMARY KEY (`SnapshotId`),
  ADD KEY `fk_snapshot_player` (`PlayerId`);

--
-- Indizes für die Tabelle `stat_block`
--
ALTER TABLE `stat_block`
  ADD PRIMARY KEY (`StatBlockId`),
  ADD KEY `fk_block_snapshot` (`SnapshotId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `competitive_stat`
--
ALTER TABLE `competitive_stat`
  MODIFY `CompStatId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `role_rank`
--
ALTER TABLE `role_rank`
  MODIFY `RoleRankId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `stats_snapshot`
--
ALTER TABLE `stats_snapshot`
  MODIFY `SnapshotId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `stat_block`
--
ALTER TABLE `stat_block`
  MODIFY `StatBlockId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `competitive_stat`
--
ALTER TABLE `competitive_stat`
  ADD CONSTRAINT `fk_comp_player` FOREIGN KEY (`PlayerId`) REFERENCES `player` (`PlayerId`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `role_rank`
--
ALTER TABLE `role_rank`
  ADD CONSTRAINT `fk_rank_comp` FOREIGN KEY (`CompStatId`) REFERENCES `competitive_stat` (`CompStatId`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `stats_snapshot`
--
ALTER TABLE `stats_snapshot`
  ADD CONSTRAINT `fk_snapshot_player` FOREIGN KEY (`PlayerId`) REFERENCES `player` (`PlayerId`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `stat_block`
--
ALTER TABLE `stat_block`
  ADD CONSTRAINT `fk_block_snapshot` FOREIGN KEY (`SnapshotId`) REFERENCES `stats_snapshot` (`SnapshotId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

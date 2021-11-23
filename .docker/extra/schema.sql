/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `configs`
--

DROP TABLE IF EXISTS `configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configs` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bot_owners` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `beg_success_answers` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `beg_failed_answers` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `work_answers` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `crime_success_answers` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `crime_failed_answers` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_XP` int(11) NOT NULL DEFAULT 1,
  `level_XP` int(11) NOT NULL DEFAULT 100,
  `upvote_credits` int(11) NOT NULL DEFAULT 1000,
  `daily_credits` int(11) NOT NULL DEFAULT 1000,
  `shrine_bonus` float unsigned NOT NULL DEFAULT 1,
  `speed` float unsigned NOT NULL DEFAULT 1,
  `work_multiplier` float unsigned NOT NULL DEFAULT 1,
  `crime_multiplier` float unsigned NOT NULL DEFAULT 1,
  `daily_multiplier` float unsigned NOT NULL DEFAULT 1,
  `hourly_multiplier` float unsigned NOT NULL DEFAULT 1,
  `sells_multiplier` float unsigned NOT NULL DEFAULT 1,
  `mayor_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `b_mayor_house` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_mayor_house_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_shrine` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_shrine_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_community_center` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_community_center_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_quantum_pancakes` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_quantum_pancakes_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_crime_monopoly` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_crime_monopoly_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_pet_shelter` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_pet_shelter_credits` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild_bans`
--

DROP TABLE IF EXISTS `guild_bans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_bans` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guild_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start` bigint(20) unsigned NOT NULL,
  `end` bigint(20) unsigned DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild_counters`
--

DROP TABLE IF EXISTS `guild_counters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_counters` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guild_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_update` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild_mutes`
--

DROP TABLE IF EXISTS `guild_mutes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_mutes` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guild_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start` bigint(20) unsigned NOT NULL,
  `end` bigint(20) unsigned DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild_ranks`
--

DROP TABLE IF EXISTS `guild_ranks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_ranks` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guild_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int(10) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `guild_ranks_FK` (`guild_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild_reaction_roles`
--

DROP TABLE IF EXISTS `guild_reaction_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_reaction_roles` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guild_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reaction_roles` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `reaction_role_emojis` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild_users`
--

DROP TABLE IF EXISTS `guild_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_users` (
  `fast_find_ID` varchar(37) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guild_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` smallint(5) unsigned DEFAULT 1,
  `xp` int(10) unsigned DEFAULT 0,
  PRIMARY KEY (`fast_find_ID`),
  KEY `fast_find_ID` (`fast_find_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild_warnings`
--

DROP TABLE IF EXISTS `guild_warnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_warnings` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guild_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start` bigint(20) unsigned NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guilds`
--

DROP TABLE IF EXISTS `guilds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guilds` (
  `id` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nm!',
  `say_command` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `case_ID` int(10) unsigned NOT NULL DEFAULT 0,
  `mute_role_ID` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invites` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `banned_words` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auto_roles` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `welcome_messages` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `welcome_messages_channel` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `welcome_messages_ping` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `welcome_messages_format` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '<user> joined the server.',
  `leave_messages` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `leave_messages_channel` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leave_messages_format` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '<user> left the server.',
  `module_level_enabled` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `module_level_message_exp` int(10) unsigned NOT NULL DEFAULT 1,
  `module_level_level_exp` int(10) unsigned NOT NULL DEFAULT 100,
  `module_level_levelup_messages` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `module_level_levelup_messages_channel` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_level_levelup_messages_ping` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `module_level_levelup_messages_format` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_level_ignored_channels` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `audit_channel` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `audit_bans` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `audit_mutes` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `audit_kicks` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `audit_warns` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `audit_nicknames` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `audit_deleted_messages` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `audit_edited_messages` tinyint(3) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_items`
--

DROP TABLE IF EXISTS `inventory_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inventory_items` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_ID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rarity` tinyint(3) unsigned NOT NULL DEFAULT 3,
  `name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `can_be_scavanged` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `price` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_ID` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` bigint(20) unsigned NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `credits` int(10) unsigned NOT NULL DEFAULT 1000,
  `bank` int(10) unsigned NOT NULL DEFAULT 0,
  `level` smallint(5) unsigned NOT NULL DEFAULT 1,
  `xp` int(10) unsigned NOT NULL DEFAULT 0,
  `rep` smallint(5) unsigned NOT NULL DEFAULT 0,
  `net_worth` int(10) unsigned NOT NULL DEFAULT 0,
  `votes` smallint(5) unsigned NOT NULL DEFAULT 0,
  `osu_username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inventory` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `married_ID` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `can_divorce` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `last_work_time` bigint(20) unsigned NOT NULL DEFAULT 0,
  `last_crime_time` bigint(20) unsigned NOT NULL DEFAULT 0,
  `last_daily_time` bigint(20) unsigned NOT NULL DEFAULT 0,
  `last_steal_time` bigint(20) unsigned NOT NULL DEFAULT 0,
  `last_beg_time` bigint(20) unsigned NOT NULL DEFAULT 0,
  `last_upvoted_time` bigint(20) unsigned NOT NULL DEFAULT 0,
  `last_rep_time` bigint(20) unsigned NOT NULL DEFAULT 0,
  `b_city_hall` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_city_hall_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_bank` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_bank_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_lab` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_lab_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_sanctuary` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_sanctuary_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_pancakes` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_pancakes_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_crime_den` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_crime_den_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_lewd_services` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_lewd_services_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_lewd_services_last_update` bigint(20) unsigned NOT NULL DEFAULT 0,
  `b_casino` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_casino_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_casino_last_update` bigint(20) unsigned NOT NULL DEFAULT 0,
  `b_scrapyard` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_scrapyard_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_scrapyard_last_update` bigint(20) unsigned NOT NULL DEFAULT 0,
  `b_pawn_shop` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `b_pawn_shop_credits` int(10) unsigned NOT NULL DEFAULT 0,
  `b_pawn_shop_last_update` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_ID` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'nekomaid-db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

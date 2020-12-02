# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: localhost (MySQL 8.0.22)
# Database: microhub
# Generation Time: 2020-12-01 16:24:28 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table comment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `topicid` int DEFAULT NULL,
  `author` int DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `published` tinyint unsigned DEFAULT '1',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;

INSERT INTO `comment` (`id`, `topicid`, `author`, `content`, `published`, `created`, `updated`)
VALUES
	(1,1,1,'This is some generic comment',1,'2020-11-30 12:02:23','2020-11-30 12:02:26'),
	(2,1,1,'This is a slightly longer comment that might go on for a long time.',1,'2020-11-30 18:38:20','2020-11-30 12:02:26'),
	(3,1,1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at ex ac tortor egestas fringilla. Praesent in dapibus felis. Quisque condimentum, nulla at facilisis gravida, dui sem sagittis nibh, ut accumsan magna ligula non purus. Pellentesque metus sem, ullamcorper non finibus in, molestie vitae odio. Curabitur vel massa et justo posuere luctus convallis non massa. Etiam et felis sed ligula consectetur fermentum. Aenean sollicitudin arcu risus. Ut est orci, luctus sit amet tristique dapibus, rhoncus eget arcu. Nulla ut ex vel nunc maximus suscipit et eget ligula. Maecenas vitae semper dolor. Sed imperdiet odio at posuere lobortis. Donec vehicula lobortis nibh, quis sodales ligula porta id. Integer sodales enim in nibh lacinia, sit amet rhoncus ipsum tempus. Nullam luctus molestie enim, nec feugiat quam. Nulla quis semper massa. Sed odio ligula, porta at luctus tempus, facilisis et lorem.\n\nAliquam sed nulla velit. Nulla fermentum eros in nibh tempor, vestibulum consectetur dui malesuada. Vivamus quis metus leo. Integer nibh nibh, efficitur sit amet auctor facilisis, mattis vitae ligula. Sed aliquet, ante non finibus placerat, risus lectus lacinia metus, vitae sagittis quam mauris id odio. Quisque eu egestas odio. Donec dapibus est et pulvinar iaculis. Sed tristique id ipsum vel dictum.',1,'2020-11-30 12:02:23','2020-11-30 12:02:26'),
	(5,1,9,'asdfadsfasdfadsfadsfadsfadsf',1,'2020-12-01 12:19:10','2020-12-01 12:19:10'),
	(6,1,9,'asdfadsfasdfadsfadsfadsfadsf',1,'2020-12-01 12:18:51','2020-12-01 12:18:51'),
	(7,1,9,'asdfadsfasdfadsfadsfadsfadsf',1,'2020-12-01 12:18:52','2020-12-01 12:18:52'),
	(8,1,9,'asdfadsfadsfdasfadsfadsfasdfadsfadsfsdf',1,'2020-12-01 12:18:55','2020-12-01 12:18:55'),
	(9,1,9,'asdfadsfadsfdasfadsfadsfasdfadsfadsfsdf',1,'2020-12-01 12:19:11','2020-12-01 12:19:11'),
	(10,1,9,'asdfadsfadsfdasfadsfadsfasdfadsfadsfsdf',1,'2020-12-01 12:19:12','2020-12-01 12:19:12'),
	(11,1,9,'asdfadsfadsfdasfadsfadsfasdfadsfadsfsdf',1,'2020-12-01 12:19:15','2020-12-01 12:19:15'),
	(12,1,9,'asdfasdfadsfadsfadsfadsfadsfadsf',1,'2020-12-01 12:22:31','2020-12-01 12:22:31'),
	(13,1,9,'asdfasdfadsfadsfadsfadsfadsfadsf',1,'2020-12-01 13:12:32','2020-12-01 13:12:32'),
	(14,1,9,'asdfasdfadsfadsfadsfadsfadsfadsf',1,'2020-12-01 13:12:37','2020-12-01 13:12:37'),
	(15,1,9,'asdfasdfadsfadsfadsfadsfadsfadsf',1,'2020-12-01 13:12:59','2020-12-01 13:12:59'),
	(16,1,9,'asdfasdfadsfadsfadsfadsfadsfadsf',1,'2020-12-01 13:13:02','2020-12-01 13:13:02'),
	(17,1,9,'asdfasdfadsfadsfadsfadsfadsfadsf',1,'2020-12-01 13:13:04','2020-12-01 13:13:04'),
	(18,1,9,'asdfasdfadsfadsfadsfadsfadsfadsf',1,'2020-12-01 13:13:27','2020-12-01 13:13:27'),
	(19,1,9,'asdfasdfadsfadsfadsfadsfadsfadsf',1,'2020-12-01 13:13:28','2020-12-01 13:13:28');

/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table hub
# ------------------------------------------------------------

DROP TABLE IF EXISTS `hub`;

CREATE TABLE `hub` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `creator` int DEFAULT NULL,
  `public` tinyint(1) DEFAULT '1',
  `published` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `hub` WRITE;
/*!40000 ALTER TABLE `hub` DISABLE KEYS */;

INSERT INTO `hub` (`id`, `name`, `slug`, `password`, `creator`, `public`, `published`, `created`, `updated`)
VALUES
	(1,'Test hub','test-hub',NULL,1,0,1,'2020-08-30 11:40:36','2020-11-22 20:16:01');

/*!40000 ALTER TABLE `hub` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table hub_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `hub_user`;

CREATE TABLE `hub_user` (
  `hubid` int unsigned NOT NULL,
  `userid` int DEFAULT NULL,
  `staff` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`hubid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `hub_user` WRITE;
/*!40000 ALTER TABLE `hub_user` DISABLE KEYS */;

INSERT INTO `hub_user` (`hubid`, `userid`, `staff`)
VALUES
	(1,9,1);

/*!40000 ALTER TABLE `hub_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table topic
# ------------------------------------------------------------

DROP TABLE IF EXISTS `topic`;

CREATE TABLE `topic` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `hubid` int DEFAULT NULL,
  `author` int DEFAULT NULL,
  `title` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `published` tinyint(1) NOT NULL DEFAULT '1',
  `starred` tinyint(1) NOT NULL DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;

INSERT INTO `topic` (`id`, `hubid`, `author`, `title`, `slug`, `content`, `published`, `starred`, `created`, `updated`)
VALUES
	(1,1,1,'Topic with comments','test-title','This is some content',1,0,'2020-11-22 22:18:36','2020-11-22 22:18:36'),
	(2,1,1,'Test title','test-title2','This is some content',1,0,'2020-11-22 22:18:36','2020-11-22 22:18:36'),
	(3,1,1,'Starred title','test-title3','This is some content',1,1,'2020-11-22 22:18:36','2020-11-22 22:18:36'),
	(4,1,1,'Test title','test-title4','This is some content',1,0,'2020-11-22 22:18:36','2020-11-22 22:18:36'),
	(5,1,1,'Test title','test-title5','This is some content',1,0,'2020-11-22 22:18:36','2020-11-22 22:18:36'),
	(6,1,1,'Test title','test-title6','This is some content',1,0,'2020-11-30 11:50:28','2020-11-30 10:55:45');

/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `roles` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timezone` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `email`, `password`, `username`, `roles`, `timezone`, `created`, `updated`)
VALUES
	(1,'user@test.com','$2b$10$iPe0bD5saTCX.HK2bW4GWuli3wyQpO9DMV5bSdTqYWovEGz6f1qIO','user','USER','Europe/Helsinki','2020-11-25 13:53:01','2020-11-25 13:53:01'),
	(9,'admin@test.com','$2b$10$iPe0bD5saTCX.HK2bW4GWuli3wyQpO9DMV5bSdTqYWovEGz6f1qIO','admin','ADMIN','Europe/Helsinki','2020-11-30 09:35:10','2020-11-30 09:35:14');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

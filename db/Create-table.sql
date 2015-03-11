DROP DATABASE IF EXISTS CF_DB;
CREATE DATABASE IF NOT EXISTS CF_DB;
USE CF_DB;
SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Tables structure
-- ----------------------------

-- facebook user table
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `user_id` varchar(255) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_gender` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- company table
DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `authorization` varchar(255) DEFAULT NULL,
  `degrees` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `booth` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- Comment out to delete the data
-- DROP TABLE IF EXISTS `users_companies`;
CREATE TABLE `users_companies` (
  `user_id` varchar(255) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `note` varchar(2000) DEFAULT NULL,
  `checkin` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`user_id`,`company_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`),
  FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


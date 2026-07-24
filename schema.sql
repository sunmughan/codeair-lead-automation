-- Codeair Lead Automation & Dynamic Web Page Platform Complete MySQL Schema
-- Database Name: codeair_automation

CREATE DATABASE IF NOT EXISTS `codeair_automation` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `codeair_automation`;

-- 1. Admin Credentials, SMTP & API Configuration Table
CREATE TABLE IF NOT EXISTS `admin_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `smtp_host` VARCHAR(255) DEFAULT 'smtp.gmail.com',
  `smtp_port` INT DEFAULT 587,
  `smtp_security` VARCHAR(10) DEFAULT 'TLS',
  `smtp_username` VARCHAR(255) DEFAULT '',
  `smtp_password` VARCHAR(255) DEFAULT '',
  `sender_name` VARCHAR(255) DEFAULT 'Codeair Software Solutions',
  `gemini_api_key` TEXT DEFAULT NULL,
  `stitch_token` TEXT DEFAULT NULL,
  `preview_domain` VARCHAR(255) DEFAULT '{slug}.preview.codeair.com',
  `package_price` VARCHAR(50) DEFAULT '₹14,999',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default row if empty
INSERT INTO `admin_settings` (`id`, `smtp_host`, `smtp_port`, `smtp_security`, `smtp_username`, `smtp_password`, `sender_name`, `preview_domain`, `package_price`)
SELECT 1, 'smtp.gmail.com', 587, 'TLS', '', '', 'Codeair Software Solutions', '{slug}.preview.codeair.com', '₹14,999'
WHERE NOT EXISTS (SELECT 1 FROM `admin_settings` WHERE `id` = 1);

-- 2. Business Leads Table
CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(100) PRIMARY KEY,
  `business_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(150) DEFAULT 'Business',
  `rating` DECIMAL(3, 1) DEFAULT 4.8,
  `reviews_count` INT DEFAULT 100,
  `address` TEXT DEFAULT NULL,
  `status` ENUM('extracted', 'designed', 'sent', 'replied') DEFAULT 'extracted',
  `branding_json` JSON DEFAULT NULL,
  `pitch_subject` VARCHAR(255) DEFAULT NULL,
  `pitch_body` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Email Outbound Dispatches Log Table
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` VARCHAR(100) NOT NULL,
  `recipient_email` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `body_text` TEXT DEFAULT NULL,
  `attachment_file_name` VARCHAR(255) DEFAULT NULL,
  `attachment_local_path` TEXT DEFAULT NULL,
  `status` ENUM('sent', 'failed') DEFAULT 'sent',
  `message_id` VARCHAR(255) DEFAULT NULL,
  `error_message` TEXT DEFAULT NULL,
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Lead Activity & AI Smart Responder Notes Table
CREATE TABLE IF NOT EXISTS `activity_notes` (
  `id` VARCHAR(100) PRIMARY KEY,
  `lead_id` VARCHAR(100) NOT NULL,
  `note_type` VARCHAR(50) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `timestamp` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

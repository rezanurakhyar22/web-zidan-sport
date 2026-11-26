-- Tabel Two-Factor Authentication (2FA) untuk pengguna Zidan Sport (tbl_users)
CREATE TABLE IF NOT EXISTS `tbl_user_two_factor` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `secret` TEXT NOT NULL,
    `backup_codes` TEXT NOT NULL,
    `is_enabled` TINYINT(1) NOT NULL DEFAULT 0,
    `verified_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `tbl_user_two_factor_user_id_unique` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

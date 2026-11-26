-- Migrasi user aktif dari tbl_users ke tabel Better Auth (user & account)
-- Aman dijalankan ulang (INSERT IGNORE + NOT EXISTS), tidak mengubah tbl_users.

INSERT IGNORE INTO `user` (`id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`)
SELECT
  CAST(`id` AS CHAR(191)),
  COALESCE(NULLIF(TRIM(`name`), ''), SUBSTRING_INDEX(LOWER(TRIM(`email`)), '@', 1)),
  LOWER(TRIM(`email`)),
  IF(`is_verified` = 1, 1, 0),
  NULLIF(TRIM(`photo`), ''),
  COALESCE(`created_at`, NOW(3)),
  COALESCE(`updated_at`, NOW(3))
FROM `tbl_users`
WHERE (`is_deleted` = 0 OR `is_deleted` IS NULL)
  AND `email` IS NOT NULL
  AND TRIM(`email`) <> '';

INSERT IGNORE INTO `account` (`id`, `accountId`, `providerId`, `userId`, `password`, `createdAt`, `updatedAt`)
SELECT
  CONCAT('legacy_cred_', u.`id`),
  u.`id`,
  'credential',
  u.`id`,
  TRIM(t.`password`),
  COALESCE(t.`created_at`, NOW(3)),
  COALESCE(t.`updated_at`, NOW(3))
FROM `tbl_users` t
INNER JOIN `user` u ON u.`email` = LOWER(TRIM(t.`email`))
WHERE (t.`is_deleted` = 0 OR t.`is_deleted` IS NULL)
  AND t.`password` IS NOT NULL
  AND TRIM(t.`password`) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM `account` a
    WHERE a.`userId` = u.`id` AND a.`providerId` = 'credential'
  );

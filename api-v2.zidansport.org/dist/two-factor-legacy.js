"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBase32Secret = generateBase32Secret;
exports.generateTotpCode = generateTotpCode;
exports.verifyTotpCode = verifyTotpCode;
exports.buildTotpUri = buildTotpUri;
exports.encryptSecret = encryptSecret;
exports.decryptSecret = decryptSecret;
exports.generateBackupCodes = generateBackupCodes;
exports.hashBackupCode = hashBackupCode;
exports.ensureTwoFactorTable = ensureTwoFactorTable;
exports.isUserTwoFactorEnabled = isUserTwoFactorEnabled;
exports.signTwoFactorChallenge = signTwoFactorChallenge;
exports.verifyTrustDeviceToken = verifyTrustDeviceToken;
exports.mountLegacyTwoFactorRoutes = mountLegacyTwoFactorRoutes;

const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const BACKUP_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ISSUER_NAME = "Zidan Sport";

let ensureTablePromise = null;

function getEncryptionKey() {
  const raw =
    process.env.BETTER_AUTH_SECRET ||
    process.env.JWT_SECRET ||
    "zidansport-two-factor-fallback-key";
  return crypto.createHash("sha256").update(String(raw)).digest();
}

function getJwtSecret() {
  return process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || "";
}

function base32Encode(buffer) {
  let bits = 0;
  let value = 0;
  let output = "";
  for (let i = 0; i < buffer.length; i += 1) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32Decode(str) {
  const cleaned = String(str || "")
    .toUpperCase()
    .replace(/=+$/g, "")
    .replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes = [];
  for (let i = 0; i < cleaned.length; i += 1) {
    const idx = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

function generateBase32Secret(byteLength = 20) {
  return base32Encode(crypto.randomBytes(byteLength));
}

function generateTotpCode(base32Secret, timeMs = Date.now(), period = 30, digits = 6) {
  const key = base32Decode(base32Secret);
  const counter = Math.floor(timeMs / 1000 / period);
  const counterBuf = Buffer.alloc(8);
  const high = Math.floor(counter / 0x100000000);
  const low = counter >>> 0;
  counterBuf.writeUInt32BE(high, 0);
  counterBuf.writeUInt32BE(low, 4);

  const hmac = crypto.createHmac("sha1", key).update(counterBuf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  const otp = binary % Math.pow(10, digits);
  return String(otp).padStart(digits, "0");
}

function verifyTotpCode(base32Secret, inputCode, windowSteps = 1, timeMs = Date.now()) {
  const normalized = String(inputCode || "").replace(/\s+/g, "");
  if (!/^\d{6}$/.test(normalized)) return false;

  const inputBuf = Buffer.from(normalized, "utf8");
  for (let delta = -windowSteps; delta <= windowSteps; delta += 1) {
    const candidate = generateTotpCode(base32Secret, timeMs + delta * 30 * 1000, 30, 6);
    const candBuf = Buffer.from(candidate, "utf8");
    if (inputBuf.length === candBuf.length && crypto.timingSafeEqual(inputBuf, candBuf)) {
      return true;
    }
  }
  return false;
}

function buildTotpUri(base32Secret, email, issuer = ISSUER_NAME) {
  const safeIssuer = encodeURIComponent(issuer);
  const safeAccount = encodeURIComponent(String(email || "user"));
  return `otpauth://totp/${safeIssuer}:${safeAccount}?secret=${base32Secret}&issuer=${safeIssuer}&algorithm=SHA1&digits=6&period=30`;
}

function encryptSecret(plaintext) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plaintext), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

function decryptSecret(payload) {
  const parts = String(payload || "").split(":");
  if (parts.length !== 3) {
    throw new Error("Format secret 2FA tidak valid");
  }
  const key = getEncryptionKey();
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = Buffer.from(parts[2], "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

function generateBackupCodes(count = 10) {
  const codes = [];
  for (let i = 0; i < count; i += 1) {
    const bytes = crypto.randomBytes(8);
    let raw = "";
    for (let j = 0; j < 8; j += 1) {
      raw += BACKUP_ALPHABET[bytes[j] % BACKUP_ALPHABET.length];
    }
    codes.push(`${raw.slice(0, 4)}-${raw.slice(4, 8)}`);
  }
  return codes;
}

function normalizeBackupCode(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function hashBackupCode(code) {
  return crypto
    .createHmac("sha256", getEncryptionKey())
    .update(normalizeBackupCode(code))
    .digest("hex");
}

async function ensureTwoFactorTable(queryRunner) {
  if (!ensureTablePromise) {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`tbl_user_two_factor\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`user_id\` INT NOT NULL,
        \`secret\` TEXT NOT NULL,
        \`backup_codes\` TEXT NOT NULL,
        \`is_enabled\` TINYINT(1) NOT NULL DEFAULT 0,
        \`verified_at\` DATETIME NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`tbl_user_two_factor_user_id_unique\` (\`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    ensureTablePromise = Promise.resolve()
      .then(() => queryRunner(sql))
      .catch((err) => {
        ensureTablePromise = null;
        throw err;
      });
  }
  return ensureTablePromise;
}

async function isUserTwoFactorEnabled(promisePool, userId) {
  await ensureTwoFactorTable((sql) => promisePool.query(sql));
  const [rows] = await promisePool.query(
    "SELECT is_enabled FROM tbl_user_two_factor WHERE user_id = ? LIMIT 1",
    [userId]
  );
  return Boolean(rows.length > 0 && Number(rows[0].is_enabled) === 1);
}

function signTwoFactorChallenge(user) {
  return jwt.sign(
    {
      sub: user.id,
      access: user.access,
      email: user.email,
      type: "2fa_challenge",
    },
    getJwtSecret(),
    { expiresIn: "10m" }
  );
}

function signTrustDeviceToken(userId) {
  return jwt.sign(
    {
      sub: userId,
      type: "2fa_trust",
    },
    getJwtSecret(),
    { expiresIn: "30d" }
  );
}

function verifyTrustDeviceToken(token, userId) {
  if (!token || typeof token !== "string") return false;
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    return (
      Boolean(decoded) &&
      decoded.type === "2fa_trust" &&
      String(decoded.sub) === String(userId)
    );
  } catch {
    return false;
  }
}

function extractBearerUser(req) {
  const authHeader = String(req.headers.authorization || "");
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (!decoded || !decoded.sub) return null;
    return decoded;
  } catch {
    return null;
  }
}

async function loadFullLegacyUser(promisePool, userId) {
  const [userRows] = await promisePool.query(
    "SELECT * FROM tbl_users WHERE id = ? LIMIT 1",
    [userId]
  );
  if (!userRows.length) return null;
  const user = { ...userRows[0] };
  delete user.password;

  const [[athleteRows], [coachRows], [contingentRows]] = await Promise.all([
    promisePool.query("SELECT * FROM tbl_athletes WHERE user_id = ? LIMIT 1", [userId]),
    promisePool.query("SELECT * FROM tbl_coaches WHERE user_id = ? LIMIT 1", [userId]),
    promisePool.query("SELECT * FROM tbl_contingents WHERE user_id = ? LIMIT 1", [userId]),
  ]);

  user.athlete = athleteRows[0] || null;
  user.coach = coachRows[0] || null;
  user.contingent = contingentRows[0] || null;
  if (Number(user.access) === 1 && user.contingent && user.contingent.logo && !user.photo) {
    user.photo = user.contingent.logo;
  }
  return user;
}

function parseStoredHashes(raw) {
  try {
    const parsed = JSON.parse(String(raw || "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mountLegacyTwoFactorRoutes(expressApp, promisePool) {
  const jsonParser = express.json({ limit: "1mb" });
  const runQuery = (sql) => promisePool.query(sql);

  expressApp.get("/api/v2/auth/2fa/status", async (req, res) => {
    try {
      const authUser = extractBearerUser(req);
      if (!authUser) {
        return res.status(401).json({ statusCode: 401, message: "Unauthorized" });
      }
      await ensureTwoFactorTable(runQuery);
      const [rows] = await promisePool.query(
        "SELECT is_enabled, backup_codes, verified_at FROM tbl_user_two_factor WHERE user_id = ? LIMIT 1",
        [authUser.sub]
      );
      const record = rows[0] || null;
      const enabled = Boolean(record && Number(record.is_enabled) === 1);
      const remaining = enabled ? parseStoredHashes(record.backup_codes).length : 0;
      return res.status(200).json({
        message: "Status 2FA berhasil dimuat",
        data: {
          enabled,
          remaining_backup_codes: remaining,
          verified_at: record ? record.verified_at : null,
        },
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err?.message || "Gagal memuat status 2FA",
      });
    }
  });

  expressApp.post("/api/v2/auth/2fa/enable", jsonParser, async (req, res) => {
    try {
      const authUser = extractBearerUser(req);
      if (!authUser) {
        return res.status(401).json({ statusCode: 401, message: "Unauthorized" });
      }
      const password = String(req.body?.password || "");
      if (!password) {
        return res.status(400).json({
          statusCode: 400,
          message: "Password akun wajib diisi untuk mengaktifkan 2FA.",
        });
      }

      const [userRows] = await promisePool.query(
        "SELECT id, email, password, is_deleted FROM tbl_users WHERE id = ? LIMIT 1",
        [authUser.sub]
      );
      if (!userRows.length || userRows[0].is_deleted) {
        return res.status(404).json({ statusCode: 404, message: "Akun tidak ditemukan." });
      }
      const user = userRows[0];
      const validPassword = await bcrypt.compare(password, user.password || "");
      if (!validPassword) {
        return res.status(400).json({
          statusCode: 400,
          message: "Password tidak sesuai. Periksa kembali password Anda.",
        });
      }

      await ensureTwoFactorTable(runQuery);
      const [existingRows] = await promisePool.query(
        "SELECT id, is_enabled FROM tbl_user_two_factor WHERE user_id = ? LIMIT 1",
        [user.id]
      );
      if (existingRows.length && Number(existingRows[0].is_enabled) === 1) {
        return res.status(400).json({
          statusCode: 400,
          message: "Autentikasi dua faktor sudah aktif pada akun ini.",
        });
      }

      const secret = generateBase32Secret(20);
      const encryptedSecret = encryptSecret(secret);
      const backupCodes = generateBackupCodes(10);
      const hashedBackupCodes = JSON.stringify(backupCodes.map(hashBackupCode));

      await promisePool.query(
        `INSERT INTO tbl_user_two_factor (user_id, secret, backup_codes, is_enabled, verified_at, created_at, updated_at)
         VALUES (?, ?, ?, 0, NULL, NOW(), NOW())
         ON DUPLICATE KEY UPDATE secret = VALUES(secret), backup_codes = VALUES(backup_codes), is_enabled = 0, verified_at = NULL, updated_at = NOW()`,
        [user.id, encryptedSecret, hashedBackupCodes]
      );

      const totpUri = buildTotpUri(secret, user.email, ISSUER_NAME);
      const qrDataUrl = await QRCode.toDataURL(totpUri, {
        width: 220,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#000000", light: "#ffffff" },
      });

      return res.status(200).json({
        message: "Konfigurasi 2FA berhasil dibuat. Pindai QR code lalu masukkan kode 6 digit untuk verifikasi.",
        data: {
          qr_data_url: qrDataUrl,
          totp_uri: totpUri,
          manual_secret: secret,
          backup_codes: backupCodes,
        },
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err?.message || "Gagal menyiapkan 2FA.",
      });
    }
  });

  expressApp.post("/api/v2/auth/2fa/verify-setup", jsonParser, async (req, res) => {
    try {
      const authUser = extractBearerUser(req);
      if (!authUser) {
        return res.status(401).json({ statusCode: 401, message: "Unauthorized" });
      }
      const code = String(req.body?.code || "").replace(/\s+/g, "");
      if (!/^\d{6}$/.test(code)) {
        return res.status(400).json({
          statusCode: 400,
          message: "Masukkan kode 6 digit angka dari aplikasi authenticator.",
        });
      }

      await ensureTwoFactorTable(runQuery);
      const [rows] = await promisePool.query(
        "SELECT id, secret, is_enabled FROM tbl_user_two_factor WHERE user_id = ? LIMIT 1",
        [authUser.sub]
      );
      if (!rows.length) {
        return res.status(400).json({
          statusCode: 400,
          message: "Konfigurasi 2FA belum ditemukan. Mulai proses aktivasi terlebih dahulu.",
        });
      }

      const secret = decryptSecret(rows[0].secret);
      if (!verifyTotpCode(secret, code, 1)) {
        return res.status(400).json({
          statusCode: 400,
          message: "Kode authenticator tidak valid atau sudah kedaluwarsa. Coba kode terbaru.",
        });
      }

      await promisePool.query(
        "UPDATE tbl_user_two_factor SET is_enabled = 1, verified_at = NOW(), updated_at = NOW() WHERE id = ?",
        [rows[0].id]
      );

      return res.status(200).json({
        message: "Autentikasi dua faktor (2FA) berhasil diaktifkan.",
        data: { enabled: true },
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err?.message || "Gagal memverifikasi kode 2FA.",
      });
    }
  });

  expressApp.post("/api/v2/auth/2fa/regenerate-backup-codes", jsonParser, async (req, res) => {
    try {
      const authUser = extractBearerUser(req);
      if (!authUser) {
        return res.status(401).json({ statusCode: 401, message: "Unauthorized" });
      }
      const password = String(req.body?.password || "");
      if (!password) {
        return res.status(400).json({
          statusCode: 400,
          message: "Password wajib diisi untuk membuat ulang backup codes.",
        });
      }

      const [userRows] = await promisePool.query(
        "SELECT id, password FROM tbl_users WHERE id = ? LIMIT 1",
        [authUser.sub]
      );
      if (!userRows.length || !(await bcrypt.compare(password, userRows[0].password || ""))) {
        return res.status(400).json({
          statusCode: 400,
          message: "Password tidak sesuai.",
        });
      }

      await ensureTwoFactorTable(runQuery);
      const [rows] = await promisePool.query(
        "SELECT id, is_enabled FROM tbl_user_two_factor WHERE user_id = ? LIMIT 1",
        [authUser.sub]
      );
      if (!rows.length || Number(rows[0].is_enabled) !== 1) {
        return res.status(400).json({
          statusCode: 400,
          message: "Autentikasi dua faktor belum aktif pada akun ini.",
        });
      }

      const backupCodes = generateBackupCodes(10);
      const hashedBackupCodes = JSON.stringify(backupCodes.map(hashBackupCode));
      await promisePool.query(
        "UPDATE tbl_user_two_factor SET backup_codes = ?, updated_at = NOW() WHERE id = ?",
        [hashedBackupCodes, rows[0].id]
      );

      return res.status(200).json({
        message: "Backup codes baru berhasil dibuat. Kode lama sudah tidak berlaku.",
        data: { backup_codes: backupCodes },
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err?.message || "Gagal membuat ulang backup codes.",
      });
    }
  });

  expressApp.post("/api/v2/auth/2fa/disable", jsonParser, async (req, res) => {
    try {
      const authUser = extractBearerUser(req);
      if (!authUser) {
        return res.status(401).json({ statusCode: 401, message: "Unauthorized" });
      }
      const password = String(req.body?.password || "");
      if (!password) {
        return res.status(400).json({
          statusCode: 400,
          message: "Password wajib diisi untuk menonaktifkan 2FA.",
        });
      }

      const [userRows] = await promisePool.query(
        "SELECT id, password FROM tbl_users WHERE id = ? LIMIT 1",
        [authUser.sub]
      );
      if (!userRows.length || !(await bcrypt.compare(password, userRows[0].password || ""))) {
        return res.status(400).json({
          statusCode: 400,
          message: "Password tidak sesuai.",
        });
      }

      await ensureTwoFactorTable(runQuery);
      await promisePool.query(
        "DELETE FROM tbl_user_two_factor WHERE user_id = ?",
        [authUser.sub]
      );

      return res.status(200).json({
        message: "Autentikasi dua faktor telah dinonaktifkan.",
        data: { enabled: false },
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err?.message || "Gagal menonaktifkan 2FA.",
      });
    }
  });

  expressApp.post("/api/v2/auth/2fa/verify-login", jsonParser, async (req, res) => {
    try {
      const twoFactorToken = String(req.body?.two_factor_token || "");
      const code = String(req.body?.code || "").trim();
      const useBackupCode = Boolean(req.body?.use_backup_code);
      const trustDevice = Boolean(req.body?.trust_device);

      if (!twoFactorToken || !code) {
        return res.status(400).json({
          statusCode: 400,
          message: "Token sesi 2FA dan kode verifikasi wajib diisi.",
        });
      }

      let challenge;
      try {
        challenge = jwt.verify(twoFactorToken, getJwtSecret());
      } catch {
        return res.status(401).json({
          statusCode: 401,
          message: "Sesi verifikasi 2FA telah kedaluwarsa. Silakan masuk ulang.",
        });
      }

      if (!challenge || challenge.type !== "2fa_challenge" || !challenge.sub) {
        return res.status(401).json({
          statusCode: 401,
          message: "Token verifikasi 2FA tidak valid.",
        });
      }

      await ensureTwoFactorTable(runQuery);
      const [tfRows] = await promisePool.query(
        "SELECT id, secret, backup_codes, is_enabled FROM tbl_user_two_factor WHERE user_id = ? LIMIT 1",
        [challenge.sub]
      );
      if (!tfRows.length || Number(tfRows[0].is_enabled) !== 1) {
        return res.status(400).json({
          statusCode: 400,
          message: "Autentikasi dua faktor tidak aktif untuk akun ini.",
        });
      }

      const tfRecord = tfRows[0];
      if (useBackupCode) {
        const storedHashes = parseStoredHashes(tfRecord.backup_codes);
        const targetHash = hashBackupCode(code);
        const matchIdx = storedHashes.findIndex((h) => {
          if (typeof h !== "string" || h.length !== targetHash.length) return false;
          return crypto.timingSafeEqual(Buffer.from(h, "utf8"), Buffer.from(targetHash, "utf8"));
        });
        if (matchIdx === -1) {
          return res.status(401).json({
            statusCode: 401,
            message: "Backup code tidak valid atau sudah pernah digunakan.",
          });
        }
        storedHashes.splice(matchIdx, 1);
        await promisePool.query(
          "UPDATE tbl_user_two_factor SET backup_codes = ?, updated_at = NOW() WHERE id = ?",
          [JSON.stringify(storedHashes), tfRecord.id]
        );
      } else {
        const secret = decryptSecret(tfRecord.secret);
        if (!verifyTotpCode(secret, code, 1)) {
          return res.status(401).json({
            statusCode: 401,
            message: "Kode authenticator tidak valid atau sudah kedaluwarsa.",
          });
        }
      }

      const userData = await loadFullLegacyUser(promisePool, challenge.sub);
      if (!userData || userData.is_deleted) {
        return res.status(401).json({
          statusCode: 401,
          message: "Akun tidak ditemukan atau telah dinonaktifkan.",
        });
      }

      const payload = {
        sub: userData.id,
        access: userData.access,
        email: userData.email,
      };
      const access_token = jwt.sign(payload, getJwtSecret(), { expiresIn: "1d" });
      const refresh_token = jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });

      await promisePool.query(
        "INSERT INTO tbl_refresh_tokens (token, user_id, created_at) VALUES (?, ?, NOW())",
        [refresh_token, userData.id]
      );
      await promisePool.query(
        "INSERT INTO tbl_user_login_histories (user_id, is_login, created_at) VALUES (?, 1, NOW())",
        [userData.id]
      );

      const trust_device_token = trustDevice ? signTrustDeviceToken(userData.id) : null;

      return res.status(200).json({
        message: "User logged in successfully",
        data: {
          ...userData,
          access_token,
          refresh_token,
          ...(trust_device_token ? { trust_device_token } : {}),
        },
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err?.message || "Gagal memverifikasi 2FA.",
      });
    }
  });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountBetterAuth = mountBetterAuth;

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const {
  isUserTwoFactorEnabled,
  signTwoFactorChallenge,
  mountLegacyTwoFactorRoutes,
} = require("./two-factor-legacy");

function loadFallbackEnvFile() {
  const keys = [
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "BETTER_AUTH_API_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "CLIENT_URL",
    "JWT_SECRET",
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PASS",
    "DB_NAME",
  ];
  const candidates =
    process.env.NODE_ENV === "production"
      ? [".env.production", ".env"]
      : [".env", ".env.production"];

  for (const name of candidates) {
    const filePath = path.join(__dirname, "..", name);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const idx = line.indexOf("=");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      if (!keys.includes(key) || process.env[key]) continue;
      let val = line.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (val) process.env[key] = val;
    }
  }
}

function getClientUrl() {
  return (process.env.CLIENT_URL || "https://zidansport.org").replace(/\/+$/, "");
}

function getApiBaseUrl() {
  const explicit = (process.env.BETTER_AUTH_API_URL || "").replace(/\/+$/, "");
  if (explicit) return explicit;
  const configured = (process.env.BETTER_AUTH_URL || "").replace(/\/+$/, "");
  if (configured && configured.includes("api-v2.")) return configured;
  return "https://api-v2.zidansport.org";
}

function makeAbbreviation(name) {
  const words = String(name || "KT")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) {
    return words
      .map((w) => w[0])
      .join("")
      .slice(0, 8)
      .toUpperCase();
  }
  return String(name || "KTG")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase() || "KTG";
}

async function ensureLegacyUser(promisePool, betterAuthUser, requestedAccess) {
  const email = String(betterAuthUser.email || "").trim().toLowerCase();
  if (!email) {
    throw new Error("Email dari akun Google tidak tersedia.");
  }

  const [existingRows] = await promisePool.query(
    "SELECT id, access, email, is_deleted FROM tbl_users WHERE LOWER(TRIM(email)) = ? LIMIT 1",
    [email]
  );

  if (existingRows.length > 0) {
    const existing = existingRows[0];
    if (existing.is_deleted) {
      throw new Error("Akun ini telah dinonaktifkan.");
    }
    return existing;
  }

  const access = [1, 2, 3].includes(Number(requestedAccess))
    ? Number(requestedAccess)
    : 3;
  const displayName =
    String(betterAuthUser.name || "").trim() || email.split("@")[0];
  const photo =
    betterAuthUser.image && String(betterAuthUser.image).trim()
      ? String(betterAuthUser.image).trim()
      : "";
  const randomPasswordHash = await bcrypt.hash(
    crypto.randomBytes(32).toString("hex"),
    10
  );

  const conn = await promisePool.getConnection();
  try {
    await conn.beginTransaction();

    const [insertResult] = await conn.query(
      `INSERT INTO tbl_users (name, email, password, gender, date_of_birth, access, phone, is_verified, photo, is_deleted, created_at, updated_at)
       VALUES (?, ?, ?, 1, NULL, ?, '', 1, ?, 0, NOW(), NOW())`,
      [displayName, email, randomPasswordHash, access, photo]
    );

    const newUserId = insertResult.insertId;
    const padded8 = `000000${newUserId}`.slice(-8);
    const padded6 = `000000${newUserId}`.slice(-6);

    if (access === 1) {
      await conn.query(
        `INSERT INTO tbl_contingents (user_id, code, name, abbreviation, logo, is_ban, is_verified, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 0, 0, NOW(), NOW())`,
        [
          newUserId,
          `CT${padded8}`,
          displayName,
          makeAbbreviation(displayName),
          photo,
        ]
      );
    } else if (access === 2) {
      await conn.query(
        `INSERT INTO tbl_coaches (user_id, code, name, gender, date_of_birth, photo, created_at, updated_at)
         VALUES (?, ?, ?, 1, NULL, ?, NOW(), NOW())`,
        [newUserId, `FKIDC${padded6}`, displayName, photo]
      );
    } else {
      const [athleteRes] = await conn.query(
        `INSERT INTO tbl_athletes (user_id, code, name, gender, point, date_of_birth, photo, created_at, updated_at)
         VALUES (?, ?, ?, 1, 50, NULL, ?, NOW(), NOW())`,
        [newUserId, `FKIDA${padded6}`, displayName, photo]
      );
      await conn.query(
        `INSERT INTO tbl_athlete_point_histories (athlete_id, point, is_extra_point, description, created_at)
         VALUES (?, 50, 1, 'Poin registrasi sistem', NOW())`,
        [athleteRes.insertId]
      );
    }

    await conn.commit();
    return { id: newUserId, access, email };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function mountBetterAuth(expressApp) {
  loadFallbackEnvFile();

  const { betterAuth } = await import("better-auth");
  const { toNodeHandler, fromNodeHeaders } = await import("better-auth/node");
  const { hashPassword, verifyPassword } = await import("better-auth/crypto");
  const { twoFactor } = await import("better-auth/plugins");
  const { MysqlDialect } = await import("kysely");

  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    waitForConnections: true,
  });
  const promisePool = pool.promise();

  const apiBaseUrl = getApiBaseUrl();
  const clientUrl = getClientUrl();

  const auth = betterAuth({
    appName: "Zidan Sport",
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: apiBaseUrl,
    trustedOrigins: [
      clientUrl,
      "https://zidansport.org",
      "https://www.zidansport.org",
      apiBaseUrl,
      "http://localhost:3000",
    ],
    database: {
      dialect: new MysqlDialect({ pool }),
      type: "mysql",
    },
    emailAndPassword: {
      enabled: true,
      password: {
        hash: hashPassword,
        verify: async ({ hash, password }) => {
          if (/^\$2[aby]\$/.test(hash)) {
            return bcrypt.compare(password, hash);
          }
          return verifyPassword({ hash, password });
        },
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      },
    },
    plugins: [
      twoFactor({
        issuer: "Zidan Sport",
      }),
    ],
  });

  mountLegacyTwoFactorRoutes(expressApp, promisePool);

  const nodeHandler = toNodeHandler(auth);

  expressApp.get("/api/v2/auth/google-start", async (req, res) => {
    try {
      const accessParam = Number(req.query.access);
      const accessQuery = [1, 2, 3].includes(accessParam)
        ? `?access=${accessParam}`
        : "";
      const callbackURL = `${apiBaseUrl}/api/v2/auth/google-bridge${accessQuery}`;
      const errorCallbackURL = `${clientUrl}/auth/login#google_error=oauth_failed`;

      const authResponse = await auth.api.signInSocial({
        body: {
          provider: "google",
          callbackURL,
          errorCallbackURL,
          disableRedirect: true,
        },
        headers: fromNodeHeaders(req.headers),
        asResponse: true,
      });

      const setCookies =
        typeof authResponse.headers.getSetCookie === "function"
          ? authResponse.headers.getSetCookie()
          : [];
      if (setCookies.length > 0) {
        res.setHeader("Set-Cookie", setCookies);
      }

      const payload = await authResponse.json().catch(() => null);
      if (payload && payload.url) {
        return res.redirect(302, payload.url);
      }

      const reason = encodeURIComponent(
        (payload && payload.message) || "google_init_failed"
      );
      return res.redirect(302, `${clientUrl}/auth/login#google_error=${reason}`);
    } catch (err) {
      const reason = encodeURIComponent(err?.message || "google_init_error");
      return res.redirect(302, `${clientUrl}/auth/login#google_error=${reason}`);
    }
  });

  expressApp.get("/api/v2/auth/google-bridge", async (req, res) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session || !session.user || !session.user.email) {
        return res.redirect(
          302,
          `${clientUrl}/auth/login#google_error=session_not_found`
        );
      }

      const requestedAccess = Number(req.query.access);
      const legacyUser = await ensureLegacyUser(
        promisePool,
        session.user,
        requestedAccess
      );

      if (await isUserTwoFactorEnabled(promisePool, legacyUser.id)) {
        const challengeToken = signTwoFactorChallenge(legacyUser);
        return res.redirect(
          302,
          `${clientUrl}/auth/login#two_factor_token=${encodeURIComponent(challengeToken)}&email=${encodeURIComponent(legacyUser.email)}`
        );
      }

      const jwtPayload = {
        sub: legacyUser.id,
        access: legacyUser.access,
        email: legacyUser.email,
      };
      const refreshToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      await promisePool.query(
        "INSERT INTO tbl_refresh_tokens (token, user_id, created_at) VALUES (?, ?, NOW())",
        [refreshToken, legacyUser.id]
      );
      await promisePool.query(
        "INSERT INTO tbl_user_login_histories (user_id, is_login, created_at) VALUES (?, 1, NOW())",
        [legacyUser.id]
      );

      return res.redirect(
        302,
        `${clientUrl}/auth/login#google_refresh=${encodeURIComponent(refreshToken)}`
      );
    } catch (err) {
      const reason = encodeURIComponent(err?.message || "google_bridge_failed");
      return res.redirect(302, `${clientUrl}/auth/login#google_error=${reason}`);
    }
  });

  expressApp.use("/api/auth", nodeHandler);

  return auth;
}

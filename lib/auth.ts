import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { prisma } from "./prisma";

const AUTH_ENV_KEYS = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

function loadAuthEnvFallback(): void {
  const missing = AUTH_ENV_KEYS.filter((key) => !process.env[key]);
  if (missing.length === 0) return;

  const isProd = process.env.NODE_ENV === "production";
  const candidateFiles = isProd
    ? [
      "api-v2.zidansport.org/.env.production",
      "api-v2.zidansport.org/.env",
      "api.zidansport.org/.env.production",
      "api.zidansport.org/.env",
    ]
    : [
      "api-v2.zidansport.org/.env",
      "api.zidansport.org/.env",
      "api-v2.zidansport.org/.env.production",
      "api.zidansport.org/.env.production",
    ];

  for (const relativePath of candidateFiles) {
    const filePath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = line.slice(0, separatorIndex).trim();
      if (
        !AUTH_ENV_KEYS.includes(key as (typeof AUTH_ENV_KEYS)[number]) ||
        process.env[key]
      ) {
        continue;
      }

      let value = line.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (value) {
        process.env[key] = value;
      }
    }

    if (AUTH_ENV_KEYS.every((key) => Boolean(process.env[key]))) {
      break;
    }
  }
}

loadAuthEnvFallback();

export const auth = betterAuth({
  appName: "Zidan Sport",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
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
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    twoFactor({
      issuer: "Zidan Sport",
    }),
    nextCookies(),
  ],
});

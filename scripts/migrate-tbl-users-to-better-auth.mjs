import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

function loadRootEnv() {
  if (process.env.DATABASE_URL) return;
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    if (process.env[key]) continue;

    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadRootEnv();

const isDryRun = process.argv.includes("--dry-run");
const prisma = new PrismaClient();

function toValidDate(value) {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL tidak ditemukan di environment atau .env");
  }

  console.log(
    isDryRun
      ? "[DRY RUN] Membaca user dari tbl_users tanpa menulis perubahan..."
      : "Memulai migrasi user dari tbl_users ke tabel Better Auth (user & account)..."
  );

  const legacyUsers = await prisma.$queryRaw`
    SELECT
      id,
      name,
      email,
      password,
      is_verified,
      photo,
      created_at,
      updated_at
    FROM tbl_users
    WHERE (is_deleted = 0 OR is_deleted IS NULL)
      AND email IS NOT NULL
      AND TRIM(email) <> ''
    ORDER BY id ASC
  `;

  console.log(`Ditemukan ${legacyUsers.length} user aktif di tbl_users.`);

  let createdUsers = 0;
  let existingUsers = 0;
  let createdAccounts = 0;
  let skippedAccounts = 0;
  let skippedInvalid = 0;

  for (const row of legacyUsers) {
    const email = String(row.email || "").trim().toLowerCase();
    if (!email) {
      skippedInvalid += 1;
      continue;
    }

    const name = String(row.name || "").trim() || email.split("@")[0];
    const emailVerified = Boolean(row.is_verified);
    const image =
      row.photo && String(row.photo).trim() !== ""
        ? String(row.photo).trim()
        : null;
    const createdAt = toValidDate(row.created_at);
    const updatedAt = toValidDate(row.updated_at);
    const legacyPassword =
      row.password && String(row.password).trim() !== ""
        ? String(row.password).trim()
        : null;

    let targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      let candidateId = String(row.id);
      const idTaken = await prisma.user.findUnique({
        where: { id: candidateId },
        select: { id: true },
      });
      if (idTaken) {
        candidateId = `legacy_${row.id}`;
      }

      if (isDryRun) {
        targetUser = { id: candidateId, email };
      } else {
        targetUser = await prisma.user.create({
          data: {
            id: candidateId,
            name,
            email,
            emailVerified,
            image,
            createdAt,
            updatedAt,
          },
        });
      }
      createdUsers += 1;
    } else {
      existingUsers += 1;
    }

    if (!legacyPassword) {
      skippedAccounts += 1;
      continue;
    }

    const existingCredential = await prisma.account.findFirst({
      where: {
        userId: targetUser.id,
        providerId: "credential",
      },
      select: { id: true },
    });

    if (existingCredential) {
      skippedAccounts += 1;
      continue;
    }

    if (!isDryRun) {
      await prisma.account.create({
        data: {
          id: `legacy_cred_${targetUser.id}`,
          accountId: targetUser.id,
          providerId: "credential",
          userId: targetUser.id,
          password: legacyPassword,
          createdAt,
          updatedAt,
        },
      });
    }
    createdAccounts += 1;
  }

  console.log("Ringkasan migrasi:", {
    mode: isDryRun ? "dry-run" : "apply",
    totalLegacyUsers: legacyUsers.length,
    createdUsers,
    existingUsers,
    createdAccounts,
    skippedAccounts,
    skippedInvalid,
  });
}

main()
  .catch((error) => {
    console.error("Migrasi gagal:", error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TwoFactorSettingsProps {
  initialEnabled: boolean;
  hasPasswordAccount: boolean;
  userEmail: string;
}

interface PendingSetupData {
  totpURI: string;
  qrDataUrl: string;
  manualSecret: string | null;
  backupCodes: string[];
}

function extractSecretFromTotpUri(uri: string): string | null {
  try {
    return new URL(uri).searchParams.get("secret");
  } catch {
    return null;
  }
}

function mapTwoFactorError(
  error: { code?: string | null; message?: string | null } | null | undefined,
  fallback: string
): string {
  switch (error?.code) {
    case "INVALID_PASSWORD":
      return "Password tidak sesuai. Periksa kembali password kamu.";
    case "INVALID_CODE":
      return "Kode authenticator tidak valid atau sudah kedaluwarsa. Masukkan kode 6 digit terbaru.";
    case "TOTP_ALREADY_ENABLED":
      return "Autentikasi dua faktor sudah aktif pada akun ini.";
    case "TWO_FACTOR_NOT_ENABLED":
    case "TOTP_NOT_ENABLED":
      return "Autentikasi dua faktor belum aktif pada akun ini.";
    case "ACCOUNT_TEMPORARILY_LOCKED":
      return "Terlalu banyak percobaan gagal. Coba lagi beberapa menit lagi.";
    default:
      return error?.message || fallback;
  }
}

export function TwoFactorSettings({
  initialEnabled,
  hasPasswordAccount,
  userEmail,
}: TwoFactorSettingsProps) {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(initialEnabled);

  const [enablePassword, setEnablePassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [regeneratePassword, setRegeneratePassword] = useState("");
  const [disablePassword, setDisablePassword] = useState("");

  const [setupData, setSetupData] = useState<PendingSetupData | null>(null);
  const [visibleBackupCodes, setVisibleBackupCodes] = useState<string[] | null>(
    null
  );

  const [activeAction, setActiveAction] = useState<
    "enable" | "verify" | "regenerate" | "disable" | null
  >(null);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [copiedTarget, setCopiedTarget] = useState<"secret" | "codes" | null>(
    null
  );

  const isBusy = activeAction !== null;

  const copyText = async (text: string, target: "secret" | "codes") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
      window.setTimeout(() => {
        setCopiedTarget((current) => (current === target ? null : current));
      }, 2500);
    } catch {
      setError("Gagal menyalin ke clipboard. Salin teks secara manual.");
    }
  };

  const downloadBackupCodes = (codes: string[]) => {
    const content = [
      "Zidan Sport - Backup Codes Autentikasi Dua Faktor (2FA)",
      `Akun: ${userEmail}`,
      "Setiap kode hanya dapat digunakan satu kali.",
      "",
      ...codes,
      "",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zidansport-2fa-backup-codes.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleStartEnable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    if (!enablePassword) {
      setError("Masukkan password akun kamu untuk memulai aktivasi 2FA.");
      return;
    }

    setActiveAction("enable");

    try {
      const { data, error: enableError } = await authClient.twoFactor.enable({
        password: enablePassword,
      });

      if (enableError || !data || !("totpURI" in data)) {
        setError(
          mapTwoFactorError(
            enableError,
            "Gagal membuat konfigurasi 2FA. Coba lagi."
          )
        );
        return;
      }

      const qrDataUrl = await QRCode.toDataURL(data.totpURI, {
        width: 220,
        margin: 2,
        errorCorrectionLevel: "M",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      setSetupData({
        totpURI: data.totpURI,
        qrDataUrl,
        manualSecret: extractSecretFromTotpUri(data.totpURI),
        backupCodes: data.backupCodes ?? [],
      });
      setEnablePassword("");
      setVerifyCode("");
    } catch {
      setError("Terjadi kesalahan saat menyiapkan QR code 2FA. Coba lagi.");
    } finally {
      setActiveAction(null);
    }
  };

  const handleVerifySetup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    const normalizedCode = verifyCode.replace(/\s+/g, "");
    if (!/^\d{6}$/.test(normalizedCode)) {
      setError("Masukkan kode 6 digit angka dari aplikasi authenticator.");
      return;
    }

    setActiveAction("verify");

    try {
      const { error: verifyError } = await authClient.twoFactor.verifyTotp({
        code: normalizedCode,
      });

      if (verifyError) {
        setError(
          mapTwoFactorError(
            verifyError,
            "Verifikasi kode gagal. Pastikan waktu perangkat sinkron dan coba lagi."
          )
        );
        return;
      }

      const savedCodes = setupData?.backupCodes ?? [];
      setIsEnabled(true);
      setSetupData(null);
      setVerifyCode("");
      if (savedCodes.length > 0) {
        setVisibleBackupCodes(savedCodes);
      }
      setStatusMessage(
        "Autentikasi dua faktor berhasil diaktifkan. Simpan backup codes kamu di tempat aman."
      );
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat memverifikasi kode 2FA. Coba lagi.");
    } finally {
      setActiveAction(null);
    }
  };

  const handleRegenerateBackupCodes = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    if (!regeneratePassword) {
      setError("Masukkan password untuk membuat ulang backup codes.");
      return;
    }

    setActiveAction("regenerate");

    try {
      const { data, error: regenError } =
        await authClient.twoFactor.generateBackupCodes({
          password: regeneratePassword,
        });

      if (regenError || !data?.backupCodes) {
        setError(
          mapTwoFactorError(
            regenError,
            "Gagal membuat ulang backup codes. Coba lagi."
          )
        );
        return;
      }

      setVisibleBackupCodes(data.backupCodes);
      setRegeneratePassword("");
      setStatusMessage(
        "Backup codes baru berhasil dibuat. Semua backup codes sebelumnya sudah tidak berlaku."
      );
    } catch {
      setError("Terjadi kesalahan saat membuat ulang backup codes.");
    } finally {
      setActiveAction(null);
    }
  };

  const handleDisableTwoFactor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    if (!disablePassword) {
      setError("Masukkan password untuk menonaktifkan 2FA.");
      return;
    }

    setActiveAction("disable");

    try {
      const { error: disableError } = await authClient.twoFactor.disable({
        password: disablePassword,
      });

      if (disableError) {
        setError(
          mapTwoFactorError(
            disableError,
            "Gagal menonaktifkan 2FA. Periksa password kamu dan coba lagi."
          )
        );
        return;
      }

      setIsEnabled(false);
      setSetupData(null);
      setVisibleBackupCodes(null);
      setDisablePassword("");
      setStatusMessage("Autentikasi dua faktor telah dinonaktifkan.");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat menonaktifkan 2FA. Coba lagi.");
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">
              Autentikasi Dua Faktor (2FA)
            </CardTitle>
            <CardDescription>
              Tambahkan lapisan verifikasi menggunakan aplikasi authenticator
              (Google Authenticator, Authy, 1Password, atau sejenisnya) saat
              masuk ke akun {userEmail}.
            </CardDescription>
          </div>
          <span
            className={
              isEnabled
                ? "inline-flex w-fit shrink-0 items-center rounded-md border border-border bg-secondary px-3 py-1 text-xs font-semibold text-foreground"
                : "inline-flex w-fit shrink-0 items-center rounded-md border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
            }
          >
            {isEnabled ? "Status: Aktif" : "Status: Belum aktif"}
          </span>
        </CardHeader>

        <CardContent className="space-y-5 border-t border-border pt-6">
          {error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
            >
              <span className="font-medium">Terjadi kendala: </span>
              {error}
            </div>
          ) : null}

          {statusMessage ? (
            <div
              role="status"
              className="rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground"
            >
              {statusMessage}
            </div>
          ) : null}

          {!hasPasswordAccount ? (
            <div className="rounded-md border border-border bg-background p-4 text-sm text-muted-foreground">
              Akun ini masuk menggunakan penyedia eksternal (seperti Google) dan
              belum memiliki password lokal. Better Auth memerlukan akun dengan
              password untuk mengaktifkan dan mengelola 2FA.
            </div>
          ) : null}

          {hasPasswordAccount && !isEnabled && !setupData ? (
            <form
              onSubmit={handleStartEnable}
              className="max-w-md space-y-4"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="enable-2fa-password">
                  Konfirmasi password akun
                </Label>
                <Input
                  id="enable-2fa-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Masukkan password kamu"
                  value={enablePassword}
                  onChange={(e) => setEnablePassword(e.target.value)}
                  disabled={isBusy}
                  required
                  aria-invalid={Boolean(error)}
                />
                <p className="text-xs text-muted-foreground">
                  Password dibutuhkan untuk membuat QR code dan backup codes
                  baru.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isBusy}
                aria-busy={activeAction === "enable"}
              >
                {activeAction === "enable"
                  ? "Menyiapkan 2FA..."
                  : "Mulai Aktivasi 2FA"}
              </Button>
            </form>
          ) : null}

          {hasPasswordAccount && !isEnabled && setupData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <section
                  aria-labelledby="qr-step-heading"
                  className="space-y-4 rounded-md border border-border p-4"
                >
                  <div className="space-y-1">
                    <h3
                      id="qr-step-heading"
                      className="text-base font-semibold text-foreground"
                    >
                      1. Pindai QR code di aplikasi authenticator
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Buka aplikasi authenticator kamu, pilih tambah akun, lalu
                      pindai QR code di bawah ini.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="rounded-md border border-border bg-white p-3">
                      <img
                        src={setupData.qrDataUrl}
                        alt="QR code untuk menghubungkan aplikasi authenticator"
                        width={220}
                        height={220}
                        className="h-[220px] w-[220px]"
                      />
                    </div>
                  </div>

                  {setupData.manualSecret ? (
                    <div className="space-y-2 border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground">
                        Tidak bisa memindai? Masukkan kunci rahasia ini secara
                        manual:
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="break-all rounded border border-border bg-secondary px-2.5 py-1.5 font-mono text-xs text-foreground">
                          {setupData.manualSecret}
                        </code>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyText(setupData.manualSecret!, "secret")
                          }
                        >
                          {copiedTarget === "secret"
                            ? "Kunci tersalin"
                            : "Salin kunci"}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </section>

                <section
                  aria-labelledby="backup-step-heading"
                  className="space-y-4 rounded-md border border-border p-4"
                >
                  <div className="space-y-1">
                    <h3
                      id="backup-step-heading"
                      className="text-base font-semibold text-foreground"
                    >
                      2. Simpan backup codes
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Gunakan salah satu kode ini jika kamu kehilangan akses ke
                      aplikasi authenticator. Setiap kode hanya berlaku satu
                      kali.
                    </p>
                  </div>

                  <ul className="grid grid-cols-2 gap-2">
                    {setupData.backupCodes.map((code) => (
                      <li
                        key={code}
                        className="rounded border border-border bg-secondary px-3 py-2 text-center font-mono text-xs font-medium text-foreground"
                      >
                        {code}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyText(setupData.backupCodes.join("\n"), "codes")
                      }
                    >
                      {copiedTarget === "codes"
                        ? "Kode tersalin"
                        : "Salin semua kode"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => downloadBackupCodes(setupData.backupCodes)}
                    >
                      Unduh (.txt)
                    </Button>
                  </div>
                </section>
              </div>

              <section
                aria-labelledby="verify-step-heading"
                className="rounded-md border border-border p-4"
              >
                <div className="mb-4 space-y-1">
                  <h3
                    id="verify-step-heading"
                    className="text-base font-semibold text-foreground"
                  >
                    3. Verifikasi kode dari aplikasi authenticator
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Masukkan kode 6 digit yang tampil di aplikasi authenticator
                    untuk menyelesaikan aktivasi 2FA.
                  </p>
                </div>

                <form
                  onSubmit={handleVerifySetup}
                  className="max-w-md space-y-4"
                  noValidate
                >
                  <div className="space-y-2">
                    <Label htmlFor="setup-totp-code">
                      Kode 6 digit authenticator
                    </Label>
                    <Input
                      id="setup-totp-code"
                      name="code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="000000"
                      value={verifyCode}
                      onChange={(e) =>
                        setVerifyCode(e.target.value.replace(/\D/g, ""))
                      }
                      disabled={isBusy}
                      required
                      className="font-mono tracking-widest"
                      aria-invalid={Boolean(error)}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      disabled={isBusy}
                      aria-busy={activeAction === "verify"}
                    >
                      {activeAction === "verify"
                        ? "Memverifikasi..."
                        : "Verifikasi & Aktifkan 2FA"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isBusy}
                      onClick={() => {
                        setSetupData(null);
                        setVerifyCode("");
                        setError("");
                      }}
                    >
                      Batalkan
                    </Button>
                  </div>
                </form>
              </section>
            </div>
          ) : null}

          {visibleBackupCodes && isEnabled ? (
            <section
              aria-labelledby="saved-backup-heading"
              className="space-y-4 rounded-md border border-border bg-background p-4"
            >
              <div className="space-y-1">
                <h3
                  id="saved-backup-heading"
                  className="text-base font-semibold text-foreground"
                >
                  Backup Codes Aktif
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kode ini hanya ditampilkan sekarang. Pastikan kamu sudah
                  menyalin atau mengunduhnya sebelum menutup panel ini.
                </p>
              </div>

              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {visibleBackupCodes.map((code) => (
                  <li
                    key={code}
                    className="rounded border border-border bg-secondary px-3 py-2 text-center font-mono text-xs font-medium text-foreground"
                  >
                    {code}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyText(visibleBackupCodes.join("\n"), "codes")
                  }
                >
                  {copiedTarget === "codes"
                    ? "Kode tersalin"
                    : "Salin semua kode"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => downloadBackupCodes(visibleBackupCodes)}
                >
                  Unduh (.txt)
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleBackupCodes(null)}
                >
                  Saya sudah menyimpannya
                </Button>
              </div>
            </section>
          ) : null}
        </CardContent>
      </Card>

      {hasPasswordAccount && isEnabled ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">Buat Ulang Backup Codes</CardTitle>
              <CardDescription>
                Buat daftar backup codes baru. Semua backup codes lama akan
                otomatis dinonaktifkan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleRegenerateBackupCodes}
                className="space-y-4"
                noValidate
              >
                <div className="space-y-2">
                  <Label htmlFor="regenerate-backup-password">
                    Password akun
                  </Label>
                  <Input
                    id="regenerate-backup-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Masukkan password kamu"
                    value={regeneratePassword}
                    onChange={(e) => setRegeneratePassword(e.target.value)}
                    disabled={isBusy}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isBusy}
                  aria-busy={activeAction === "regenerate"}
                >
                  {activeAction === "regenerate"
                    ? "Membuat ulang..."
                    : "Buat Ulang Backup Codes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">Nonaktifkan 2FA</CardTitle>
              <CardDescription>
                Menonaktifkan 2FA akan menghapus verifikasi authenticator dari
                proses masuk akun kamu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleDisableTwoFactor}
                className="space-y-4"
                noValidate
              >
                <div className="space-y-2">
                  <Label htmlFor="disable-2fa-password">Password akun</Label>
                  <Input
                    id="disable-2fa-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Masukkan password kamu"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    disabled={isBusy}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isBusy}
                  aria-busy={activeAction === "disable"}
                >
                  {activeAction === "disable"
                    ? "Menonaktifkan..."
                    : "Nonaktifkan 2FA"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

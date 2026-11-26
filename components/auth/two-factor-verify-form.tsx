"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VerificationMethod = "totp" | "backup";

function mapVerifyError(
  error: { code?: string | null; message?: string | null } | null | undefined,
  method: VerificationMethod
): string {
  switch (error?.code) {
    case "INVALID_CODE":
      return "Kode authenticator tidak valid atau sudah kedaluwarsa. Coba kode terbaru.";
    case "INVALID_BACKUP_CODE":
      return "Backup code tidak valid atau sudah pernah digunakan.";
    case "INVALID_TWO_FACTOR_COOKIE":
      return "Sesi verifikasi 2FA telah kedaluwarsa. Silakan masuk ulang dari halaman login.";
    case "TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE":
      return "Terlalu banyak percobaan gagal. Silakan masuk ulang dari halaman login.";
    case "ACCOUNT_TEMPORARILY_LOCKED":
      return "Akun terkunci sementara karena terlalu banyak percobaan verifikasi gagal. Coba lagi nanti.";
    default:
      return (
        error?.message ||
        (method === "totp"
          ? "Gagal memverifikasi kode authenticator. Coba lagi."
          : "Gagal memverifikasi backup code. Coba lagi.")
      );
  }
}

export function TwoFactorVerifyForm() {
  const router = useRouter();
  const [method, setMethod] = useState<VerificationMethod>("totp");
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const switchMethod = (nextMethod: VerificationMethod) => {
    if (nextMethod === method) return;
    setMethod(nextMethod);
    setCode("");
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedCode = code.trim();
    if (method === "totp") {
      const normalizedTotp = trimmedCode.replace(/\s+/g, "");
      if (!/^\d{6}$/.test(normalizedTotp)) {
        setError("Masukkan kode 6 digit angka dari aplikasi authenticator.");
        return;
      }

      setIsPending(true);
      try {
        const { error: verifyError } = await authClient.twoFactor.verifyTotp({
          code: normalizedTotp,
          trustDevice,
        });

        if (verifyError) {
          setError(mapVerifyError(verifyError, "totp"));
          setIsPending(false);
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } catch {
        setError("Terjadi kesalahan saat verifikasi 2FA. Coba lagi.");
        setIsPending(false);
      }
      return;
    }

    if (!trimmedCode) {
      setError("Masukkan salah satu backup code kamu.");
      return;
    }

    setIsPending(true);
    try {
      const { error: verifyError } =
        await authClient.twoFactor.verifyBackupCode({
          code: trimmedCode,
          trustDevice,
        });

      if (verifyError) {
        setError(mapVerifyError(verifyError, "backup"));
        setIsPending(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat verifikasi backup code. Coba lagi.");
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Verifikasi Dua Faktor
        </h1>
        <CardDescription>
          {method === "totp"
            ? "Masukkan kode 6 digit dari aplikasi authenticator untuk menyelesaikan login."
            : "Masukkan salah satu backup code yang kamu simpan saat mengaktifkan 2FA."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div
          role="group"
          aria-label="Pilih metode verifikasi 2FA"
          className="grid grid-cols-2 gap-2"
        >
          <Button
            type="button"
            variant={method === "totp" ? "default" : "outline"}
            onClick={() => switchMethod("totp")}
            disabled={isPending}
            aria-pressed={method === "totp"}
          >
            Authenticator
          </Button>
          <Button
            type="button"
            variant={method === "backup" ? "default" : "outline"}
            onClick={() => switchMethod("backup")}
            disabled={isPending}
            aria-pressed={method === "backup"}
          >
            Backup Code
          </Button>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
          >
            <span className="font-medium">Verifikasi gagal: </span>
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {method === "totp" ? (
            <div className="space-y-2">
              <Label htmlFor="two-factor-totp">Kode authenticator</Label>
              <Input
                id="two-factor-totp"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                disabled={isPending}
                required
                className="font-mono tracking-widest"
                aria-invalid={Boolean(error)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="two-factor-backup">Backup code</Label>
              <Input
                id="two-factor-backup"
                name="backupCode"
                type="text"
                autoComplete="one-time-code"
                placeholder="Masukkan backup code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isPending}
                required
                className="font-mono"
                aria-invalid={Boolean(error)}
              />
            </div>
          )}

          <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              disabled={isPending}
              className="h-4 w-4 cursor-pointer rounded border border-input accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <span>Percayai perangkat ini selama 30 hari</span>
          </label>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Memverifikasi..." : "Verifikasi & Masuk"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          Ingin menggunakan akun lain?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Kembali ke halaman masuk
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

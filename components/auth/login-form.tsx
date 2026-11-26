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
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setIsPending(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: trimmedEmail,
        password,
        callbackURL: "/dashboard",
      });

      if (signInError) {
        setError(
          signInError.message || "Email atau password tidak sesuai. Coba lagi."
        );
        setIsPending(false);
        return;
      }

      if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
        router.push("/two-factor");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat masuk. Coba beberapa saat lagi.");
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Masuk ke akun
        </h1>
        <CardDescription>
          Gunakan email dan password terdaftar, atau lanjutkan dengan Google.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
          >
            <span className="font-medium">Gagal masuk: </span>
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="relative flex items-center py-1">
          <div className="grow border-t border-border" />
          <span className="mx-3 shrink-0 text-xs text-muted-foreground">
            atau
          </span>
          <div className="grow border-t border-border" />
        </div>

        <GoogleAuthButton
          callbackURL="/dashboard"
          disabled={isPending}
          onError={(message) => setError(message)}
        />
      </CardContent>

      <CardFooter className="justify-center border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Daftar di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

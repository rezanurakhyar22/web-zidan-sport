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

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setError("Password harus terdiri dari minimal 8 karakter.");
      return;
    }

    setIsPending(true);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
        callbackURL: "/dashboard",
      });

      if (signUpError) {
        setError(
          signUpError.message || "Gagal mendaftar. Periksa data kamu dan coba lagi."
        );
        setIsPending(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat membuat akun. Coba beberapa saat lagi.");
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Buat akun baru
        </h1>
        <CardDescription>
          Daftar dengan email dan password, atau lanjutkan dengan akun Google.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
          >
            <span className="font-medium">Gagal mendaftar: </span>
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="register-name">Nama lengkap</Label>
            <Input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Nama lengkap kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
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
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              required
              aria-invalid={Boolean(error)}
              aria-describedby="register-password-hint"
            />
            <p
              id="register-password-hint"
              className="text-xs text-muted-foreground"
            >
              Gunakan minimal 8 karakter.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Membuat akun..." : "Buat akun"}
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
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Masuk di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

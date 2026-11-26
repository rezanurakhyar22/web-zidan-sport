import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import { TwoFactorSettings } from "@/components/auth/two-factor-settings";

export const metadata = {
  title: "Keamanan Akun",
};

export default async function SecuritySettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const credentialAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "credential",
    },
    select: {
      id: true,
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
              Keamanan Akun
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Kelola autentikasi dua faktor (2FA) dan backup codes
            </p>
          </div>
          <nav
            aria-label="Navigasi pengaturan keamanan"
            className="flex flex-wrap items-center gap-2"
          >
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "outline" })}
            >
              Kembali ke Dashboard
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <TwoFactorSettings
          initialEnabled={Boolean(session.user.twoFactorEnabled)}
          hasPasswordAccount={Boolean(credentialAccount)}
          userEmail={session.user.email}
        />
      </main>
    </div>
  );
}

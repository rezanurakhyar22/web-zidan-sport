import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata = {
  title: "Dashboard",
};

function getInitials(name?: string | null, email?: string | null): string {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user, session: activeSession } = session;
  const expiresAtFormatted = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(activeSession.expiresAt));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Sesi terverifikasi di server melalui Better Auth
            </p>
          </div>
          <nav
            aria-label="Navigasi dashboard"
            className="flex flex-wrap items-center gap-2"
          >
            <Link
              href="/settings/security"
              className={buttonVariants({ variant: "outline" })}
            >
              Keamanan Akun
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            {user.image ? (
              <img
                src={user.image}
                alt={`Foto profil ${user.name || user.email}`}
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-full border border-border object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold text-secondary-foreground"
              >
                {getInitials(user.name, user.email)}
              </div>
            )}
            <div className="min-w-0">
              <CardTitle className="truncate text-xl">
                {user.name || "Pengguna"}
              </CardTitle>
              <CardDescription className="truncate">
                {user.email}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="border-t border-border pt-6">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-muted-foreground">ID Pengguna</dt>
                <dd className="break-all font-mono text-xs text-foreground">
                  {user.id}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="text-muted-foreground">Status Email</dt>
                <dd className="font-medium text-foreground">
                  {user.emailVerified ? "Terverifikasi" : "Belum diverifikasi"}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="text-muted-foreground">ID Sesi</dt>
                <dd className="break-all font-mono text-xs text-foreground">
                  {activeSession.id}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="text-muted-foreground">Sesi Berlaku Hingga</dt>
                <dd className="font-medium text-foreground">
                  {expiresAtFormatted}
                </dd>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <dt className="text-muted-foreground">
                  Autentikasi Dua Faktor (2FA)
                </dt>
                <dd className="flex flex-wrap items-center gap-3 font-medium text-foreground">
                  <span>
                    {user.twoFactorEnabled ? "Aktif" : "Belum aktif"}
                  </span>
                  <Link
                    href="/settings/security"
                    className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Kelola 2FA
                  </Link>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TwoFactorVerifyForm } from "@/components/auth/two-factor-verify-form";

export const metadata = {
  title: "Verifikasi Dua Faktor",
};

export default async function TwoFactorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <TwoFactorVerifyForm />
    </main>
  );
}

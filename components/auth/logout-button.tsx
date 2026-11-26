"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });

      if (result?.error) {
        setError(result.error.message || "Gagal keluar dari sesi.");
        setIsLoading(false);
      }
    } catch {
      setError("Terjadi kesalahan saat logout. Coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        type="button"
        variant="outline"
        onClick={handleLogout}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? "Keluar..." : "Logout"}
      </Button>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  ...(process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    ? { baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL }
    : {}),
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/two-factor"
        ) {
          window.location.href = "/two-factor";
        }
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;

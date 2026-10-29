"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { isAuthenticatedAtom } from "@/atoms/banking-atoms";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    setAuthorized(true);
  }, [isAuthenticated, router]);

  if (!authorized || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  return children;
}

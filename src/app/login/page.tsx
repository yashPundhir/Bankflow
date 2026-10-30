"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { isAuthenticatedAtom } from "@/atoms/banking-atoms";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const setAuthenticated = useSetAtom(isAuthenticatedAtom);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }

    // Mock authentication only: no server or real credential check.
    setIsSubmitting(true);
    setAuthenticated(true);
    router.replace("/dashboard");
  }

  // If an already authenticated user visits /login, send them to the app.
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.473_0.137_46.201/0.13),transparent_55%)]"
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl lg:grid-cols-2">
        {/* Brand panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-muted/30 p-10 lg:flex xl:p-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <CreditCard className="size-5" />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight">Bankflow</p>
                <p className="text-xs text-muted-foreground">Digital banking</p>
              </div>
            </div>

            <div className="mt-20">
              <p className="text-sm font-medium text-primary">
                YOUR MONEY. YOUR CONTROL.
              </p>
              <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                Banking that moves with you.
              </h1>
              <p className="mt-5 max-w-sm leading-7 text-muted-foreground">
                A clearer view of your accounts, everyday transactions, and
                transfers — all in one place.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            {[
              "One view for all your accounts",
              "Transaction activity at a glance",
              "Simple transfers between accounts",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Login form */}
        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Bankflow</p>
              <p className="text-xs text-muted-foreground">Digital banking</p>
            </div>
          </div>

          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LockKeyhole className="size-6" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to continue to your Bankflow dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter any demo password"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-12 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                Sign in <ArrowRight className="size-4" />
              </button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Demo sign-in</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Use any valid email address and a non-empty password.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

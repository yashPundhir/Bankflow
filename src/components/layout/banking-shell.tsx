"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeftRight,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  // LogOut,
  Menu,
  ReceiptText,
  X,
  Wallet,
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Accounts", href: "/accounts", icon: Wallet },
  { label: "Transactions", href: "/transactions", icon: ReceiptText },
  { label: "Transfer money", href: "/transfer", icon: ArrowLeftRight },
];

export function BankingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-6">
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <CreditCard className="size-5" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">
                Bankflow
              </span>
              <span className="block text-xs text-muted-foreground">
                Digital banking
              </span>
            </span>
          </Link>

          <button
            type="button"
            aria-label="Close navigation menu"
            className="rounded-md p-2 hover:bg-sidebar-accent md:hidden"
            onClick={closeMobileMenu}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-4 pb-2 pt-7">
          <p className="px-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Workspace
          </p>
        </div>

        <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobileMenu}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="size-4.5" />
                <span>{label}</span>
                {active && (
                  <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/15 text-sm font-semibold text-sidebar-primary">
              YP
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Demo Customer</p>
              <p className="truncate text-xs text-muted-foreground">
                Personal banking
              </p>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
        </div>
      </aside>

      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="rounded-lg border border-border p-2 hover:bg-accent md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>

            <div>
              <p className="text-sm font-medium">
                {navigation.find((item) => item.href === pathname)?.label ??
                  "Bankflow"}
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Your finances, at a glance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">Demo Customer</p>
              <p className="text-xs text-muted-foreground">Personal account</p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold">
              YP
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

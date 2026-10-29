"use client";

import { useAtomValue } from "jotai";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Wallet } from "lucide-react";
import { accountsAtom, transactionsAtom } from "@/atoms/banking-atoms";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function DashboardPage() {
  const accounts = useAtomValue(accountsAtom);
  const transactions = useAtomValue(transactionsAtom);

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0,
  );

  const now = new Date();
  const monthlyTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear() &&
      transaction.status === "successful"
    );
  });

  const monthlyIncome = monthlyTransactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "Total balance",
      value: formatCurrency(totalBalance),
      description: "Across all linked accounts",
      icon: Wallet,
    },
    {
      label: "Monthly income",
      value: formatCurrency(monthlyIncome),
      description: "Successful credits this month",
      icon: ArrowDownLeft,
    },
    {
      label: "Monthly expenses",
      value: formatCurrency(monthlyExpenses),
      description: "Successful debits this month",
      icon: ArrowUpRight,
    },
    {
      label: "Linked accounts",
      value: String(accounts.length).padStart(2, "0"),
      description: "Accounts connected",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">
            Your financial overview
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your money.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Demo account · Fictional data
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, description, icon: Icon }) => (
          <article
            key={label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <Icon className="size-4" />
              </span>
            </div>

            <p className="mt-5 wrap-break-word text-2xl font-semibold tracking-tight">
              {value}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-semibold">Recent transactions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest account activity
            </p>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium">No transactions yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account activity will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentTransactions.map((transaction) => {
              const isCredit = transaction.type === "credit";

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 p-4 sm:px-5"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                      isCredit
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="size-5" />
                    ) : (
                      <ArrowUpRight className="size-5" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {transaction.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(transaction.date)} · {transaction.status}
                    </p>
                  </div>

                  <p
                    className={`shrink-0 text-right text-sm font-semibold ${
                      isCredit ? "text-emerald-500" : ""
                    }`}
                  >
                    {isCredit ? "+" : "−"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

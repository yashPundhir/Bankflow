"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Wallet } from "lucide-react";

import { accountsAtom, transactionsAtom } from "@/atoms/banking-atoms";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Account } from "@/types/banking-constraints";

const accountIcons = {
  savings: Wallet,
  current: CreditCard,
  salary: ArrowDownLeft,
};

export default function AccountsPage() {
  const accounts = useAtomValue(accountsAtom);
  const transactions = useAtomValue(transactionsAtom);

  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts[0]?.id ?? "",
  );

  const selectedAccount = accounts.find(
    (account) => account.id === selectedAccountId,
  );

  const accountTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccountId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function selectAccount(account: Account) {
    setSelectedAccountId(account.id);
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-muted-foreground">Your finances</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Your accounts
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your linked accounts and review their activity.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => {
          const Icon = accountIcons[account.accountType];
          const isSelected = account.id === selectedAccountId;

          return (
            <button
              key={account.id}
              type="button"
              onClick={() => selectAccount(account)}
              aria-pressed={isSelected}
              className={`rounded-2xl border p-5 text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs capitalize text-muted-foreground">
                  {account.accountType}
                </span>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                {account.name}
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {formatCurrency(account.balance)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Account {account.accountNumber}
              </p>
              <p className="mt-4 text-xs font-medium text-primary">
                {isSelected ? "Currently selected" : "View account activity"}
              </p>
            </button>
          );
        })}
      </section>

      {selectedAccount && (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{selectedAccount.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedAccount.accountNumber} · {selectedAccount.accountType}{" "}
                account
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-muted-foreground">Available balance</p>
              <p className="text-xl font-semibold">
                {formatCurrency(selectedAccount.balance)}
              </p>
            </div>
          </div>

          <div className="p-5">
            <h3 className="mb-4 font-medium">Account activity</h3>

            {accountTransactions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-12 text-center">
                <Wallet className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No transactions yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Activity for this account will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {accountTransactions.map((transaction) => {
                  const isCredit = transaction.type === "credit";

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-3 rounded-xl px-2 py-4 sm:px-3"
                    >
                      <div
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
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {transaction.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(transaction.date)} ·{" "}
                          <span className="capitalize">
                            {transaction.status}
                          </span>
                        </p>
                      </div>

                      <p
                        className={`shrink-0 text-sm font-semibold ${
                          isCredit ? "text-emerald-500" : "text-foreground"
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
          </div>
        </section>
      )}
    </div>
  );
}

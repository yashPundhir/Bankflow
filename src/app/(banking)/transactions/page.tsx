"use client";

import { useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import {
  ArrowDownLeft,
  // ArrowDownUp,
  // ArrowLeft,
  ArrowLeftRight,
  // ArrowRight,
  // ArrowUpDown,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";

import { accountsAtom, transactionsAtom } from "@/atoms/banking-atoms";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@/types/banking-constraints";

type TypeFilter = "all" | TransactionType;
type StatusFilter = "all" | TransactionStatus;
type SortOption = "newest" | "oldest" | "highest" | "lowest";

const PAGE_SIZE = 6;

function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    successful: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    failed: "border-destructive/20 bg-destructive/10 text-destructive",
  };

  const StatusIcon = {
    successful: CheckCircle2,
    pending: Clock3,
    failed: CircleAlert,
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      <StatusIcon className="size-3.5" />
      {status}
    </span>
  );
}

function TransactionAmount({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.type === "credit";

  return (
    <span
      className={`font-semibold tabular-nums ${
        isCredit ? "text-emerald-500" : "text-foreground"
      }`}
    >
      {isCredit ? "+" : "−"}
      {formatCurrency(transaction.amount)}
    </span>
  );
}

export default function TransactionsPage() {
  const transactions = useAtomValue(transactionsAtom);
  const accounts = useAtomValue(accountsAtom);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const totalCredits = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalDebits = transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = transactions.filter((transaction) => {
      const account = accounts.find(
        (item) => item.id === transaction.accountId,
      );

      const matchesSearch =
        !query ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.referenceNumber.toLowerCase().includes(query) ||
        (account?.name.toLowerCase().includes(query) ?? false);

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      const matchesAccount =
        accountFilter === "all" || transaction.accountId === accountFilter;

      return matchesSearch && matchesType && matchesStatus && matchesAccount;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest":
          return b.amount - a.amount;
        case "lowest":
          return a.amount - b.amount;
        case "newest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [
    transactions,
    accounts,
    search,
    typeFilter,
    statusFilter,
    accountFilter,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    statusFilter !== "all" ||
    accountFilter !== "all";

  function clearFilters() {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setAccountFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Your financial activity
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track, search, and manage your account activity.
          </p>
        </div>
      </section>

      {/* Summary cards */}
      <section
        aria-label="Transaction summary"
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total transactions
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ArrowLeftRight className="size-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold tabular-nums">
            {transactions.length.toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Across all linked accounts
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total credits</span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <ArrowDownLeft className="size-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold tabular-nums">
            {formatCurrency(totalCredits)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            All recorded incoming transactions
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total debits</span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ArrowUpRight className="size-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold tabular-nums">
            {formatCurrency(totalDebits)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            All recorded outgoing transactions
          </p>
        </div>
      </section>

      {/* Main transactions panel */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">All activity</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredTransactions.length} matching{" "}
              {filteredTransactions.length === 1
                ? "transaction"
                : "transactions"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            <span>Filter and sort transactions</span>
          </div>
        </div>

        {/* Search and filters */}
        <div className="space-y-4 border-b border-border p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              aria-label="Search transactions"
              placeholder="Search description, account, or reference..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <label
                htmlFor="filter-type"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Transaction type
              </label>
              <select
                id="filter-type"
                value={typeFilter}
                onChange={(event) => {
                  setTypeFilter(event.target.value as TypeFilter);
                  setCurrentPage(1);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All types</option>
                <option value="credit">Credits</option>
                <option value="debit">Debits</option>
              </select>
              <ChevronDown className="pointer-events-none absolute bottom-3 right-3 size-4 text-muted-foreground" />
            </div>

            <div className="relative">
              <label
                htmlFor="filter-status"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Status
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter);
                  setCurrentPage(1);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All statuses</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown className="pointer-events-none absolute bottom-3 right-3 size-4 text-muted-foreground" />
            </div>

            <div className="relative">
              <label
                htmlFor="filter-account"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Account
              </label>
              <select
                id="filter-account"
                value={accountFilter}
                onChange={(event) => {
                  setAccountFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All accounts</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute bottom-3 right-3 size-4 text-muted-foreground" />
            </div>

            <div className="relative">
              <label
                htmlFor="sort-transactions"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Sort by
              </label>
              <select
                id="sort-transactions"
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest">Highest amount</option>
                <option value="lowest">Lowest amount</option>
              </select>
              <ChevronDown className="pointer-events-none absolute bottom-3 right-3 size-4 text-muted-foreground" />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Filters are applied immediately.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <X className="size-3.5" />
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Transaction list */}
        {paginatedTransactions.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              {transactions.length === 0 ? (
                <Wallet className="size-6" />
              ) : (
                <Filter className="size-6" />
              )}
            </div>
            <h3 className="mt-4 font-semibold">
              {transactions.length === 0
                ? "No transactions yet"
                : "No matching transactions"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {transactions.length === 0
                ? "Your account activity will appear here when transactions are recorded."
                : "Try changing your search or filters to find what you're looking for."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-medium">
                      Transaction
                    </th>
                    <th scope="col" className="px-5 py-4 font-medium">
                      Account
                    </th>
                    <th scope="col" className="px-5 py-4 font-medium">
                      Date
                    </th>
                    <th scope="col" className="px-5 py-4 font-medium">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-right font-medium"
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedTransactions.map((transaction) => {
                    const account = accounts.find(
                      (item) => item.id === transaction.accountId,
                    );
                    const isCredit = transaction.type === "credit";

                    return (
                      <tr
                        key={transaction.id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
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
                            <div className="min-w-0">
                              <p className="max-w-55 truncate font-medium">
                                {transaction.description}
                              </p>
                              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                                {transaction.referenceNumber}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium">
                            {account?.name ?? "Unknown account"}
                          </p>
                          <p className="mt-1 text-xs capitalize text-muted-foreground">
                            {transaction.type}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={transaction.status} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <TransactionAmount transaction={transaction} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border md:hidden">
              {paginatedTransactions.map((transaction) => {
                const account = accounts.find(
                  (item) => item.id === transaction.accountId,
                );
                const isCredit = transaction.type === "credit";

                return (
                  <article key={transaction.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
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
                        <p className="wrap-break-words text-sm font-medium">
                          {transaction.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {account?.name ?? "Unknown account"}
                        </p>
                        <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                          {transaction.referenceNumber}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <TransactionAmount transaction={transaction} />
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pl-13">
                      <span className="text-xs capitalize text-muted-foreground">
                        {transaction.type}
                      </span>
                      <StatusBadge status={transaction.status} />
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(safePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(safePage * PAGE_SIZE, filteredTransactions.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredTransactions.length}
                </span>{" "}
                transactions
              </p>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={safePage <= 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="flex size-9 items-center justify-center rounded-lg border border-border hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <span className="min-w-20 text-center text-sm text-muted-foreground">
                  Page {safePage} of {Math.max(totalPages, 1)}
                </span>

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(Math.max(totalPages, 1), page + 1),
                    )
                  }
                  className="flex size-9 items-center justify-center rounded-lg border border-border hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Transaction amounts and records are mock data for this demo.
      </p>
    </div>
  );
}

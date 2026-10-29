"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  // ArrowDownLeft,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { accountsAtom } from "@/atoms/banking-atoms";
import { executeTransferAtom } from "@/atoms/transfer-atom";
import { formatCurrency } from "@/lib/formatters";

type Step = "details" | "review" | "success";

export default function TransferPage() {
  const accounts = useAtomValue(accountsAtom);
  const executeTransfer = useSetAtom(executeTransferAtom);

  const [step, setStep] = useState<Step>("details");
  const [sourceId, setSourceId] = useState(accounts[0]?.id ?? "");
  const [destinationId, setDestinationId] = useState(
    accounts[1]?.id ?? accounts[0]?.id ?? "",
  );
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  const source = accounts.find((account) => account.id === sourceId);
  const destination = accounts.find((account) => account.id === destinationId);

  function validateDetails(): string | null {
    if (!source || !destination) {
      return "Please select both accounts.";
    }

    if (source.id === destination.id) {
      return "Choose two different accounts.";
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) {
      return "Enter a valid amount with up to two decimal places.";
    }

    const amountPaise = Math.round(Number(amount) * 100);

    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
      return "Enter a valid transfer amount.";
    }

    if (amountPaise > source.balance) {
      return "The transfer amount exceeds your available balance.";
    }

    return null;
  }

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validateDetails();

    if (validationError) {
      setError(validationError);
      return;
    }

    setStep("review");
  }

  function handleConfirm() {
    setError("");

    // Revalidate using the latest account state at confirmation time.
    const validationError = validateDetails();

    if (validationError) {
      setStep("details");
      setError(validationError);
      return;
    }

    const result = executeTransfer({
      sourceAccountId: sourceId,
      destinationAccountId: destinationId,
      amountPaise: Math.round(Number(amount) * 100),
      description: description.trim() || "Account transfer",
    });

    if (!result.success) {
      setStep("details");
      setError(result.error);
      return;
    }

    setReferenceNumber(result.referenceNumber);
    setStep("success");
  }

  function resetTransfer() {
    setAmount("");
    setDescription("");
    setError("");
    setReferenceNumber("");
    setStep("details");
  }

  if (accounts.length < 2) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
        <Wallet className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">
          Two accounts are required
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Link at least two accounts before making a transfer.
        </p>
        <Link
          href="/accounts"
          className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          View accounts
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <p className="text-sm text-muted-foreground">Move money securely</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Transfer money
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Transfer funds between your linked Bankflow accounts.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Transfer details", number: "01", key: "details" },
          { label: "Review transfer", number: "02", key: "review" },
          { label: "Confirmation", number: "03", key: "success" },
        ].map((item, index) => {
          const active = item.key === step;
          const completed =
            (step === "review" && index === 0) ||
            (step === "success" && index < 2);

          return (
            <div
              key={item.key}
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                active ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  active || completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {completed ? "✓" : item.number}
              </span>
              <span
                className={`text-sm font-medium ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {step === "success" ? (
        <section
          aria-live="polite"
          className="rounded-2xl border border-border bg-card px-5 py-10 text-center sm:px-10"
        >
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-9" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Transfer successful</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your mock transfer has been recorded successfully.
          </p>

          <p className="mt-7 text-sm text-muted-foreground">
            Amount transferred
          </p>
          <p className="mt-1 text-3xl font-semibold">
            {formatCurrency(Math.round(Number(amount) * 100))}
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-xl border border-border p-4 text-left">
            <div className="flex justify-between gap-4 py-2 text-sm">
              <span className="text-muted-foreground">From</span>
              <span className="text-right font-medium">
                {source?.name ?? "Source account"}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2 text-sm">
              <span className="text-muted-foreground">To</span>
              <span className="text-right font-medium">
                {destination?.name ?? "Destination account"}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2 text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="break-all text-right font-mono text-xs">
                {referenceNumber}
              </span>
            </div>
          </div>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={resetTransfer}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Make another transfer
            </button>
            <Link
              href="/transactions"
              className="rounded-lg border border-border px-5 py-3 text-sm font-medium hover:bg-accent"
            >
              View transactions
            </Link>
          </div>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {step === "review" ? (
                  <ShieldCheck className="size-5" />
                ) : (
                  <ArrowLeftRight className="size-5" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {step === "review"
                    ? "Review your transfer"
                    : "Transfer details"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step === "review"
                    ? "Check everything before confirming."
                    : "Choose your accounts and enter an amount."}
                </p>
              </div>
            </div>
          </div>

          {step === "details" ? (
            <form onSubmit={handleReview} className="space-y-6 p-5 sm:p-7">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="source-account"
                    className="text-sm font-medium"
                  >
                    From account
                  </label>
                  <select
                    id="source-account"
                    value={sourceId}
                    onChange={(event) => {
                      setSourceId(event.target.value);
                      setError("");
                    }}
                    required
                    className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} · {account.accountNumber}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Available: {formatCurrency(source?.balance ?? 0)}
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="destination-account"
                    className="text-sm font-medium"
                  >
                    To account
                  </label>
                  <select
                    id="destination-account"
                    value={destinationId}
                    onChange={(event) => {
                      setDestinationId(event.target.value);
                      setError("");
                    }}
                    required
                    className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} · {account.accountNumber}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Destination account balance:{" "}
                    {formatCurrency(destination?.balance ?? 0)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ArrowUpRight className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {source?.name ?? "Source"}{" "}
                      <ArrowRight className="mx-1 inline size-3.5" />{" "}
                      {destination?.name ?? "Destination"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Transfers between your linked accounts
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="transfer-amount"
                  className="text-sm font-medium"
                >
                  Transfer amount (INR)
                </label>
                <div className="flex items-center rounded-xl border border-border bg-background px-4 focus-within:ring-2 focus-within:ring-ring">
                  <span className="text-lg text-muted-foreground">₹</span>
                  <input
                    id="transfer-amount"
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    max={source ? source.balance / 100 : undefined}
                    required
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setError("");
                    }}
                    placeholder="0.00"
                    className="w-full bg-transparent px-3 py-4 text-xl font-semibold outline-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum available: {formatCurrency(source?.balance ?? 0)}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="transfer-description"
                  className="text-sm font-medium"
                >
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="transfer-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={100}
                  placeholder="e.g. Monthly savings"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Review transfer <ArrowRight className="size-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-6 p-5 sm:p-7">
              <div className="rounded-2xl bg-primary/5 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  You are transferring
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">
                  {formatCurrency(Math.round(Number(amount) * 100))}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  No transfer fee in this demo
                </p>
              </div>

              <div className="divide-y divide-border rounded-xl border border-border px-4">
                <div className="flex justify-between gap-4 py-4 text-sm">
                  <span className="text-muted-foreground">From</span>
                  <span className="text-right font-medium">
                    {source?.name} · {source?.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-4 text-sm">
                  <span className="text-muted-foreground">To</span>
                  <span className="text-right font-medium">
                    {destination?.name} · {destination?.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-4 text-sm">
                  <span className="text-muted-foreground">Description</span>
                  <span className="text-right font-medium">
                    {description.trim() || "Account transfer"}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-4 text-sm">
                  <span className="text-muted-foreground">
                    Remaining balance
                  </span>
                  <span className="text-right font-medium">
                    {formatCurrency(
                      (source?.balance ?? 0) - Math.round(Number(amount) * 100),
                    )}
                  </span>
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep("details");
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 text-sm font-medium hover:bg-accent"
                >
                  <ArrowLeft className="size-4" /> Edit details
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  <CheckCircle2 className="size-4" /> Confirm transfer
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

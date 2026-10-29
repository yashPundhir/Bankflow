import { atom } from "jotai";
import { accountsAtom, transactionsAtom } from "@/atoms/banking-atoms";
import type { Account, Transaction } from "@/types/banking-constraints";

export interface TransferInput {
  sourceAccountId: string;
  destinationAccountId: string;
  amountPaise: number;
  description: string;
}

export type TransferResult =
  | { success: true; referenceNumber: string }
  | { success: false; error: string };

export const executeTransferAtom = atom(
  null,
  (get, set, input: TransferInput): TransferResult => {
    const accounts = get(accountsAtom);
    const transactions = get(transactionsAtom);

    const source = accounts.find(
      (account) => account.id === input.sourceAccountId,
    );
    const destination = accounts.find(
      (account) => account.id === input.destinationAccountId,
    );

    // Validate everything before changing any state.
    if (!source || !destination) {
      return { success: false, error: "Please select valid accounts." };
    }

    if (source.id === destination.id) {
      return {
        success: false,
        error: "Source and destination must be different accounts.",
      };
    }

    if (!Number.isSafeInteger(input.amountPaise) || input.amountPaise <= 0) {
      return {
        success: false,
        error: "Enter a valid amount greater than zero.",
      };
    }

    if (source.balance < input.amountPaise) {
      return {
        success: false,
        error: "Insufficient funds in the source account.",
      };
    }

    if (
      !Number.isSafeInteger(source.balance - input.amountPaise) ||
      !Number.isSafeInteger(destination.balance + input.amountPaise)
    ) {
      return {
        success: false,
        error: "This transfer amount is too large.",
      };
    }

    const referenceNumber = `BF-${Date.now()}`;
    const now = new Date().toISOString();
    const amount = input.amountPaise;
    const description = input.description.trim() || "Account transfer";

    const debit: Transaction = {
      id: `${referenceNumber}-D`,
      accountId: source.id,
      description: description
        ? `${description} — transfer to ${destination.name}`
        : `Transfer to ${destination.name}`,
      amount,
      type: "debit",
      status: "successful",
      date: now,
      referenceNumber,
    };

    const credit: Transaction = {
      id: `${referenceNumber}-C`,
      accountId: destination.id,
      description: description
        ? `${description} — transfer from ${source.name}`
        : `Transfer from ${source.name}`,
      amount,
      type: "credit",
      status: "successful",
      date: now,
      referenceNumber,
    };

    const updatedAccounts: Account[] = accounts.map((account) => {
      if (account.id === source.id) {
        return { ...account, balance: account.balance - amount };
      }

      if (account.id === destination.id) {
        return { ...account, balance: account.balance + amount };
      }

      return account;
    });

    // Both atom updates occur synchronously in the same write operation.
    set(accountsAtom, updatedAccounts);
    set(transactionsAtom, [debit, credit, ...transactions]);

    return { success: true, referenceNumber };
  },
);

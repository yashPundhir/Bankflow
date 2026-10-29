import { atom } from "jotai";

import { initialAccounts, initialTransactions } from "@/lib/mock-data";

export const accountsAtom = atom(initialAccounts);

export const transactionsAtom = atom(initialTransactions);

export const isAuthenticatedAtom = atom(false);

export type AccountType = "savings" | "current" | "salary";

export type TransactionType = "credit" | "debit";

export type TransactionStatus = "successful" | "pending" | "failed";

export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  referenceNumber: string;
}

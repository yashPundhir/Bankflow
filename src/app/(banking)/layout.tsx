import { BankingShell } from "@/components/layout/banking-shell";

export default function BankingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BankingShell>{children}</BankingShell>;
}

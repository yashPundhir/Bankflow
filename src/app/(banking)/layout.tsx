import { BankingShell } from "@/components/layout/banking-shell";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function BankingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <BankingShell>{children}</BankingShell>
    </AuthGuard>
  );
}

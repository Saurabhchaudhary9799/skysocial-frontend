"use client";

import AuthGate from "@/components/providers/AuthGate";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate mode="guest" redirectTo="/home">
      <div className="min-h-screen bg-background">{children}</div>
    </AuthGate>
  );
}

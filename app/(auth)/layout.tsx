import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUser();

  if (session) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen bg-background">{children}</div>
  );
}

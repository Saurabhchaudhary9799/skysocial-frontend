export const dynamic = "force-dynamic";
import Sidebar from "@/components/home/Sidebar";
import Header from "@/components/header/header";
import AuthGate from "@/components/providers/AuthGate";
import SocketInitializer from "@/components/providers/socketInitializer";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate mode="protected" redirectTo="/login">
      <>
        <SocketInitializer />

        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(89,92,251,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(173,181,255,0.22),_transparent_30%),linear-gradient(180deg,#f7f4ff_0%,#f2efff_100%)]">
          <div className="mx-auto grid max-w-[1440px] gap-2 lg:grid-cols-[260px_minmax(0,1fr)] ">
            <aside className="hidden lg:block sticky top-0 h-screen">
              <Sidebar />
            </aside>

            <div className="min-w-0 ">
              <Header />
              {children}
            </div>
          </div>
        </main>
      </>
    </AuthGate>
  );
}
